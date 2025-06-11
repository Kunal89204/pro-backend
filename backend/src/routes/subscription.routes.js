import {Router} from "express"
const router = Router()
import {toggleSubscription, getUserChannelSubscribers, getSubscribedChannels, subscriberStats} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

router.post("/toggle-subscription/:channelId", verifyJWT, toggleSubscription)
router.get("/subscriber-stats/:channelId", verifyJWT, subscriberStats)
router.get("/subscribers/:channelId", verifyJWT, getUserChannelSubscribers)
router.get("/subscribed-channels", verifyJWT, getSubscribedChannels)


export default router