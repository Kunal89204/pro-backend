import axiosInstance from "./axiosInstance";

const videoQueries = {
  updateVideo: async (token: string, videoId: string, formData: FormData) => {
    try {
      const response = await axiosInstance.patch(
        `/video/edit-video/${videoId}`,
        formData,
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
};


export default videoQueries;