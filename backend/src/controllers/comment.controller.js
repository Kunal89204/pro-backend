import mongoose from "mongoose";
import { Comment } from "../models/comment.model";


const getComments = async (req, res) => {
    try {
        const { videoId } = req.params; // Use query params instead of body

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ message: "Invalid video ID" });
        }

        const comments = await Comment.aggregate([
            { $match: { video: new mongoose.Types.ObjectId(videoId), parentComment: null } },

            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } }, // Keep comments even if user is missing

            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "comment",
                    as: "likesData"
                }
            },
            {
                $addFields: {
                    likes: { $size: "$likesData" }
                }
            },

            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "parentComment",
                    as: "replies"
                }
            },

            {
                $project: {
                    id: "$_id",
                    user: "$owner.username",
                    avatar: "$owner.avatar",
                    text: "$content",
                    time: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
                    likes: 1,
                    replies: "$replies"
                }
            }
        ]);

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
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

export { getComments, addComment };
