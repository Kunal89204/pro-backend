import axiosInstance from "./axiosInstance";

const tweetQueries = {
  addTweetView: async (token: string, tweetId: string) => {
    console.log('i have been summoned')
    const response = await axiosInstance.post(`/tweet/view/${tweetId}`,{}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },


  getTweetByIdForEmbed: async (tweetId: string) => {
      const response = await axiosInstance.get(`/tweet/embed/${tweetId}`);
    return response.data;
  },

  deleteTweet: async (token: string, tweetId: string) => {
    const response = await axiosInstance.delete(`/tweet/delete/${tweetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default tweetQueries;
