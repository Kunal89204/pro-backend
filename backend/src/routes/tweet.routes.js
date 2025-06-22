import express from "express";
import { createTweet, getTweetsOfUser } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

router.post("/create", verifyJWT, upload.single("image"), createTweet);
router.get("/get-tweets", verifyJWT, getTweetsOfUser);

export default router;
