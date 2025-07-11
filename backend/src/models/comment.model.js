import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    video: { type: Schema.Types.ObjectId, ref: "Video" },
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);
