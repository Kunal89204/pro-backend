import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Bookmark } from "../models/bookmark.model.js";
import WatchHistory from "../models/watchHistory.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { redis } from "../../index.js";

const createTweet = asyncHandler(async (req, res) => {
  console.log("requested");
  const { content } = req.body;
  const userId = req?.user?._id;
  const localImagePath = req?.file?.path;

  console.log({ userId, localImagePath, content });

  if (!content) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Content is required"));
  }

  let imageUrl = null;

  if (localImagePath) {
    const uploadedImage = await uploadOnCloudinary(localImagePath);
    if (!uploadedImage?.secure_url) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Error while uploading image"));
    }
    imageUrl = uploadedImage.secure_url;
  }

  const tweet = await Tweet.create({
    content,
    image: imageUrl,
    owner: userId,
  });

  // Invalidate all home feed cache pages
  try {
    // Use Redis SCAN to find all homeFeed:page:* keys and delete them
    const keys = [];
    for await (const key of redis.scanIterator({
      MATCH: "homeFeed:page:*",
      COUNT: 100,
    })) {
      keys.push(key);
    }
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🔁 Redis home feed cache invalidated (${keys.length} keys)`);
    }
  } catch (err) {
    console.error("❌ Error invalidating home feed cache:", err);
    // Don't block tweet creation on cache error
  }

  res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getTweetsOfUser = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const username = req?.params?.username;

  console.log("username", username)

  const user = await User.findOne({ username }).select("-password -refreshToken -watchHistory");

  const tweets = await Tweet.find({ owner: user._id }).sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const getTweets = asyncHandler(async (req, res) => {
  const { page, limit } = req?.query;
  const tweets = await Tweet.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const getTweetById = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  const tweet = await Tweet.findById(id).populate(
    "owner",
    "fullName username email avatar coverImage subscribersCount bio"
  );

  if(!tweet) {
    return res.status(404).json(new ApiResponse(404, null, "Tweet not found"));
  }

  const tweetsCount = await Tweet.countDocuments({ owner: tweet?.owner });

  res
    .status(200)
    .json(
      new ApiResponse(200, { tweet, tweetsCount }, "Tweet fetched successfully")
    );
});

const bookmarkTweet = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  const userId = req?.user?._id;
  const tweet = await Tweet.findById(id);
  if (!tweet) {
    return res.status(404).json(new ApiResponse(404, null, "Tweet not found"));
  }

  const bookmark = await Bookmark.findOne({ tweet: id, bookmarkedBy: userId });
  if (bookmark) {
    // If bookmark exists, remove it (toggle off)
    await Bookmark.findByIdAndDelete(bookmark._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Bookmark removed successfully"));
  }

  // If bookmark doesn't exist, create it (toggle on)
  await Bookmark.create({ tweet: id, bookmarkedBy: userId });
  res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet bookmarked successfully"));
});

const getBookmarkedTweets = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  const bookmarks = await Bookmark.find({ bookmarkedBy: userId })
    .populate({
      path: "tweet",
      select:
        "content image owner createdAt _id likesCount commentsCount viewsCount",
      populate: {
        path: "owner",
        select: "fullName username avatar _id",
      },
    })
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(
      new ApiResponse(200, bookmarks, "Bookmarked tweets fetched successfully")
    );
});

const bookmarkStatus = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const tweetId = req?.params?.id;
  const bookmark = await Bookmark.findOne({
    tweet: tweetId,
    bookmarkedBy: userId,
  });

  if (bookmark) {
    return res.status(200).json({
      success: true,
      message: "Tweet bookmarked",
      data: {
        isBookmarked: true,
      },
    });
  }

  return res.status(200).json({
    success: true,
    message: "Tweet not bookmarked",
    data: {
      isBookmarked: false,
    },
  });
});

const addTweetView = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  const userId = req?.user?._id;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const [tweet, existingView] = await Promise.all([
        Tweet.findById(id).session(session),
        WatchHistory.findOne({ tweetId: id, userId }).session(session),
      ]);

      if (!tweet) {
        throw new Error("Tweet not found");
      }

      if (existingView) {
        return res
          .status(200)
          .json(new ApiResponse(200, existingView, "Tweet already viewed"));
      }

      await Promise.all([
        WatchHistory.create([{ tweetId: id, userId }], { session }),
        Tweet.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } }, { session }),
      ]);

      const newView = await WatchHistory.findOne({
        tweetId: id,
        userId,
      }).session(session);

      res
        .status(200)
        .json(new ApiResponse(200, newView, "Tweet viewed successfully"));
    });
  } catch (error) {
    if (error.message === "Tweet not found") {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Tweet not found"));
    }
    throw error;
  } finally {
    await session.endSession();
  }
});


const getTweetByIdForEmbed = asyncHandler(async (req, res) => {
  const { tweetid } = req?.params;

  // Check if tweetid is provided
  if (!tweetid) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Tweet ID is required"));
  }

  // Validate if tweetid is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(tweetid)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid Tweet ID format"));
  }

  const tweet = await Tweet.findById(tweetid).populate("owner", "fullName username avatar _id");

  // Check if tweet exists
  if (!tweet) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Tweet not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet fetched successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid tweet ID"));
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Tweet not found"));
  }

  if (tweet.owner.toString() !== userId.toString()) {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "You are not authorized to delete this tweet"));
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await Bookmark.deleteMany({ tweet: tweetId }).session(session);
      await Like.deleteMany({ tweet: tweetId }).session(session);
      await Comment.deleteMany({ tweet: tweetId }).session(session);
      await WatchHistory.deleteMany({ tweetId }).session(session);
      await Tweet.deleteOne({ _id: tweetId }).session(session);
    });

    // Invalidate all home feed cache pages in Redis
    try {
      const keys = [];
      for await (const key of redis.scanIterator({
        MATCH: "homeFeed:page:*",
        COUNT: 100,
      })) {
        keys.push(key);
      }
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`🔁 Redis home feed cache invalidated (${keys.length} keys)`);
      }
    } catch (err) {
      console.error("❌ Error invalidating home feed cache after tweet deletion:", err);
      // Don't block tweet deletion on cache error
    }

    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, { deletedTweetId: tweetId }, "Tweet deleted successfully"));
  } catch (error) {
    session.endSession();
    throw error;
  }
});


export {
  createTweet,
  getTweetsOfUser,
  getTweets,
  getTweetById,
  bookmarkTweet,
  getBookmarkedTweets,
  bookmarkStatus,
  addTweetView,
  getTweetByIdForEmbed,
  deleteTweet,
};
