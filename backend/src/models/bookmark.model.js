import mongoose, { Schema } from "mongoose";

const bookmarkSchema = new Schema(
  {
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    bookmarkedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
