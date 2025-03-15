import React from 'react'
import { VideoProps } from '@/types/types'
import { useThemeColors } from '@/hooks/useThemeColors'
import { formatDistanceToNow } from "date-fns"
import { Box, Flex, Menu, MenuButton, MenuItem, MenuList, Text, IconButton, Avatar, Badge, useColorMode } from "@chakra-ui/react";
import { IconDotsVertical } from "@tabler/icons-react";
import Image, { StaticImageData } from "next/image";
import Link from 'next/link';
import DeleteButton from './DeleteButton';


const formatDuration = (input: number | string | bigint): string => {
    const seconds = typeof input === "bigint" ? Number(input) : Number(input); // Convert to number

    if (isNaN(seconds) || seconds < 0) return "0:00"; // Handle invalid cases

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const Video: React.FC<VideoProps> = ({ duration, thumbnail, _id, createdAt, title, views }) => {

    const { textColor, secondaryTextColor } = useThemeColors()
    const { colorMode } = useColorMode()


 
    return (
        <Box borderRadius="xl" overflow="hidden">

            <Box position={'relative'}>
                <Link href={`/watch/${_id}`}>
                    <Image src={thumbnail} alt={title} width={1000} height={1000} className="w-full rounded-xl aspect-video" />
                </Link>
                <Badge
                    position="absolute"
                    right={2}
                    bottom={2}
                    bg="rgba(0,0,0,0.6)"
                    textColor="white"
                    borderRadius={3}
                >
                    {formatDuration(duration)}
                </Badge>
            </Box>
            <Flex gap={3} py={3} alignItems="start">

                <Box flex={1}>
                    <Flex justify="space-between" >
                        <Link href={`/watch/${_id}`}>
                            <Text fontWeight="bold" noOfLines={2} fontSize="md" textColor={textColor}>
                                {title}
                            </Text></Link>
                        <Menu >
                            <MenuButton height={0} width={6} minW={0} as={IconButton} icon={<IconDotsVertical width={20} className={colorMode == "light" ? "text-black" : "text-white"} />} variant="unstyled" aria-label="Options" />
                            <MenuList textColor={textColor}>
                                <MenuItem >Save to Playlist</MenuItem>
                                <MenuItem >Share</MenuItem>
                                <DeleteButton id={_id}>Delete</DeleteButton>
                            </MenuList>
                        </Menu>
                    </Flex>

                    <Flex fontSize="xs" textColor={secondaryTextColor} alignItems="center" gap={2}>
                        <Text>{views} views</Text>
                        <Box w={1} h={1} bg="gray.500" borderRadius="full" />
                        <Text>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</Text>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}

export default Video
