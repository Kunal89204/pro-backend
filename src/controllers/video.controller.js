import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {Video} from '../models/video.model.js'

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
    const {title, description, publish} = req.body;
    
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }
    
    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }
    
    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    
    if (!videoFile || !thumbnail) {
        throw new ApiError(500, "Error while uploading video or thumbnail");
    }
    
    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        isPublished:publish,
        duration: videoFile.duration,
    
        owner: req.user._id
    });

    console.log({videoFile, thumbnail})


    
    return res
        .status(201)
        .json(
            new ApiResponse(201, video, "Video published successfully")
        );

        
})

const getVideoById = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }
    
    const video = await Video.findById(videoId).populate('owner', "-password -watchHistory -email -coverImage -createdAt -updatedAt -__v -refreshToken", );
    
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
    const {videoId} = req.params;
    const {title, description} = req.body;
    
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
    const {videoId} = req.params;
    
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

export {getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo}
