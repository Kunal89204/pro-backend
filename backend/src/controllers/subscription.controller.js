import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;

  if (!isValidObjectId(channelId) || !isValidObjectId(subscriberId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid channel ID or subscriber ID",
    });
  }

  const subscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (subscription) {
    await Subscription.findByIdAndDelete(subscription._id);

    return res.status(200).json({
      success: true,
      message: "Subscription removed successfully",
    });
  }

  const newSubscription = await Subscription.create({
    subscriber: subscriberId,
    channel: channelId,
  });

  return res.status(200).json({
    success: true,
    message: "Subscription created successfully",
    data: newSubscription,
  });
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
