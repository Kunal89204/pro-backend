import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    userVideos,
    onPageVideoRecommendation,
    getVideoByIdForEmbed,
    suggestSearchQueries
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();

// Exempt embed API from requiring token
router.route("/embed/:videoId").get(getVideoByIdForEmbed);

// Apply verifyJWT middleware to all subsequent routes
router.use(verifyJWT);

router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        publishAVideo
    );

router.route('/uservideos').get(userVideos);

router.route("/:videoId([0-9a-fA-F]{24})") // ✅ Only match valid ObjectIds
    .get(getVideoById)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

router.route('/delete-video/:videoId').delete(deleteVideo);

router.route("/recommendations/:videoId").get(onPageVideoRecommendation);

router.route('/suggestions').get(suggestSearchQueries)

export default router