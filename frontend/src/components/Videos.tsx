"use client"
import React from 'react'
import Video from "@/components/Video"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { useQuery } from '@tanstack/react-query'
import { myQuery } from '@/api/query'
import { logout } from '@/lib/slices/authSlice'
import { Box } from '@chakra-ui/react'
import { useThemeColors } from "../hooks/useThemeColors"


const Videos: React.FC = () => {
    const token = useSelector((state: RootState) => state.token)
    const dispatch = useDispatch()
    const { bgColor } = useThemeColors()

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['videos'],
        queryFn: () => myQuery.getAllVideos(token),
        staleTime: 1000 * 60 * 5, // 5 minutes (data stays fresh for 5 minutes)
        refetchOnMount: false, // Prevent refetch when coming back
        refetchOnWindowFocus: false, // Prevent refetch when switching tabs
    });
    

    if (isLoading) {
        return <>Loading....</>
    }

    if (isError) {
        if (error.message == "Request failed with status 401") {
            dispatch(logout())
        }
    }


    return (
        <Box className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 3xl:grid-cols-5' bg={bgColor}>
            {data?.data?.videos?.map((item: {
                "_id": string, title: string, thumbnail: string, duration: number, ownerDetails: {
                    avatar: string,
                    fullName: string
                },
                createdAt: string, views: number
            }, i: number) => (
                <Video
                    key={i}
                    title={item.title}
                    thumbnail={item.thumbnail}
                    logo={item.ownerDetails.avatar}
                    channelName={item.ownerDetails.fullName}
                    uploadTime={item.createdAt}
                    views={item.views}
                    duration={item.duration}
                    videoId={item._id}
                    isProfile={false}
                />
            ))}
        </Box>
    )
}


export default Videos
