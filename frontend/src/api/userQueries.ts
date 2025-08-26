import axiosInstance from "./axiosInstance";

const userQueries = {
  changePassword: async (
    token: string,
    oldPassword: string,
    newPassword: string
  ) => {
    const response = await axiosInstance.post(
      "/users/change-password",
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default userQueries;
