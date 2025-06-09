import { formatDuration } from '@/utils/formatDuration';
import { Box, Flex, HStack, IconButton, Image, Text, useColorModeValue, useDisclosure, VStack } from '@chakra-ui/react'
import { IconEye, IconTrashFilled } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import RemoveVideoFromPlaylist from '../Modals/RemoveVideoFromPlaylist';

const PlaylistVideo = ({ video, idx, playlistId }: {
    video:{
        _id:string,
        thumbnail:string,
        title:string,
        duration:number|string,
        description:string,
        views:number

    },
    idx:number, playlistId:string
}) => {
    const router = useRouter()
  
    const cardBg = useColorModeValue("white", "#111111");
   
    const textColor = useColorModeValue("gray.900", "#ffffff");
    const subtleTextColor = useColorModeValue("gray.500", "#888888");
    const hoverBg = useColorModeValue("gray.50", "#161616");

    const { isOpen: removeVideoIsOpen, onClose: removeVideoOnClose, onOpen: removeVideoOnOpen } = useDisclosure()

    const formatViews = (views: number) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views.toString();
    };

    return (
        <Box
            key={video._id}
            p={4}
            borderRadius="lg"
            cursor="pointer"

            _hover={{ bg: hoverBg }}
            transition="all 0.2s"
            border="1px solid"
            borderColor="transparent"
        //   _hover={{ borderColor: borderColor }}
        >
            <Flex align="center" gap={4}>
                {/* Video Index */}
                <Text
                    fontSize="sm"
                    color={subtleTextColor}
                    fontWeight="medium"
                    minW="24px"
                    textAlign="center"
                    onClick={() => router.push(`/watch/${video._id}`)}
                >
                    {idx + 1}
                </Text>

                {/* Video Thumbnail */}
                <Box
                    w="120px"
                    h="68px"
                    borderRadius="md"
                    overflow="hidden"
                    bg={cardBg}
                    flexShrink={0}
                    position="relative"
                    onClick={() => router.push(`/watch/${video._id}`)}
                >
                    <Image
                        src={video.thumbnail}
                        alt={video.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      
                    />

                    {/* Duration Badge */}
                    <Box
                        position="absolute"
                        bottom={1}
                        right={1}
                        bg="blackAlpha.800"
                        color="white"
                        px={2}
                        py={0.5}
                        borderRadius="sm"
                        fontSize="xs"
                        fontWeight="medium"
                    >
                        {formatDuration(video.duration)}
                    </Box>
                </Box>

                {/* Video Info */}
                <VStack align="flex-start" spacing={2} flex={1} minW={0}>
                    <Text
                        fontWeight="medium"
                        color={textColor}
                        fontSize="md"
                        noOfLines={2}
                        lineHeight="shorter"
                        onClick={() => router.push(`/watch/${video._id}`)}
                    >
                        {video.title}
                    </Text>

                    {video.description && (
                        <Text
                            fontSize="sm"
                            color={subtleTextColor}
                            noOfLines={1}
                            lineHeight="shorter"
                            onClick={() => router.push(`/watch/${video._id}`)}
                        >
                            {video.description}
                        </Text>
                    )}

                    <HStack spacing={3} fontSize="xs" color={subtleTextColor}>
                        <HStack spacing={1}>
                            <IconEye size={12} />
                            <Text>{formatViews(video.views)} views</Text>
                        </HStack>
                    </HStack>
                </VStack>

                {/* More Options */}
                <IconButton
                    icon={<IconTrashFilled size={16} />}
                    aria-label="More options"
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    color={subtleTextColor}
                    _hover={{ bg: hoverBg, color: textColor }}
                    borderRadius="full"
                    onClick={removeVideoOnOpen}
                />
            </Flex>

            <RemoveVideoFromPlaylist playlistId={playlistId} isOpen={removeVideoIsOpen} onClose={removeVideoOnClose} videoId={video._id} />
        </Box>
    )
}

export default PlaylistVideo
