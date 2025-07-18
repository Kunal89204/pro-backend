import express from "express";
import { createTweet, getTweetsOfUser, getTweets, getTweetById, bookmarkTweet, getBookmarkedTweets, bookmarkStatus, addTweetView } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

router.post("/create", verifyJWT, upload.single("image"), createTweet);
router.get("/get-tweets", verifyJWT, getTweetsOfUser);
router.get("/", verifyJWT, getTweets);
router.get("/bookmarks", verifyJWT, getBookmarkedTweets);
router.post("/bookmark/:id", verifyJWT, bookmarkTweet);
router.get("/bookmark-status/:id", verifyJWT, bookmarkStatus);
router.get("/:id", verifyJWT, getTweetById);
router.post("/view/:id", verifyJWT, addTweetView);
export default router;
