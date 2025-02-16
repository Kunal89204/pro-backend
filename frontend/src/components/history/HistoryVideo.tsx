import { useThemeColors } from '@/hooks/useThemeColors';
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'



const formatDuration = (input: number | string | bigint): string => {
    const seconds = typeof input === "string" ? Number(input) : Number(input);

    if (isNaN(seconds) || seconds < 0) return "0:00"; // Handle invalid values

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
};


const HistoryVideo = ({ videoId, thumbnail, title, duration, views, fullName, description }: { videoId: string, thumbnail: string, title: string, duration: number, views: number, fullName: string, description:string }) => {

    const {textColor, secondaryTextColor} = useThemeColors()
    return (
        <div>
            <Flex gap={4} my={3}>
                <Box position={'relative'}>
                    <Link href={`/watch/${videoId}`}>
                        <Image src={thumbnail} alt={title} width={1000} height={1000} className="w-56  rounded-xl aspect-video" />
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

                <Box>
                    <Text fontSize={'xl'} fontWeight={'semibold'} lineHeight={'25px'} maxW={'500px'} noOfLines={2} color={textColor}>{title}</Text>
                    <Flex fontSize="xs" color={secondaryTextColor} alignItems="center" gap={2}>
                        <Text>{fullName}</Text>
                        <Box w={1} h={1} bg="gray.500" borderRadius="full" />
                        <Text>{views} views</Text>
                    </Flex>
                    <Text maxW={'500px'} fontSize={'sm'} textColor={secondaryTextColor} lineHeight={'20px'} noOfLines={2} pt={2}>{description}</Text>
                </Box>
            </Flex>
        </div>
    )
}

export default HistoryVideo
