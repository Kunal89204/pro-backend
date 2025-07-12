import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {checkComment, addComment, getPaginatedCommentsForVideo, getComments, addCommentToTweet, getTweetComments} from '../controllers/comment.controller.js'
const router = Router()



router.route("/add").post(verifyJWT, addComment)
router.route("/:videoId").get(verifyJWT, getPaginatedCommentsForVideo)
router.route("/:videoId/comments").get(verifyJWT, getComments)

// <------------------------------Tweets Comments Routes------------------------------ >
router.route("/tweet/:tweetId").post(verifyJWT, addCommentToTweet)
router.route("/tweet/:tweetId").get(verifyJWT, getTweetComments)

export default router;