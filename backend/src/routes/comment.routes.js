import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {checkComment, addComment, getPaginatedCommentsForVideo, getComments} from '../controllers/comment.controller.js'
const router = Router()



router.route("/add").post(verifyJWT, addComment)
router.route("/:videoId").get(verifyJWT, getPaginatedCommentsForVideo)
router.route("/:videoId/comments").get(verifyJWT, getComments)

export default router;