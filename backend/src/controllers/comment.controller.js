import mongoose from "mongoose";
import {Comment}  from "../models/comment.model";


const getPaginatedCommentsForVideo = async (videoId, page = 1, limit = 10) => {
    const aggregateQuery = Comment.aggregate([
      { $match: { video: new mongoose.Types.ObjectId(videoId), parentComment: null } },
      { $lookup: { from: "users", localField: "owner", foreignField: "_id", as: "owner" } },
      { $unwind: "$owner" },
      {
        $graphLookup: {
          from: "comments",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentComment",
          as: "replies",
        },
      },
      {
        $project: {
          id: "$_id",
          user: "$owner.username",
          avatar: "$owner.avatar",
          text: "$content",
          time: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
          replies: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
  
    const options = { page, limit };
    const result = await Comment.aggregatePaginate(aggregateQuery, options);
  
    return {
      comments: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      totalComments: result.totalDocs,
    };
  };

const addComment = async (req, res) => {
    try {
        const { content, videoId, userId, parentComment } = req.body;

        if (!content || !videoId || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!mongoose.Types.ObjectId.isValid(videoId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid videoId or userId" });
        }

        const newComment = new Comment({
            content,
            video: videoId,
            owner: userId,
            parentComment: parentComment || null
        });

        await newComment.save();
        res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const checkComment = (req, res) => {
    res.json({message:"I am working"})
}

export {  checkComment };
