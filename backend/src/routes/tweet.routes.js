import express from "express";
import { createTweet, getTweetsOfUser, getTweets, getTweetById } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

router.post("/create", verifyJWT, upload.single("image"), createTweet);
router.get("/get-tweets", verifyJWT, getTweetsOfUser);
router.get("/", verifyJWT, getTweets);
router.get("/:id", verifyJWT, getTweetById);

export default router;
