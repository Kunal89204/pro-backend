import {Router} from "express"
const router = Router()
import {toggleSubscription, getUserChannelSubscribers, getSubscribedChannels} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

router.post("/toggle-subscription/:channelId", verifyJWT, toggleSubscription)
router.get("/subscribers/:channelId", verifyJWT, getUserChannelSubscribers)
router.get("/subscribed-channels/:subscriberId", verifyJWT, getSubscribedChannels)


export default router