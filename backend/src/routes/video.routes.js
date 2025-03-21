import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
     userVideos

} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

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

router.route('/uservideos').get(userVideos)

router.route("/:videoId([0-9a-fA-F]{24})") // ✅ Only match valid ObjectIds
    .get(getVideoById)
    .patch(upload.single("thumbnail"), updateVideo);


router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

router.route('/delete-video/:videoId').delete(deleteVideo)



export default router