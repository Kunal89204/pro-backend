import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from '../models/video.model.js'
import { generateThumbnail } from "../utils/generateThumbnail.js";



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const pipeline = [];
    const matchStage = {};

    // Search filter
    if (query) {
        matchStage.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

    // Filter by userId
    if (userId) {
        matchStage.owner = userId;
    }

    if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
    }

    // Populate owner field with selected fields only
    pipeline.push({
        $lookup: {
            from: "users", // Collection name in MongoDB
            localField: "owner",
            foreignField: "_id",
            as: "ownerDetails"
        }
    });

    // Unwind ownerDetails to convert array to object
    pipeline.push({
        $unwind: {
            path: "$ownerDetails",
            preserveNullAndEmptyArrays: true // Keeps videos even if owner is missing
        }
    });

    // Project stage to exclude unwanted fields
    pipeline.push({
        $project: {
            "ownerDetails.password": 0,
            "ownerDetails.createdAt": 0,
            "ownerDetails.updatedAt": 0,
            "ownerDetails.__v": 0,
            "ownerDetails.watchHistory": 0,
            "ownerDetails.coverImage": 0,
            "ownerDetails.email": 0,
            "ownerDetails.refreshToken": 0,
        }
    });

    // Sort stage
    pipeline.push({
        $sort: { [sortBy || "createdAt"]: sortType === "asc" ? 1 : -1 }
    });

    // Count total documents (for pagination)
    const totalCountPipeline = [...pipeline, { $count: "total" }];
    const totalCountResult = await Video.aggregate(totalCountPipeline);
    const totalVideos = totalCountResult[0]?.total || 0;
    const totalPages = Math.ceil(totalVideos / limitNumber);

    // Pagination
    pipeline.push({ $skip: (pageNumber - 1) * limitNumber });
    pipeline.push({ $limit: limitNumber });

    // Fetch videos
    const videos = await Video.aggregate(pipeline);

    return res.status(200).json(
        new ApiResponse(200, { videos, totalVideos, totalPages, currentPage: pageNumber }, "Videos fetched successfully")
    );
});


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, publish } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    // Safely access files
    const videoFile = req.files?.videoFile?.[0];
    let thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile) {
        throw new ApiError(400, "Video file is required");
    }

    let videoLocalPath = videoFile.path;
    let thumbnailLocalPath = thumbnailFile?.path; // Optional: Only if provided

    // If no thumbnail is provided, generate one
    if (!thumbnailLocalPath) {
        thumbnailLocalPath = await generateThumbnail(videoLocalPath, "./public/temp");

        if (!thumbnailLocalPath) {
            console.log('error extracting thumbnail')
        }
    }

    console.log( thumbnailLocalPath)

    // Upload to Cloudinary
    const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!uploadedVideo || !uploadedThumbnail) {
        console.log('here is the error')
        throw new ApiError(500, "Error while uploading video or thumbnail");
    }

    // Save in DB
    const video = await Video.create({
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        title,
        description,
        isPublished: publish,
        duration: uploadedVideo.duration,
        owner: req.user._id
    });

    console.log({ uploadedVideo, uploadedThumbnail });

    return res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId).populate('owner', "-password -watchHistory -email -coverImage -createdAt -updatedAt -__v -refreshToken",);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video fetched successfully")
        );
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    if (!title && !description) {
        throw new ApiError(400, "At least one field is required to update");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to update this video");
    }

    if (title) video.title = title;
    if (description) video.description = description;

    await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video updated successfully")
        );
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to toggle video status");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video,
                `Video ${video.isPublished ? "published" : "unpublished"} successfully`
            )
        );
})

const userVideos = async (req, res) => {
    try {
        const userId = req.user._id;

        // Default values for pagination
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        // Ensure page & limit are positive
        if (page < 1) page = 1;
        if (limit < 1) limit = 10;

        const skip = (page - 1) * limit;

        // Fetch videos with pagination
        const videos = await Video.find({ owner: userId })
            .sort({ createdAt: -1 }) // Sort by newest videos first
            .skip(skip)
            .limit(limit);

        // Count total videos for pagination info
        const totalVideos = await Video.countDocuments({ owner: userId });

        res.json({
            success: true,
            page,
            limit,
            totalVideos,
            totalPages: Math.ceil(totalVideos / limit),
            videos
        });

    } catch (error) {
        console.error("Error fetching user videos:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export { getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo, userVideos }
