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
};

export default commentQueries;
