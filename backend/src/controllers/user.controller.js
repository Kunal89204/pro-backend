import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { getPublicIdFromUrl } from "../utils/publicIdExtracter.js";
import { Video } from "../models/video.model.js";

import { GoogleGenAI } from "@google/genai";

import os from "os";
import fs from "fs";
import WatchHistory from "../models/watchHistory.model.js";
import { Tweet } from "../models/tweet.model.js";
import { redis } from "../../index.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username , email
  // check for images and avatar
  // upload them to cloudinary, avatar check
  // create user object - create entry in db
  // remove password and refresh token field form response
  // check for user creation
  // return response

  const { fullName, email, username, password } = req.body;
  const fields = [fullName, email, username, password];

  if (fields.some((field) => typeof field !== "string" || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    fullName,
    // avatar: avatar.url,
    // coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.log("Request body:", req.body);

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log("User found:", user);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not exist",
    });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log("Is password valid:", isPasswordValid);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Password is incorrect",
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  console.log("Tokens generated:", { accessToken, refreshToken });

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -watchHistory -createdAt -updatedAt -bio -subscribersCount"
  );
  console.log("Logged in user:", loggedInUser);

  const options = {
    httpOnly: false,
    secure: false,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "uSER LOGGED OUT"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, { accessToken, refreshToken: newRefreshToken })
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Inavlid Refresh Token");
  }
});

const changeCurrentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old Password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
  } catch (error) {}
};

const getCurrentUser = async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched"));
};

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, bio } = req.body;

  if (!fullName) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        bio,
      },
    },
    { new: true }
  ).select("fullName bio");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  const { publicUrl } = req.body;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: {
        avatar: avatar.secure_url,
      },
    },
    { new: true }
  ).select("-password");

  if (publicUrl) {
    await deleteFromCloudinary(getPublicIdFromUrl(publicUrl));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Image Updated"));
});

const updateUserCoverImg = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  const { publicUrl } = req.body;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "CoverImage file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on coverImage");
  }

  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: {
        coverImage: coverImage.secure_url,
      },
    },
    { new: true }
  ).select("-password");

  let deleteOldCoverImage;
  if (publicUrl) {
    deleteOldCoverImage = await deleteFromCloudinary(
      getPublicIdFromUrl(publicUrl)
    );
  }

  return res.status(200).json(new ApiResponse(200, user, "CoverImage Updated"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        channelsSubscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $in: [
            req.user?._id,
            { $map: { input: "$subscribers", as: "s", in: "$$s.subscriber" } },
          ],
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel.length) {
    throw new ApiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cacheKey = `watchHistory:${userId}`;
  const cacheTTL = 60 * 5; // 5 minutes

  try {
    // 1. Try fetching from Redis cache
    const cachedHistory = await redis.get(cacheKey);
    if (cachedHistory) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            JSON.parse(cachedHistory),
            "Watch History (Cached)"
          )
        );
    }

    // 2. Fetch from MongoDB if not in cache
    const history = await WatchHistory.find({ userId })
      .sort({ updatedAt: -1 })
      .populate({
        path: "videoId",
        model: "Video",
        select: "thumbnail views title description _id duration createdAt",
        populate: {
          path: "owner",
          model: "User",
          select: "fullName _id",
        },
      });

    // 3. Format the data
    const formattedHistory = history
      .filter((entry) => entry.videoId)
      .map((entry) => ({
        watchedAt: entry.updatedAt,
        video: entry.videoId,
      }));

    // 4. Store in Redis with expiry
    await redis.set(cacheKey, JSON.stringify(formattedHistory), "EX", cacheTTL);

    // 5. Return response
    return res
      .status(200)
      .json(new ApiResponse(200, formattedHistory, "Watch History (Fresh)"));
  } catch (error) {
    console.error("Redis/Mongo Error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch watch history"));
  }
});

const addToWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!videoId) {
    return res.status(400).json({ message: "Video ID is required" });
  }

  // Step 1: Ensure the video exists
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  // Step 2: Upsert watch history entry
  await WatchHistory.findOneAndUpdate(
    { userId, videoId },
    {},
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  // Step 3: Update video views if user is a new viewer
  const isNewViewer = !video.viewers.includes(userId.toString());

  if (isNewViewer) {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { viewers: userId },
      $inc: { views: 1 },
    });
  }

  // Step 4: Respond
  res.status(200).json({
    message: "Watch history updated successfully",
    videoId,
    viewCount: isNewViewer ? video.views + 1 : video.views,
  });
});

const removeFromWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!videoId) {
    return res.status(400).json({ message: "Video ID is required" });
  }

  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  await WatchHistory.findOneAndDelete({ userId, videoId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video removed from watch history"));
});

const getHomeFeed = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const videoChunk = 8;
  const tweetChunk = 3;

  const cacheKey = `homeFeed:page:${page}:limit:${limit}`;
  const cacheTTL = 60 * 2; // 2 minutes

  try {
    // 1. Try cache first
    const cachedFeed = await redis.get(cacheKey);
    if (cachedFeed) {
      return res.status(200).json(JSON.parse(cachedFeed));
    }

    // 2. Fetch raw videos and tweets
    const rawVideos = await Video.find({ isPublished: true })
      .select("-viewers")
      .populate("owner", "_id username avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 4);

    const rawTweets = await Tweet.find()
      .select("-viewers")
      .populate("owner", "_id username avatar fullName")
      .sort({ createdAt: -1 })
      .limit(limit * 2);

    // 3. Interleave video and tweet blocks
    let vi = 0;
    let ti = 0;
    const structuredFeed = [];

    while (vi < rawVideos.length || ti < rawTweets.length) {
      const videoBlock = rawVideos.slice(vi, vi + videoChunk);
      if (videoBlock.length) {
        structuredFeed.push({ videos: videoBlock });
      }
      vi += videoChunk;

      const tweetBlock = rawTweets.slice(ti, ti + tweetChunk);
      if (tweetBlock.length) {
        structuredFeed.push({ tweets: tweetBlock });
      }
      ti += tweetChunk;

      if (structuredFeed.length >= limit) break;
    }

    // 4. Paginate final interleaved feed
    const start = (page - 1) * limit;
    const paginatedFeed = structuredFeed.slice(start, start + limit);

    const response = {
      success: true,
      page,
      limit,
      feed: paginatedFeed,
      hasMore: start + limit < structuredFeed.length,
    };

    // 5. Store in Redis
    await redis.set(cacheKey, JSON.stringify(response), "EX", cacheTTL);

    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ Home feed error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

let i = 0;
const healthCheck = asyncHandler(async (req, res) => {
  console.log("Health check accessed", i + 1);
  i++;
  try {
    const checks = {};

    // 1. Check Database Connection
    try {
      await mongoose.connection.db.admin().ping();
      checks.database = { status: "healthy" };
    } catch (err) {
      checks.database = { status: "unhealthy", error: err.message };
    }

    // 2. Check System Resource Utilization
    const memoryUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    checks.system = {
      uptime: os.uptime(), // Server uptime in seconds
      loadAvg: os.loadavg(), // CPU Load Average
      memory: {
        total: totalMemory,
        used: usedMemory,
        free: freeMemory,
        processHeapUsed: memoryUsage.heapUsed,
      },
      cpuUsage: process.cpuUsage(),
    };

    // 3. Check Disk Space
    try {
      const diskStat = fs.statSync("/");
      checks.disk = {
        available: diskStat.blocks * diskStat.blksize,
        free: diskStat.bfree * diskStat.blksize,
      };
    } catch (err) {
      checks.disk = { status: "unhealthy", error: err.message };
    }

    // 4. API Health
    checks.api = { status: "healthy", message: "User service is operational" };

    // If any service is unhealthy, return a 503 status
    const unhealthyServices = Object.values(checks).filter(
      (check) => check.status === "unhealthy"
    );

    if (unhealthyServices.length > 0) {
      throw new ApiError(503, "Some dependencies are unhealthy", checks);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, checks, "Service is healthy"));
  } catch (error) {
    console.error("Health check failed:", error);
    return res
      .status(503)
      .json(new ApiError(503, "Service is unhealthy", error));
  }
});

export {
  registerUser,
  loginUser,
  logout,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImg,
  getUserChannelProfile,
  getWatchHistory,
  addToWatchHistory,
  healthCheck,
  removeFromWatchHistory,
  getHomeFeed,
};
