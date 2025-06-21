import { useThemeColors } from "@/hooks/useThemeColors";
import {
  Badge,
  Box,
  Flex,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { IconDotsVertical } from "@tabler/icons-react";
import SaveToPlaylistModal from "../Modals/SaveToPlaylistModal";
import RemoveVideoFromHistory from "../Modals/RemoveVideoFromHistory";

const formatDuration = (input: number | string | bigint): string => {
  const seconds = typeof input === "string" ? Number(input) : Number(input);

  if (isNaN(seconds) || seconds < 0) return "0:00"; // Handle invalid values

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

const HistoryVideo = ({
  videoId,
  thumbnail,
  title,
  duration,
  views,
  fullName,
  description,
  refetch,
}: {
  videoId: string;
  thumbnail: string;
  title: string;
  duration: number;
  views: number;
  fullName: string;
  description: string;
  refetch: () => void;
}) => {
  const { textColor, secondaryTextColor } = useThemeColors();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isOpen: isOpenRemoveVideoFromHistory, onOpen: onOpenRemoveVideoFromHistory, onClose: onCloseRemoveVideoFromHistory } = useDisclosure();


  return (
    <div className="flex my-3 justify-between items-start max-w-[1000px] mx-auto px-4 lg:px-0">
      <Flex gap={4} w={"full"} alignItems={"start"}>
        <Box position={"relative"} className="w-1/3   aspect-video">
          <Link href={`/watch/${videoId}`} className="w-full">
            <Image
              src={thumbnail}
              alt={title}
              width={1000}
              height={1000}
              className="w-full  rounded-xl aspect-video "
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

        <Box className="w-2/3">
          <Text
            fontSize={{ base: "sm", lg: "xl" }}
            fontWeight={"semibold"}
            lineHeight={{ base: "15px", lg: "25px" }}
            maxW={"500px"}
            noOfLines={2}
            color={textColor}
          >
            {title}
          </Text>
          <Flex
            fontSize="xs"
            color={secondaryTextColor}
            alignItems="center"
            gap={2}
          >
            <Text>{fullName}</Text>
            <Box w={1} h={1} bg="gray.500" borderRadius="full" />
            <Text>{views} views</Text>
          </Flex>
          <Text
            maxW={"500px"}
            fontSize={{ base: "xs", lg: "sm" }}
            textColor={secondaryTextColor}
            lineHeight={{ base: "15px", lg: "20px" }}
            noOfLines={{ base: 1, lg: 2 }}
            pt={{ base: 1, lg: 2 }}
          >
            {description}
          </Text>
        </Box>
      </Flex>
      <Menu>
        <MenuButton>
          <IconDotsVertical
            size={20}
            color={colorMode === "dark" ? "white" : "black"}
          />
        </MenuButton>
        <MenuList
          textColor={textColor}
          bg={"transparent"}
          border={"0px solid #202020"}
          backdropFilter="blur(20px)"
        >
          <MenuItem onClick={onOpen} bg="transparent" color={textColor}>
            Save To Playlist
          </MenuItem>
          <MenuItem bg="transparent" color={textColor} onClick={onOpenRemoveVideoFromHistory}>
            Remove
          </MenuItem>
        </MenuList>
      </Menu>

      <SaveToPlaylistModal
        isOpen={isOpen}
        onClose={onClose}
        videoId={videoId}
      />
      <RemoveVideoFromHistory
        isOpen={isOpenRemoveVideoFromHistory}
        onClose={onCloseRemoveVideoFromHistory}
        videoId={videoId}
        refetch={refetch}
      />
    </div>
  );
};

export default HistoryVideo;
