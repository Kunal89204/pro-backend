import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { redis } from "../../index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import { Video } from "../models/video.model.js";


const getPaginatedCommentsForVideo = async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const totalComments = await Comment.countDocuments({
    video: new mongoose.Types.ObjectId(videoId),
    parentComment: null,
  });

  const aggregateQuery = Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
        parentComment: null,
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
    { $unwind: "$owner" },
    {
      $graphLookup: {
        from: "comments",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parentComment",
        as: "allReplies",
      },
    },
    // Lookup users for all replies
    {
      $lookup: {
        from: "users",
        localField: "allReplies.owner",
        foreignField: "_id",
        as: "replyOwners",
      },
    },
    // Add fields to build hierarchical structure
    {
      $addFields: {
        replies: {
          $map: {
            input: {
              $filter: {
                input: "$allReplies",
                cond: { $eq: ["$$this.parentComment", "$_id"] },
              },
            },
            as: "directReply",
            in: {
              $let: {
                vars: {
                  replyOwner: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$replyOwners",
                          cond: { $eq: ["$$this._id", "$$directReply.owner"] },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: {
                  id: "$$directReply._id",
                  user: "$$replyOwner.username",
                  avatar: "$$replyOwner.avatar",
                  fullName: "$$replyOwner.fullName",
                  text: "$$directReply.content",
                  time: {
                    $dateToString: {
                      format: "%Y-%m-%d %H:%M",
                      date: "$$directReply.createdAt",
                    },
                  },
                  parentComment: "$$directReply.parentComment",
                  replies: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$allReplies",
                          cond: {
                            $eq: ["$$this.parentComment", "$$directReply._id"],
                          },
                        },
                      },
                      as: "nestedReply",
                      in: {
                        $let: {
                          vars: {
                            nestedReplyOwner: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: "$replyOwners",
                                    cond: {
                                      $eq: [
                                        "$$this._id",
                                        "$$nestedReply.owner",
                                      ],
                                    },
                                  },
                                },
                                0,
                              ],
                            },
                          },
                          in: {
                            id: "$$nestedReply._id",
                            user: "$$nestedReplyOwner.username",
                            avatar: "$$nestedReplyOwner.avatar",
                            fullName: "$$nestedReplyOwner.fullName",
                            text: "$$nestedReply.content",
                            time: {
                              $dateToString: {
                                format: "%Y-%m-%d %H:%M",
                                date: "$$nestedReply.createdAt",
                              },
                            },
                            parentComment: "$$nestedReply.parentComment",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        id: "$_id",
        user: "$owner.username",
        avatar: "$owner.avatar",
        fullName: "$owner.fullName",
        text: "$content",
        time: {
          $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" },
        },
        replies: 1,
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  const options = { page, limit };
  const result = await Comment.aggregatePaginate(aggregateQuery, options);

  res.status(200).json({
    totalPages: result.totalPages,
    currentPage: result.page,
    totalComments: totalComments,
    comments: result.docs,
  });
};

const getComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid video ID",
    });
  }

  const skip = (page - 1) * limit;
  const cacheKey = `videoComments:${videoId}:page:${page}:limit:${limit}`;
  const cacheTTL = 60 * 3; // 3 minutes

  try {
    // 1. Try Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // 2. Fetch top-level comments from MongoDB
    const topLevelComments = await Comment.find({
      video: videoId,
      parentComment: null,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner", "_id username avatar fullName")
      .lean();

    // 3. Recursive reply population
    const populateReplies = async (comments) => {
      for (let comment of comments) {
        comment.replies = await Comment.find({
          parentComment: comment._id,
        })
          .sort({ createdAt: 1 })
          .populate("owner", "_id username avatar fullName")
          .lean();

        if (comment.replies.length > 0) {
          await populateReplies(comment.replies);
        }
      }
    };

    await populateReplies(topLevelComments);

    // 4. Get total top-level comments (for pagination)
    const totalTopLevelComments = await Comment.countDocuments({
      video: videoId,
      parentComment: null,
    });

    const totalPages = Math.ceil(totalTopLevelComments / limit);

    const response = {
      success: true,
      currentPage: page,
      totalPages,
      totalComments: totalTopLevelComments,
      comments: topLevelComments,
    };

    // 5. Cache the full response
    await redis.set(cacheKey, JSON.stringify(response), "EX", cacheTTL);

    return res.status(200).json(response);
  } catch (err) {
    console.error("❌ Error fetching comments:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

const addComment = asyncHandler(async (req, res) => {
  const { content, videoId, parentComment } = req.body;
  const userId = req.user?._id; // safe access in case req.user is missing

  // 1. Basic validation
  if (!content || !videoId || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (
    !mongoose.Types.ObjectId.isValid(videoId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).json({ message: "Invalid videoId or userId" });
  }

  if (
    parentComment &&
    !mongoose.Types.ObjectId.isValid(parentComment)
  ) {
    return res.status(400).json({ message: "Invalid parentComment id" });
  }

  try {
    // 2. Save new comment
    const newComment = new Comment({
      content,
      video: videoId,
      owner: userId,
      parentComment: parentComment?.trim() || null,
    });

    await newComment.save();

    // 3. Invalidate related Redis cache (awaitable + safe)
    const keys = [];
    for await (const keyBatch of redis.scanIterator({
      MATCH: `videoComments:${videoId}:page:*`,
      COUNT: 100, // scan in chunks
    })) {
      keys.push(keyBatch);
    }

    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🔁 Redis cache invalidated for video ${videoId}`);
    }

    // 4. Response
    return res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("❌ Error adding comment:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});


const checkComment = (req, res) => {
  res.json({ message: "I am working" });
};

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid comment ID",
    });
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found",
    });
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to delete this comment",
    });
  }

  // Recursive function to collect all nested comment IDs
  const collectAllNestedReplies = async (parentId, collected = []) => {
    const replies = await Comment.find({ parentComment: parentId });
    for (const reply of replies) {
      collected.push(reply._id);
      await collectAllNestedReplies(reply._id, collected);
    }
    return collected;
  };

  const nestedReplyIds = await collectAllNestedReplies(comment._id);
  nestedReplyIds.push(comment._id); // Include the root comment itself

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Delete all comments in one go
      await Comment.deleteMany({ _id: { $in: nestedReplyIds } }, { session });

      // Update commentsCount for video or tweet
      const deletedCommentsCount = nestedReplyIds.length;

      if (comment.video) {
        await Video.findByIdAndUpdate(
          comment.video,
          { $inc: { commentsCount: -deletedCommentsCount } },
          { session }
        );
      }

      if (comment.tweet) {
        await Tweet.findByIdAndUpdate(
          comment.tweet,
          { $inc: { commentsCount: -deletedCommentsCount } },
          { session }
        );
      }
    });
  } finally {
    await session.endSession();
  }

  // Invalidate Redis cache for video comments
  if (comment.video) {
    const stream = redis.scanStream({
      match: `videoComments:${comment.video}:page:*`,
    });

    stream.on("data", async (keys) => {
      if (keys.length) {
        await redis.del(...keys);
      }
    });

    stream.on("end", () => {
      console.log(`🔁 Redis cache invalidated for video ${comment.video}`);
    });
  }

  // Invalidate Redis cache for tweet comments
  if (comment.tweet) {
    const stream = redis.scanStream({
      match: `tweetComments:${comment.tweet}:page:*`,
    });

    stream.on("data", async (keys) => {
      if (keys.length) {
        await redis.del(...keys);
      }
    });

    stream.on("end", () => {
      console.log(`🔁 Redis cache invalidated for tweet ${comment.tweet}`);
    });
  }

  return res.status(200).json({
    success: true,
    message: "Comment and all nested replies deleted successfully",
  });
});

// <------------------------------Tweets Comments Controllers------------------------------ >

const addCommentToTweet = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { tweetId } = req?.params;
  const { content, parentComment } = req.body;

  if (!content || !userId || !tweetId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
      userId,
    });
  }

  if (
    !mongoose.Types.ObjectId.isValid(tweetId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid tweetId or userId",
    });
  }

  const session = await mongoose.startSession();

  try {
    let comment;

    // 1. Database operations in transaction
    await session.withTransaction(async () => {
      // Create comment and update tweet comment count atomically
      const [createdComment] = await Promise.all([
        Comment.create(
          [
            {
              content,
              tweet: tweetId,
              owner: userId,
              parentComment: parentComment || null,
            },
          ],
          { session }
        ),
        Tweet.findByIdAndUpdate(
          tweetId,
          { $inc: { commentsCount: 1 } },
          { session }
        ),
      ]);

      comment = createdComment[0];
    });

    // 2. Cache invalidation (outside transaction)
    const invalidateCachePromise = new Promise((resolve, reject) => {
      const stream = redis.scanStream({
        match: `tweetComments:${tweetId}:page:*`,
      });

      const keysToDelete = [];

      stream.on("data", (keys) => {
        keysToDelete.push(...keys);
      });

      stream.on("end", async () => {
        try {
          if (keysToDelete.length) {
            await redis.del(...keysToDelete);
          }
          console.log(`🔁 Redis cache invalidated for tweet ${tweetId}`);
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      stream.on("error", reject);
    });

    // 3. Wait for cache invalidation to complete
    await invalidateCachePromise;

    // 4. Response
    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("❌ Error adding comment to tweet:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  } finally {
    await session.endSession();
  }
});

const getTweetComments = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid tweet ID",
    });
  }

  const skip = (page - 1) * limit;
  const cacheKey = `tweetComments:${tweetId}:page:${page}:limit:${limit}`;
  const cacheTTL = 60 * 3; // 3 minutes

  try {
    // 1. Try Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // 2. Fetch top-level comments from MongoDB
    const topLevelComments = await Comment.find({
      tweet: tweetId,
      parentComment: null,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner", "_id username avatar fullName")
      .lean();

    // 3. Recursive reply population
    const populateReplies = async (comments) => {
      for (let comment of comments) {
        comment.replies = await Comment.find({
          parentComment: comment._id,
        })
          .sort({ createdAt: 1 })
          .populate("owner", "_id username avatar fullName")
          .lean();

        if (comment.replies.length > 0) {
          await populateReplies(comment.replies);
        }
      }
    };

    await populateReplies(topLevelComments);

    // 4. Get total top-level comments (for pagination)
    const totalTopLevelComments = await Comment.countDocuments({
      tweet: tweetId,
      parentComment: null,
    });

    const totalPages = Math.ceil(totalTopLevelComments / limit);

    const response = {
      success: true,
      currentPage: page,
      totalPages,
      totalComments: totalTopLevelComments,
      comments: topLevelComments,
    };

    // 5. Cache the full response
    await redis.set(cacheKey, JSON.stringify(response), "EX", cacheTTL);

    return res.status(200).json(response);
  } catch (err) {
    console.error("❌ Error fetching comments:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export {
  checkComment,
  getPaginatedCommentsForVideo,
  addComment,
  getComments,
  addCommentToTweet,
  getTweetComments,
  deleteComment,
};
