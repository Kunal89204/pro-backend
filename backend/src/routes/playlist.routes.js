import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, addVideoToPlaylist, getPlaylists, deletePlaylist, removeVideoFromPlaylist, getPlaylistById } from '../controllers/playlist.controller.js'
const router = Router();

router.use(verifyJWT)

router.route('/create-playlist').post(createPlaylist)
router.route('/add-to-playlist').put(addVideoToPlaylist)
router.route('/get-playlists').get(getPlaylists)
router.route('/remove-video/').put(removeVideoFromPlaylist)
router.route('/delete-playlist').delete(deletePlaylist)
router.route('/get-playlist/:playlistId').get(getPlaylistById)

export default router