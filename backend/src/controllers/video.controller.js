import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { getPublicIdFromUrl } from "../utils/publicIdExtracter.js";

import { Subscription } from "../models/subscription.model.js";

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
      { description: { $regex: query, $options: "i" } },
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
      as: "ownerDetails",
    },
  });

  // Unwind ownerDetails to convert array to object
  pipeline.push({
    $unwind: {
      path: "$ownerDetails",
      preserveNullAndEmptyArrays: true, // Keeps videos even if owner is missing
    },
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
    },
  });

  // Sort stage
  pipeline.push({
    $sort: { [sortBy || "createdAt"]: sortType === "asc" ? 1 : -1 },
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

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videos, totalVideos, totalPages, currentPage: pageNumber },
        "Videos fetched successfully"
      )
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, publish } = req.body;

  if (!title) {
    throw new ApiError(400, "Title and description are required");
  }

  const videoFile = req.files?.videoFile?.[0];
  const customThumbnailFile = req.files?.thumbnail?.[0];

  if (!videoFile) {
    throw new ApiError(400, "Video file is required");
  }

  const videoLocalPath = videoFile.path;

  // 1. Upload video to Cloudinary
  const uploadedVideo = await uploadOnCloudinary(videoLocalPath, {
    resource_type: "video",
  });

  if (!uploadedVideo) {
    throw new ApiError(500, "Error while uploading video");
  }

  let thumbnailUrl = "";

  // 2. If custom thumbnail is provided, upload it
  if (customThumbnailFile) {
    const uploadedThumbnail = await uploadOnCloudinary(
      customThumbnailFile.path
    );
    if (!uploadedThumbnail) {
      throw new ApiError(500, "Error while uploading custom thumbnail");
    }
    thumbnailUrl = uploadedThumbnail.secure_url;
  } else {
    // 3. Else generate thumbnail from Cloudinary video using transformation
    // Example: First frame at 1 second
    thumbnailUrl = `${uploadedVideo.secure_url.replace(".mp4", ".jpg")}?so=1`;
  }

  // 4. Save in DB
  const video = await Video.create({
    videoFile: uploadedVideo.secure_url,
    thumbnail: thumbnailUrl,
    title,
    description,
    isPublished: publish,
    duration: uploadedVideo.duration,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const video = await Video.findById(videoId).populate(
    "owner",
    "-password -watchHistory -email -coverImage -createdAt -updatedAt -__v -refreshToken"
  );

  if (!video) {
    return res.status(404).json({
      success: false,
      message: "Video does not exist or has been removed.",
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const getVideoByIdForEmbed = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId).populate("owner", "fullName _id");
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

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
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

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
});

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
      videos,
    });
  } catch (error) {
    console.error("Error fetching user videos:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    // Validate videoId
    if (!videoId) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Video ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid Video ID",
      });
    }

    // Find the video
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Video not found",
      });
    }

    // Check if the user is permitted to delete the video
    if (req.user._id.toString() !== video.owner.toString()) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: "You are not authorized to delete this video",
      });
    }

    // Extract Public IDs
    const publicVideoId = getPublicIdFromUrl(video.videoFile);
    const publicThumbnailId = getPublicIdFromUrl(video.thumbnail);

    //  Promise.all for concurrent execution
    const data = await Promise.all([
      deleteFromCloudinary(publicVideoId, "video"),
      deleteFromCloudinary(publicThumbnailId),
      Video.deleteOne({ _id: videoId }),
    ]);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Video deleted successfully",
      data,
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal Server Error",
    });
  }
});

const onPageVideoRecommendation = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user._id; // assuming auth middleware

  const currentVideo = await Video.findById(videoId).lean();
  if (!currentVideo)
    return res.status(404).json({ success: false, message: "Video not found" });

  // Step 1: Get channels the user is subscribed to
  const subscriptions = await Subscription.find({ subscriber: userId }).select(
    "channel"
  );
  const subscribedChannelIds = subscriptions.map((sub) =>
    sub.channel.toString()
  );

  const recommendations = await Video.aggregate([
    {
      $match: {
        _id: { $ne: currentVideo._id },
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner", // convert owner array to single object
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        isCreatorSame: {
          $cond: [{ $eq: ["$owner", currentVideo.owner] }, 1, 0],
        },
        isSubscribedCreator: {
          $cond: [
            {
              $in: [
                "$owner",
                subscribedChannelIds.map(
                  (id) => new mongoose.Types.ObjectId(id)
                ),
              ],
            },
            1,
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: [1, { $log10: { $add: ["$views", 1] } }] },
            { $multiply: [2, { $log10: { $add: ["$likeCount", 1] } }] },
            { $multiply: [2, { $log10: { $add: ["$commentCount", 1] } }] },
            { $multiply: [4, "$isCreatorSame"] },
            { $multiply: [5, "$isSubscribedCreator"] },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        duration: 1,
        "owner._id": 1,
        "owner.fullName": 1,
        views: 1,
        createdAt: 1,
        score: 1,
      },
    },
    { $skip: (parseInt(page) - 1) * parseInt(limit) },
    { $limit: parseInt(limit) },
  ]);

  return res.status(200).json({
    success: true,
    message: "Recommended videos fetched successfully",
    data: recommendations,
  });
});

