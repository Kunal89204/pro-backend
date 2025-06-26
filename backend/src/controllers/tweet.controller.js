import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

  res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getTweetsOfUser = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const getTweets = asyncHandler(async (req, res) => {
  const {page, limit} = req?.query;
  const tweets = await Tweet.find().sort({createdAt: -1}).skip((page - 1) * limit).limit(limit);
  res.status(200).json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
})

const getTweetById = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  const tweet = await Tweet.findById(id).populate("owner", "fullName username email avatar coverImage");
  res.status(200).json(new ApiResponse(200, tweet, "Tweet fetched successfully"));
});

export { createTweet, getTweetsOfUser, getTweets, getTweetById };
