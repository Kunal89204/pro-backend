import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {checkComment, addComment, getPaginatedCommentsForVideo} from '../controllers/comment.controller.js'
const router = Router()



router.route("/add").post(verifyJWT, addComment)
router.route("/:videoId").get(verifyJWT, getPaginatedCommentsForVideo)

export default router;