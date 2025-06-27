import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";


const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });

  if (existingLike) {
    // Unlike the video
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video unliked successfully"));
  }

  // Like the video
  const like = await Like.create({
    video: videoId,
    likedBy: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, like, "Video liked successfully"));
});

const getLikeStatus = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    // 1. Check if the current user has liked the video
    const liked = await Like.exists({
      video: videoId,
      likedBy: userId,
    });

    // 2. Get the like count (aggregate or count)
    const likeCount = await Like.countDocuments({ video: videoId });

    return res.status(200).json({
      liked: !!liked,
      likeCount,
    });
  } catch (err) {
    console.error("Like status error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  });

  if (existingLike) {
    // Unlike the comment
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment unliked successfully"));
  }

  // Like the comment
  const like = await Like.create({
    comment: commentId,
    likedBy: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, like, "Comment liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;
  
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
      throw new ApiError(400, "Invalid tweet ID");
    }
  
    const existingLike = await Like.findOne({
      tweet: tweetId,
      likedBy: userId,
    });
  
    if (existingLike) {
      // Unlike the tweet (delete + decrement)
      await Promise.all([
        Like.findByIdAndDelete(existingLike._id),
        Tweet.findByIdAndUpdate(tweetId, {
          $inc: { likesCount: -1 },
        }),
      ]);
  
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Tweet unliked successfully"));
    }
  
    // Like the tweet (create + increment)
    const like = new Like({ tweet: tweetId, likedBy: userId });
  
    await Promise.all([
      like.save(),
      Tweet.findByIdAndUpdate(tweetId, {
        $inc: { likesCount: 1 },
      }),
    ]);
  
    return res
      .status(201)
      .json(new ApiResponse(201, like, "Tweet liked successfully"));
  });
  
const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.find({
    likedBy: req.user?._id,
    video: { $exists: true },
  }).populate("video");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

const getLikedComments = asyncHandler(async (req, res) => {
  const likedComments = await Like.find({
    likedBy: req.user?._id,
    comment: { $exists: true },
  }).populate("comment");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedComments, "Liked comments fetched successfully")
    );
});

const getLikedTweets = asyncHandler(async (req, res) => {
  const likedTweets = await Like.find({
    likedBy: req.user?._id,
    tweet: { $exists: true },
  }).populate("tweet");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedTweets, "Liked tweets fetched successfully")
    );
});


const getLikeStatusForTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  const liked = await Like.exists({
    tweet: tweetId,
    likedBy: userId,
  });

  return res.status(200).json(new ApiResponse(200, { isLiked: !!liked }, "Like status fetched successfully"));
});

export {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
  getLikedComments,
  getLikedTweets,
  getLikeStatus,
  getLikeStatusForTweet,
};
