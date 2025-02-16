import axios from 'axios'




const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,

})


interface LoginCredentials {
    fullName?: string
    username: string
    email: string
    password: string
}

interface User {
    data: any
    username: string;
    email: string;

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
            const response = await axiosInstance.post('/users/register', credentials)
            return response.data
        } catch (error) {
            return error
        }
    },

    login: async (credentials: LoginCredentials) => {
        const response = await axiosInstance.post('/users/login', credentials)
        return response.data
    },

    getCurrentUser: async (token: string): Promise<User> => {
        try {
            const response = await axiosInstance.get('/users/current-user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message ||
                    'Failed to fetch user data'
                )
            }
            throw new Error('An unexpected error occurred')
        }
    },

    uploadVideo: async ({ token, title, description, publish, thumbnail, videoFile }: { token: string, title: string, description: string, publish: boolean, thumbnail: File, videoFile: File }): Promise<VideoResponse> => {
        const response = await axiosInstance.post('/video', { title, description, publish, thumbnail, videoFile }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        })
        return response.data
    },

    getAllVideos: async (token: string) => {
        try {
            const response = await axiosInstance.get('/video', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.status);
                throw new Error(`Request failed with status ${error.response?.status || 500}`);
            } else {
                console.error("Unexpected error:", error);
                throw new Error("An unexpected error occurred");
            }
        }
    },

    getVideoById: async (token: string, videoId: string) => {
        try {
            const response = await axiosInstance.get(`/video/${videoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            return error
        }
    },

    addVideoToWatchHistory: async (token: string, videoId: string) => {
        try {
            const response = await axiosInstance.post(`/users/history/${videoId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return response.data
        } catch (error) {
            return error
        }
    },

    getHistory: async (token: string) => {
        try {
            const response = await axiosInstance.get('/users/history', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            
            return response.data
        } catch (error) {
            return error
        }
    },

    updateCoverImage: async (token: string, coverImage: File | undefined, coverImageUrl: string) => {
        try {
            const response = await axiosInstance.patch('/users/cover-image', { coverImage, publicUrl: coverImageUrl }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },

            })
            return response.data
        } catch (error) {
            return error
        }
    },

    updateUserAvatar: async (token: string, userImage: File | undefined, userAvatarUrl: string) => {
        try {
            const response = await axiosInstance.patch('/users/avatar', { avatar: userImage, publicUrl: userAvatarUrl }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })

            return response.data
        } catch (error) {
            return error
        }
    }

}