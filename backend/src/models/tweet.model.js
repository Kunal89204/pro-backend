import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String, trim: true, lowercase: true }],
  },
  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
