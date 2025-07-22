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
};

export default tweetQueries;
