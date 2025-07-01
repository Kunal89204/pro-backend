import axios from "axios";
import axiosInstance from "./axiosInstance";

interface LoginCredentials {
  fullName?: string;
  username: string;
  email: string;
  password: string;
}

interface UserData {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  wathcedVideos: string[];
  __v: number;
}

interface User {
  statusCode: number;
  data: UserData;
  message: string;
  success: boolean;
}

interface VideoResponse {
  statusCode: number;
  data: VideoData;
  message: string;
  success: boolean;
}

interface VideoData {
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: string; // Format: "HH:MM"
  views: number;
  isPublished: boolean;
  owner: string; // User ID
  _id: string; // Video ID
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const myQuery = {
  
  register: async (credentials: LoginCredentials) => {
    try {
      const response = await axiosInstance.post("/users/register", credentials);
      return response.data;
    } catch (error) {
      return error;
    }
  },

  login: async (credentials: LoginCredentials) => {
    const response = await axiosInstance.post("/users/login", credentials);
    return response.data;
  },

  getCurrentUser: async (token: string): Promise<User> => {
    try {
      const response = await axiosInstance.get("/users/current-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch user data"
        );
      }
      throw new Error("An unexpected error occurred");
    }
  },

  uploadVideo: async ({
    token,
    title,
    description,
    publish,
    thumbnail,
    videoFile,
  }: {
    token: string;
    title: string;
    description: string;
    publish: boolean;
    thumbnail: File;
    videoFile: File;
  }): Promise<VideoResponse> => {
    const response = await axiosInstance.post(
      "/video",
      { title, description, publish, thumbnail, videoFile },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  getAllVideos: async (token: string) => {
    const response = await axiosInstance.get("/video", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  getVideoById: async (token: string, videoId: string) => {
    try {
      const response = await axiosInstance.get(`/video/${videoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },

  getVideoByIdForEmbed: async (videoId: string) => {
    const response = await axiosInstance.get(`/video/embed/${videoId}`);
    return response.data;
  },

  addVideoToWatchHistory: async (token: string, videoId: string) => {
    try {
      const response = await axiosInstance.post(
        `/users/history/${videoId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  },

  getHistory: async (token: string) => {
    try {
      const response = await axiosInstance.get("/users/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return error;
    }
  },

  removeVideoFromHistory: async (token: string, videoId: string) => {
    const response = await axiosInstance.delete(`/users/history/${videoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateCoverImage: async (
    token: string,
    coverImage: File | undefined,
    coverImageUrl: string
  ) => {
    try {
      const response = await axiosInstance.patch(
        "/users/cover-image",
        { coverImage, publicUrl: coverImageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },

  updateUserAvatar: async (
    token: string,
    userImage: File | undefined,
    userAvatarUrl: string
  ) => {
    try {
      const response = await axiosInstance.patch(
        "/users/avatar",
        { avatar: userImage, publicUrl: userAvatarUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  },

  getUserVideos: async (token: string) => {
    try {
      const response = await axiosInstance.get("video/uservideos", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  deleteVideo: async (token: string, videoId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/video/delete-video/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  getPlaylists: async (token: string) => {
    try {
      const response = await axiosInstance.get("/playlist/get-playlists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },

  getComments: async (token: string, videoId: string) => {
    const response = await axiosInstance.get(`/comment/${videoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  addVideoToPlaylist: async (
    token: string,
    playlistId: string,
    videoId: string
  ) => {
    const response = await axiosInstance.put(
      `/playlist/add-to-playlist`,
      {
        videoId,
        playlistId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  removeVideoFromPlaylist: async (
    token: string,
    playlistId: string,
    videoId: string
  ) => {
    const response = await axiosInstance.put(
      "playlist/remove-video",
      {
        videoId,
        playlistId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  createPlaylist: async (
    token: string,
    playlistName: string,
    isPublic: boolean,
    videoId: string
  ) => {
   
    const response = await axiosInstance.post(
      "/playlist/create-playlist",
      { name: playlistName, isPublic, videoId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  deletePlaylist: async (token: string, playlistId: string) => {
    const response = await axiosInstance.delete(
      `/playlist/delete-playlist/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  editPlaylist: async (
    token: string,
    playlistId: string,
    playlistName: string,
    isPublic: boolean
  ) => {
    const response = await axiosInstance.put(
      `/playlist/edit-playlist/${playlistId}`,
      { name: playlistName, isPublic },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getPlaylistById: async (token: string, playlistId: string) => {
    const response = await axiosInstance.get(
      `/playlist/get-playlist/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  addComment: async (token: string, videoId: string, comment: string) => {
    const response = await axiosInstance.post(
      `/comment/add`,
      { videoId, content: comment },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  addReply: async (
    token: string,
    videoId: string,
    commentId: string,
    content: string
  ) => {
    const response = await axiosInstance.post(
      `/comment/add`,
      { videoId, parentComment: commentId, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  likeVideo: async (token: string, videoId: string) => {
    const response = await axiosInstance.post(
      `/like/${videoId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  likeVideoStatus: async (token: string, videoId: string) => {
    const response = await axiosInstance.get(`/like/${videoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  subscribeChannel: async (token: string, channelId: string) => {
    const response = await axiosInstance.post(
      `/subscription/toggle-subscription/${channelId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  subscribeStatus: async (token: string, videoId: string) => {
    const response = await axiosInstance.get(
      `/subscription/subscriber-stats/${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  onPageVideoRecommendations: async (token: string, videoId: string) => {
    const response = await axiosInstance.get(
      `/video/recommendations/${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  createTweet: async (token: string, formData: FormData) => {
    const response = await axiosInstance.post("/tweet/create", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getHomeFeed: async (token: string) => {
    const response = await axiosInstance.get("/users/home-feed", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  },

  getTweetById: async (token: string, tweetId: string|undefined) => {
    const response = await axiosInstance.get(`/tweet/${tweetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getTweetsOfUser: async (token: string) => {
    const response = await axiosInstance.get("/tweet/get-tweets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  bookMarkTweet: async (token: string, tweetId: string|undefined) => {
    console.log(token)
    const response = await axiosInstance.post(`/tweet/bookmark/${tweetId}`,{}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getBookMarkedTweets: async (token: string) => {
    const response = await axiosInstance.get("/tweet/bookmarks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getBookmarkStatus: async (token: string, tweetId: string|undefined) => {
    const response = await axiosInstance.get(`/tweet/bookmark-status/${tweetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  toggleLikeTweet: async (token: string, tweetId: string|undefined) => {
    const response = await axiosInstance.post(`/like/tweet/${tweetId}`,{}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  likeStatus: async (token: string, tweetId: string|undefined) => {
    const response = await axiosInstance.get(`/like/tweet/${tweetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getSuggestions: async (token: string, query: string) => {
    const response = await axiosInstance.get(`/video/suggestions?q=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getSearchResults: async (token: string, query: string|null) => {
    const response = await axiosInstance.get(`/video/search?q=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

};
