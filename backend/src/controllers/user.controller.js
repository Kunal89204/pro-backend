import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { deleteFromCloudinar, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import { getPublicIdFromUrl } from "../utils/publicIdExtracter.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error generating tokens:', error);
    throw new ApiError(500, 'Something went wrong while generating tokens');
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

  //  if (fullName === "") {
  //   throw new ApiError(400, "fullName is required")
  //  }

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // let coverImageLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar File is required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // if (!avatar) {
  //   throw new ApiError(400, "Avatar File is required");
  // }

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
    .json(new ApiResponse(200, createdUser, "User Registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.log('Request body:', req.body);

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log('User found:', user);

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log('Is password valid:', isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  console.log('Tokens generated:', { accessToken, refreshToken });

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  console.log('Logged in user:', loggedInUser);

  const options = {
    httpOnly: false,
    secure: false,
    sameSite: "None"
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
          refreshToken
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
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)


    const user = User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used")
    }

    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200,
          { accessToken, refreshToken: newRefreshToken }
        )
      )
  }

  catch (error) {
    throw new ApiError(401, error?.message || "Inavlid Refresh Token")
  }


})

const changeCurrentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old Password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"))
  } catch (error) {

  }
}

const getCurrentUser = async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "current user fetched"))
}

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        fullName,
        email
      }
    },
    { new: true }
  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))

})

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path
  const { publicUrl } = req.body

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar")
  }

  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    { new: true }
  ).select("-password")

  if (publicUrl) {
    await deleteFromCloudinar(getPublicIdFromUrl(publicUrl))
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Avatar Image Updated")
    )

})

const updateUserCoverImg = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path
  const { publicUrl } = req.body;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "CoverImage file is missing")
  }



  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on coverImage")
  }

  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    { new: true }
  ).select("-password")

  let deleteOldCoverImage;
  if (publicUrl) {
    deleteOldCoverImage = await deleteFromCloudinar(getPublicIdFromUrl(publicUrl))
  }




  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "CoverImage Updated")
    )

})


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
          $in: [req.user?._id, { $map: { input: "$subscribers", as: "s", in: "$$s.subscriber" } }],
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

  return res.status(200).json(new ApiResponse(200, channel[0], "User channel fetched successfully"));
});


const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
      },
    },
    {
      $unwind: "$watchHistory", // Unwind the array to work on individual video objects
    },
    {
      $lookup: {
        from: "users",
        localField: "watchHistory.owner",
        foreignField: "_id",
        as: "watchHistory.owner",
      },
    },
    {
      $unwind: "$watchHistory.owner", // Get owner as an object instead of an array
    },
    {
      $group: {
        _id: "$_id",
        watchHistory: { $push: "$watchHistory" }, // Reconstruct watchHistory array
      },
    },
    {
      $project: {
        _id: 0, // Remove user _id, keep only watchHistory
        watchHistory: {
          $reverseArray: {
            $map: {
              input: "$watchHistory",
              as: "video",
              in: {
                _id: "$$video._id",
                thumbnail: "$$video.thumbnail",
                title: "$$video.title",
                description: "$$video.description",
                duration: "$$video.duration",
                views: "$$video.views",
                owner: {
                  _id: "$$video.owner._id",
                  fullName: "$$video.owner.fullName"
                }
              }
            }
          }
        }
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(200, user[0]?.watchHistory || [], "Watch History Fetched Successfully")
  );
});


const addToWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!videoId) {
    return res.status(400).json({ message: "Video ID is required" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  let { watchHistory } = user;

  // Remove the videoId if it already exists
  watchHistory = watchHistory.filter(id => id.toString() !== videoId);

  // Push videoId to the end
  watchHistory.push(videoId);

  // Update the user's watch history
  user.watchHistory = watchHistory;
  await user.save();

  res.status(200).json({ message: "Watch history updated", watchHistory });
});



export { registerUser, loginUser, logout, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImg, getUserChannelProfile, getWatchHistory, addToWatchHistory };
