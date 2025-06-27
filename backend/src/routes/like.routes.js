import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleVideoLike, getLikeStatus, toggleTweetLike, getLikeStatusForTweet } from "../controllers/like.controller.js";
const router = Router();

router.route("/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/:videoId").get(verifyJWT, getLikeStatus);
router.route("/tweet/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/tweet/:tweetId").get(verifyJWT, getLikeStatusForTweet);

export default router;
