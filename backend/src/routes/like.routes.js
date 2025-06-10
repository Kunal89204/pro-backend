import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleVideoLike, getLikeStatus } from "../controllers/like.controller.js";
const router = Router();

router.route("/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/:videoId").get(verifyJWT, getLikeStatus);

export default router;