const suggestSearchQueries = asyncHandler(async (req, res) => {
  const { q = "" } = req.query;

  // Validate and sanitize input
  const query = q.trim();
  if (!query || query.length < 2) {
    return res.status(200).json({ suggestions: [] });
  }

  // Escape special regex characters and create case-insensitive pattern
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedQuery, "i");

  try {
    const suggestions = await Video.aggregate([
      {
        $match: {
          isPublished: true,
          $or: [
            { title: { $regex: regex } },
            {
              tags: {
                $exists: true,
                $ne: null,
                $elemMatch: { $regex: regex },
              },
            },
            { description: { $regex: regex } }, // Optional: search in description too
          ],
        },
      },
      {
        $addFields: {
          // Calculate relevance score for better sorting
          relevanceScore: {
            $add: [
              // Higher score for title matches
              {
                $cond: [
                  {
                    $and: [
                      { $ne: ["$title", null] },
                      {
                        $regexMatch: {
                          input: "$title",
                          regex: escapedQuery,
                          options: "i",
                        },
                      },
                    ],
                  },
                  10,
                  0,
                ],
              },
              // Medium score for exact tag matches
              {
                $cond: [
                  {
                    $and: [
                      { $ne: ["$tags", null] },
                      { $isArray: "$tags" },
                      { $gt: [{ $size: "$tags" }, 0] },
                      {
                        $in: [
                          { $toLower: query },
                          {
                            $map: {
                              input: { $ifNull: ["$tags", []] },
                              as: "tag",
                              in: { $toLower: "$tag" },
                            },
                          },
                        ],
                      },
                    ],
                  },
                  8,
                  0,
                ],
              },
              // Lower score for partial tag matches
              {
                $cond: [
                  {
                    $and: [{ $ne: ["$tags", null] }, { $isArray: "$tags" }],
                  },
                  {
                    $size: {
                      $filter: {
                        input: { $ifNull: ["$tags", []] },
                        cond: {
                          $and: [
                            { $ne: ["$this", null] },
                            {
                              $regexMatch: {
                                input: "$this",
                                regex: escapedQuery,
                                options: "i",
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
            ],
          },
        },
      },
      {
        $sort: { relevanceScore: -1, createdAt: -1 },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          tags: 1,
          relevanceScore: 1,
        },
      },
      { $limit: 20 }, // Get more results for better filtering
    ]);

    // Process and deduplicate suggestions
    const processedSuggestions = new Map();

    suggestions.forEach((video) => {
      // Add title if it matches
      if (video.title && regex.test(video.title)) {
        const key = video.title.toLowerCase();
        if (!processedSuggestions.has(key)) {
          processedSuggestions.set(key, {
            text: video.title,
            type: "title",
            score: video.relevanceScore,
          });
        }
      }

      // Add matching tags
      if (video.tags && Array.isArray(video.tags)) {
        video.tags.forEach((tag) => {
          if (tag && regex.test(tag)) {
            const key = tag.toLowerCase();
            if (!processedSuggestions.has(key)) {
              processedSuggestions.set(key, {
                text: tag,
                type: "tag",
                score: video.relevanceScore,
              });
            }
          }
        });
      }
    });

    // Sort by relevance and return top suggestions
    const finalSuggestions = Array.from(processedSuggestions.values())
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.text.toLowerCase() === query.toLowerCase();
        const bExact = b.text.toLowerCase() === query.toLowerCase();
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        // Then sort by score and type
        if (a.score !== b.score) return b.score - a.score;
        if (a.type === "title" && b.type === "tag") return -1;
        if (a.type === "tag" && b.type === "title") return 1;

        return a.text.localeCompare(b.text);
      })
      .slice(0, 10)
      .map((item) => item.text);

    res.status(200).json({
      suggestions: finalSuggestions.reverse(),
      query: query,
      count: finalSuggestions.length,
    });
  } catch (error) {
    console.error("Search suggestion error:", error);
    res.status(500).json({
      error: "Failed to fetch search suggestions",
      suggestions: [],
    });
  }
});

const searchResults = asyncHandler(async (req, res) => {
  const { q = "" } = req.query;
  const query = q.trim();

  if (!query || query.length < 2) {
    return res.status(200).json({ suggestions: [] });
  }

  // Escape regex function
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const escapedQuery = escapeRegex(query);

  const videos = await Video.find({
    $or: [
      { title: { $regex: escapedQuery, $options: "i" } },
      { description: { $regex: escapedQuery, $options: "i" } },
      { tags: { $regex: escapedQuery, $options: "i" } },
    ],
  })
    .populate({
      path: "owner",
      select: "fullName _id avatar username",
    })
    .select("-viewers -videoFile");

  res.status(200).json({ data: videos });
});

const editVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const thumbnail = req?.file?.path;
  const userId = req.user._id;
  const videoId = req.params.videoId;

  if (!title && !description && !thumbnail) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "At least one field is required to update",
    });
  }

  const video = await Video.findById(videoId);

  if (!video) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "Video not found",
    });
  }

  if (video.owner.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      status: 403,
      message: "Unauthorized to edit this video",
    });
  }

  if (title) video.title = title;
  if (description) video.description = description;
  if (thumbnail) {
    const oldUrl = video.thumbnail;
    const uploadedThumbnail = await uploadOnCloudinary(thumbnail);
    video.thumbnail = uploadedThumbnail.secure_url;
    await deleteFromCloudinary(getPublicIdFromUrl(oldUrl));
  }

  await video.save();

  return res.status(200).json({
    success: true,
    status: 200,
    message: "Video edited successfullyeeeee",
    data: {
      title,
      description,
      thumbnail: video.thumbnail,
    },
  });
});

export {
  getAllVideos,
  getVideoById,
  getVideoByIdForEmbed,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  userVideos,
  deleteVideo,
  onPageVideoRecommendation,
  suggestSearchQueries,
  searchResults,
  editVideo,
};
