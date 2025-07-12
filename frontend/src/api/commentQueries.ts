// import axios from "axios";
import axiosInstance from "./axiosInstance";

const commentQueries = {
  getComments: async (token: string, videoId: string) => {
    try {
      const response = await axiosInstance.get(`/comment/${videoId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },
  addTweetComment: async (token: string, tweetId: string, content: string, parentComment: string |null) => {
    try {
      const response = await axiosInstance.post(`/comment/tweet/${tweetId}`, {
        content,
        parentComment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },

  getTweetComments: async (token: string, tweetId: string) => {
    try {
      const response = await axiosInstance.get(`/comment/tweet/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  }
};

export default commentQueries;
