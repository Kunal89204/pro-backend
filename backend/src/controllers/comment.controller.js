import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";

const getPaginatedCommentsForVideo = async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  
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
                cond: { $eq: ["$$this.parentComment", "$_id"] }
              }
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
                          cond: { $eq: ["$$this._id", "$$directReply.owner"] }
                        }
                      },
                      0
                    ]
                  }
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
                      date: "$$directReply.createdAt" 
                    }
                  },
                  parentComment: "$$directReply.parentComment",
                  replies: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$allReplies",
                          cond: { $eq: ["$$this.parentComment", "$$directReply._id"] }
                        }
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
                                    cond: { $eq: ["$$this._id", "$$nestedReply.owner"] }
                                  }
                                },
                                0
                              ]
                            }
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
                                date: "$$nestedReply.createdAt" 
                              }
                            },
                            parentComment: "$$nestedReply.parentComment"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
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
    comments: result.docs,
    totalPages: result.totalPages,
    currentPage: result.page,
    totalComments: result.totalDocs,
  });
};

const addComment = async (req, res) => {
  try {
    const { content, videoId,  parentComment } = req.body;
    const userId = req.user._id;

    if (!content || !videoId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(videoId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid videoId or userId" });
    }

    const newComment = new Comment({
      content,
      video: videoId,
      owner: userId,
      parentComment: parentComment || null,
    });

    await newComment.save();
    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const checkComment = (req, res) => {
  res.json({ message: "I am working" });
};

export { checkComment, getPaginatedCommentsForVideo, addComment };
