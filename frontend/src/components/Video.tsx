import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  IconButton,
  Avatar,
  Badge,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { IconDotsVertical } from "@tabler/icons-react";
import Image, { StaticImageData } from "next/image";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useThemeColors } from "@/hooks/useThemeColors";
import SaveToPlaylistModal from "./Modals/SaveToPlaylistModal";

const formatDuration = (input: number | string | bigint): string => {
  const seconds = typeof input === "bigint" ? Number(input) : Number(input); // Convert to number

  if (isNaN(seconds) || seconds < 0) return "0:00"; // Handle invalid cases

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

interface VideoProps {
  title: string;
  thumbnail: StaticImageData | string;
  logo?: StaticImageData | string;
  channelName?: string;
  views: number;
  uploadTime: number | string;
  duration: number | string;
  videoId: string;
  isProfile: boolean;
}

const Video: React.FC<VideoProps> = ({
  title,
  thumbnail,
  logo,
  channelName,
  views,
  uploadTime,
  duration,
  videoId,
  isProfile,
}) => {
  const { textColor, secondaryTextColor } = useThemeColors();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      borderRadius="2xl"
      overflow="hidden"
      p={2}
      className="hover:bg-gray-700/50 dark:hover:bg-gray-300/50 transition-all duration-500"
    >
      <Box position={"relative"}>
        <Link href={`/watch/${videoId}`}>
          <Image
            src={thumbnail}
            alt={title}
            width={1000}
            height={1000}
            className="w-full rounded-xl aspect-video"
            priority
          />
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
        {!isProfile && (
          <Avatar
            src={typeof logo === "string" ? logo : undefined}
            name={channelName}
            width={"35px"}
            height={"35px"}
          />
        )}
        <Box flex={1}>
          <Flex justify="space-between">
            <Link href={`/watch/${videoId}`} className="w-full">
              <Text
                fontWeight="bold"
                noOfLines={2}
                fontSize="md"
                textColor={textColor}
              >
                {title}
              </Text>
            </Link>
            <Menu>
              <MenuButton
                height={0}
                width={6}
                minW={0}
                as={IconButton}
                icon={
                  <IconDotsVertical
                    width={20}
                    className={
                      colorMode == "light" ? "text-black" : "text-white"
                    }
                  />
                }

                variant="unstyled"
                aria-label="Options"
              />
              <MenuList textColor={textColor} bg="#121212">
                <MenuItem  bg="#121212" className="hover:bg-gray-700/50" onClick={onOpen}>Save to Playlist</MenuItem>
                <MenuItem bg="#121212" className="hover:bg-gray-700/50" >Share</MenuItem>
                <MenuItem bg="#121212" className="hover:bg-gray-700/50" >Report</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Text fontSize="xs" textColor={secondaryTextColor} fontWeight="bold">
            {channelName}
          </Text>
          <Flex
            fontSize="xs"
            textColor={secondaryTextColor}
            alignItems="center"
            gap={2}
          >
            <Text>{views} views</Text>
            <Box w={1} h={1} bg="gray.500" borderRadius="full" />
            <Text>
              {formatDistanceToNow(new Date(uploadTime), { addSuffix: true })}
            </Text>
          </Flex>
        </Box>
      </Flex>

      {/* Modal for save to playlist*/}
      <SaveToPlaylistModal isOpen={isOpen} onClose={onClose} videoId={videoId} />
    </Box>
  );
};

export default Video;
