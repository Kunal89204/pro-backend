import { myQuery } from '@/api/query'
import { RootState } from '@/lib/store'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useSelector } from 'react-redux'
import Video from './Video'
import { VideoProps } from '@/types/types'
import { Box, VStack, Text, Icon } from '@chakra-ui/react'
import { IconVideoOff } from '@tabler/icons-react'
import { useThemeColors } from '@/hooks/useThemeColors'




const Myvideos: React.FC<{username: string | undefined}> = ({username}) => {
    const token = useSelector((state: RootState) => state.token)
    const { textColor, secondaryTextColor } = useThemeColors()

    const { data } = useQuery({
        queryKey: ['myvideos'],
        queryFn: () => myQuery.getUserVideos(token, username as string)
    })

    const NoVideosComponent = () => (
        <Box className="flex flex-col items-center justify-center py-16 px-4">
            <VStack spacing={4} textAlign="center">
                <Box
                    p={6}
                    borderRadius="full"
                    bg="gray.50"
                    _dark={{ bg: "gray.800" }}
                >
                    <Icon as={IconVideoOff} boxSize={12} color="gray.400" />
                </Box>
                <Text fontSize="xl" fontWeight="semibold" color={textColor}>
                    No videos yet
                </Text>
                <Text color={secondaryTextColor} maxW="md">
                    This channel hasn't uploaded any videos yet. Check back later for new content!
                </Text>
            </VStack>
        </Box>
    )

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-6 gap-4'>
           
            {data?.videos?.length > 0 ? data?.videos?.map((vdo: VideoProps, i: number) => (
                <Video
                    key={i}
                    duration={vdo.duration}
                    thumbnail={vdo.thumbnail}
                    _id={vdo._id}
                    createdAt={vdo.createdAt}
                    title={vdo.title}
                    views={vdo.views}
                    owner={vdo?.owner}
                />
            )) : <div className="col-span-full"><NoVideosComponent /></div>}
        </div>
    )
}

export default Myvideos
