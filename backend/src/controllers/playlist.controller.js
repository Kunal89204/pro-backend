import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, isPublic, videoId } = req.body;
  const user = req.user;

  // Validate input
  if (!name || !videoId) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Playlist name and videoId is required.",
      data: null,
    });
  }

  // Create a new playlist
  const newPlaylist = await Playlist.create({
    name,
    isPublic,
    owner: user._id,
    videos: [videoId],
  });

  res.status(201).json({
    success: true,
    status: 201,
    message: "Playlist created successfully.",
    data: newPlaylist,
  });
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.body;
  const userId = req.user._id;

  // Validate request data
  if (!videoId || !playlistId) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Video ID and Playlist ID are required.",
      data: null,
    });
  }

  // Find the playlist and check ownership
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: "Playlist not found.",
      data: null,
    });
  }

  if (String(playlist.owner) !== String(userId)) {
    return res.status(403).json({
      success: false,
      status: 403,
      message: "You do not have permission to modify this playlist.",
      data: null,
    });
  }

  // Check if the video exists
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: "Video not found.",
      data: null,
    });
  }

  // Prevent duplicate additions
  if (playlist.videos.includes(videoId)) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "This video is already in the playlist.",
      data: null,
    });
  }

  // Add video to playlist
  playlist.videos.push(videoId);
  await playlist.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Video added to playlist successfully.",
    data: playlist,
  });
});

const getPlaylists = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    // Fetch all playlists
    const playlists = await Playlist.find({ owner: _id }).populate(
      "videos",
      "_id thumbnail"
    );

    // Check if playlists exist
    if (!playlists || playlists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No playlists found.",
        data: [],
      });
    }

    // Return playlists
    res.status(200).json({
      success: true,
      message: "Playlists retrieved successfully.",
      data: playlists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId).populate({
      path: "videos",
      select: "_id thumbnail title description duration views owner",
      populate: {
        path: "owner",
        select: "_id username avatar",
      },
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Playlist retrieved successfully.",
      data: playlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user._id;

    // Validate request data
    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: "Playlist ID is required.",
      });
    }

    // Find the playlist
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found.",
      });
    }

    // Check if the user is the owner of the playlist
    if (String(playlist.owner) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this playlist.",
      });
    }

    // Delete the playlist
    await Playlist.findByIdAndDelete(playlistId);

    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  try {
    const { videoId, playlistId } = req.body;
    const userId = req.user._id;

    // Validate request data
    if (!videoId || !playlistId) {
      return res.status(400).json({
        success: false,
        message: "Video ID and Playlist ID are required.",
      });
    }

    // Find the playlist
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found.",
      });
    }

    // Check if the user is the owner of the playlist
    if (String(playlist.owner) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to modify this playlist.",
      });
    }

    // Check if the video exists in the playlist
    const videoIndex = playlist.videos.indexOf(videoId);
    if (videoIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Video not found in the playlist.",
      });
    }

    // Remove video from playlist
    playlist.videos.splice(videoIndex, 1);
    await playlist.save();

    res.status(200).json({
      success: true,
      message: "Video removed from playlist successfully.",
      playlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

export {
  createPlaylist,
  addVideoToPlaylist,
  getPlaylists,
  deletePlaylist,
  removeVideoFromPlaylist,
  getPlaylistById,
};
