import mongoose, { Schema } from "mongoose";

const watchHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  { timestamps: true }
);

const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);

export default WatchHistory;
