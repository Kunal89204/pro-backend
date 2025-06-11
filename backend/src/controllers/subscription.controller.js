import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Resend } from "resend";
const resend = new Resend("re_j3NcuAnv_85daXri1aVRoQUVXeaH5AWcZ");

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;

  if (!isValidObjectId(channelId) || !isValidObjectId(subscriberId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid channel ID or subscriber ID",
    });
  }

  const [channel, subscription] = await Promise.all([
    User.findById(channelId),
    Subscription.findOne({
      subscriber: subscriberId,
      channel: channelId,
    }),
  ]);

  if (!channel) {
    return res.status(404).json({
      success: false,
      message: "Channel not found",
    });
  }

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

  const {data, error} = await resend.emails.send({
    from: "me@kunalkhandelwal.dev",
    to: channel.email,
    subject: "🎉 New Subscription Alert",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Subscription</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
        
        <!-- Main Container -->
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          
          <!-- Email Card -->
          <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.2);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; position: relative;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"white\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>');"></div>
              
              <!-- Celebration Icon -->
              <div style="position: relative; z-index: 1;">
                <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); border-radius: 50%; padding: 20px; margin-bottom: 20px; backdrop-filter: blur(10px);">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="white"/>
                    <path d="M19 15L19.31 16.32L21 16.5L19.31 16.68L19 18L18.69 16.68L17 16.5L18.69 16.32L19 15Z" fill="white"/>
                    <path d="M19 5L19.31 6.32L21 6.5L19.31 6.68L19 8L18.69 6.68L17 6.5L18.69 6.32L19 5Z" fill="white"/>
                  </svg>
                </div>
                
                <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  Amazing News!
                </h1>
                <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 18px; font-weight: 400;">
                  You've got a new subscriber
                </p>
              </div>
            </div>
            
            <!-- Content -->
            <div style="padding: 50px 40px;">
              
              <!-- Subscriber Info Card -->
              <div style="background: linear-gradient(135deg, #f8faff 0%, #f1f5ff 100%); border-radius: 16px; padding: 30px; margin-bottom: 30px; border: 1px solid rgba(102, 126, 234, 0.1); position: relative; overflow: hidden;">
                <div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, rgba(102, 126, 234, 0.03) 0%, transparent 70%);"></div>
                
                <div style="position: relative; z-index: 1;">
                  <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 12px; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);"></div>
                    <span style="color: #10b981; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">New Subscriber</span>
                  </div>
                  
                  <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid rgba(0, 0, 0, 0.05);">
                    <div style="font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 8px; display: flex; align-items: center;">
                      <span style="margin-right: 12px;">👤</span>
                      ${subscriberId}
                    </div>
                    <p style="margin: 0; color: #6b7280; font-size: 16px;">
                      Just joined your community
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Stats or Additional Info -->
              <div style="text-align: center; margin-bottom: 40px;">
                <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                  Your content is resonating with more people every day. Keep up the fantastic work!
                </p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center;">
                <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); transition: all 0.3s ease; position: relative; overflow: hidden;">
                  <span style="position: relative; z-index: 1;">View Dashboard</span>
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8faff; padding: 30px 40px; text-align: center; border-top: 1px solid rgba(0, 0, 0, 0.05);">
              <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 14px;">
                Sent with ❤️ from your notification system
              </p>
              <p style="margin: 0; color: #d1d5db; font-size: 12px;">
                © 2025 Kunal Khandelwal. All rights reserved.
              </p>
            </div>
            
          </div>
          
          <!-- Bottom spacing -->
          <div style="height: 40px;"></div>
          
        </div>
      </body>
      </html>
    `
  })

  if (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Subscription created successfully",
    data: newSubscription,
    channel:channel.email
    
  });
});

const subscriberStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;

  const subscribed = await Subscription.exists({
    subscriber: subscriberId,
    channel: channelId,
  });

  const subscriberCount = await Subscription.countDocuments({
    channel: channelId,
  });

  return res.status(200).json({
    success: true,
    message: "Subscriber stats fetched successfully",
    data: {
      subscribed: !!subscribed,
      subscriberCount,
    },
  });
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid channel ID or subscriber ID",
    });
  }

  const subscribedChannels = await Subscription.find({
    subscriber: userId,
  }).populate("channel", "_id username fullName avatar");

  if (!subscribedChannels) {
    return res.status(404).json({
      success: false,
      message: "No subscribed channels found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Subscribed channels fetched successfully",
    data: subscribedChannels,
  });
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
  subscriberStats,
};
