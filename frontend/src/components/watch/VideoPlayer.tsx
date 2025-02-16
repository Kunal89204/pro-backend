import { useThemeColors } from '@/hooks/useThemeColors';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { IconBookmark, IconShare, IconThumbUp } from '@tabler/icons-react';
import Image from 'next/image';
import React, { useState } from 'react';

// Define types
interface Owner {
    avatar: string;
    fullName: string;
}

interface VideoData {
    videoFile: string;
    title: string;
    description: string;
    owner: Owner;
}

interface ApiResponse {
    data: VideoData;
}

interface VideoPlayerProps {
    data: ApiResponse;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ data }) => {
    const vdo = data?.data;
    const [showFullDesc, setShowFullDesc] = useState(false);
    const descriptionLimit = 235; // Character limit before showing "See More"
    const { textColor, secondaryTextColor, secondaryBgColor } = useThemeColors();

    return (
        <Box className='w-full'>
            <video className='aspect-video w-full rounded-xl' src={vdo?.videoFile} controls autoPlay></video>

            <Heading as={'h2'} fontSize={'2xl'} py={1} color={textColor}>{vdo?.title}</Heading>

            <Flex justifyContent={'space-between'} flexDir={{ base: 'column', lg: "row" }} alignItems={{ base: 'stretch', lg: 'center' }}>
                <Flex gap={2} py={3} alignItems={'center'}>
                    <Image src={vdo?.owner?.avatar} alt='Owner Avatar' width={1000} height={1000} className='w-10 lg:w-12 aspect-square object-cover rounded-full' />
                    <Box>
                        <Text color={textColor} fontWeight={'semibold'} noOfLines={1}>{vdo?.owner?.fullName}</Text>
                        <Text color={secondaryTextColor} fontSize={'xs'} fontWeight={'600'}>100 subscribers</Text>
                    </Box>
                    <Box mx={4} alignSelf={'end'}>
                        <Button>Subscribe</Button>
                    </Box>
                </Flex>

                <Flex gap={2}>
                    <Button className='flex gap-2'><IconThumbUp /> Like</Button>
                    <Button className='flex gap-2'><IconShare /> Share</Button>
                    <Button><IconBookmark /> Save</Button>
                </Flex>
            </Flex>

            <Box bg={secondaryBgColor} borderRadius={'10px'} my={2} p={2} position={'relative'}>
                <Text fontWeight={'semibold'} color={textColor}>Description</Text>
                <Text color={secondaryTextColor}>
                    {showFullDesc ? vdo?.description : vdo?.description?.slice(0, descriptionLimit)}
                    {vdo?.description?.length > descriptionLimit && (
                        <Button variant={'link'} position={'absolute'} right={10} bottom={2} color={textColor} fontWeight={'semibold'} onClick={() => setShowFullDesc(!showFullDesc)}>
                            {showFullDesc ? " See Less" : " See More"}
                        </Button>
                    )}
                </Text>
            </Box>
        </Box>
    );
}

export default VideoPlayer;
