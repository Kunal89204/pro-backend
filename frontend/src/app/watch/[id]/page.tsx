"use client"
import { myQuery } from '@/api/query'
import Comments from '@/components/watch/Comments'
import VideoPlayer from '@/components/watch/VideoPlayer'
import { RootState } from '@/lib/store'
import { Box } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'



const Watch = ({ params }: { params: { id: string } }) => {
    const token = useSelector((state: RootState) => state.token)




    const addVideoToWatchHistoryMutation = useMutation({
        mutationFn: () => myQuery.addVideoToWatchHistory(token, params.id)
    })

    useEffect(() => {
        addVideoToWatchHistoryMutation.mutate()
    }, [params.id])



    const { data, isLoading } = useQuery({
        queryKey: ['video', params.id],
        queryFn: () => myQuery.getVideoById(token, params.id)
    })

    if (isLoading) {
        return <div>Loading...</div>
    }


    return (
        <Box className='mt-4 w-full '>

            <Box className='lg:w-2/3 px-3 lg:px-2 '>
                <VideoPlayer data={data} />
                <Comments />
            </Box>


        </Box>
    )
}

export default Watch
