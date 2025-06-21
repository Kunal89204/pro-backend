"use client"
import { myQuery } from '@/api/query'
import Comments from '@/components/watch/Comments'
import VideoPlayer from '@/components/watch/VideoPlayer'
import { RootState } from '@/lib/store'
import { Box, Button, Center, Heading, Text, useColorMode, VStack } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import vdonotfound from '../../../../public/assets/videonotfound.jpg'
import test3 from '../../../../public/assets/test3.jpg'
import Image from 'next/image'
import { useThemeColors } from '@/hooks/useThemeColors'
import SideSuggestions from '@/components/watch/SideSuggestions'




const Watch = ({ params }: { params: { id: string } }) => {
    const token = useSelector((state: RootState) => state.token)
    const router = useRouter()
    const {textColor, secondaryTextColor} = useThemeColors()
    const {colorMode} = useColorMode()


    const addVideoToWatchHistoryMutation = useMutation({
        mutationFn: () => myQuery.addVideoToWatchHistory(token, params.id),
        onError: (error) => {
            console.log(error)
        },
        onSuccess: () => {
            console.log('Video added to watch history')
        }
    })

    useEffect(() => {
        addVideoToWatchHistoryMutation.mutate()
    }, [params.id])


    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['video', params.id],
        queryFn: () => myQuery.getVideoById(token, params.id)
    })

    const {data:comments,isLoading:commentsLoading, refetch:commentsRefetch,isError:isCommentsError,error:commentsError} = useQuery({
        queryKey:['comments',params.id],
        queryFn:()=>myQuery.getComments(token,params.id)
    })

    if (isError) {
        console.log("error in video",error)
    }

    if (isCommentsError) {
        console.log("error in comments",commentsError)
    }

    if (isLoading) {
        return <Center h="80vh"><Text fontSize="xl">Loading...</Text></Center>
    }

    // Handling video not found case
    if (!data || data.response?.data?.success === false) {
        return (
            <Center h="80vh">
                <VStack spacing={4} textAlign="center">
                    <Image src={colorMode == "dark"?test3:vdonotfound} alt='placehodler' width={1000} className='w-1/2 rounded-3xl'  />
                    <Heading size="lg" color={textColor}>Video Not Found</Heading>
                    <Text color={secondaryTextColor}>The video you are looking for does not exist or has been removed.</Text>
                    <Button colorScheme="blue" onClick={() => router.push('/')}>
                        Go Back Home
                    </Button>
                </VStack>
            </Center>
        )
    }


    return (
        <Box className='mt-4 w-full flex flex-col lg:flex-row '>
            <Box className='lg:w-2/3 px-3 lg:px-0 '>
                <VideoPlayer data={data} />
                <Comments comments={comments?.comments} videoId={params.id} refetch={commentsRefetch} isLoading={commentsLoading} />
            </Box>
            <Box className='lg:w-1/3 px-3 lg:px-0'>
               <SideSuggestions videoId={params.id} />
            </Box>
        </Box>
    )
}

export default Watch
