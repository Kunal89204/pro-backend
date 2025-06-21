import { useThemeColors } from "@/hooks/useThemeColors";
import {
  Box,
  IconButton,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { IconDotsVertical } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import SaveToPlaylistModal from "@/components/Modals/SaveToPlaylistModal";
import ShareVideo from "../Modals/ShareVideo";

const Suggestions = ({
  videoData,
}: {
  videoData: {
    _id: string;
    title: string;
    thumbnail: string;
    owner: {
      fullName: string;
    };
    views: number;
  };
}) => {
  const { textColor, secondaryTextColor } = useThemeColors();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenShare,
    onOpen: onOpenShare,
    onClose: onCloseShare,
  } = useDisclosure();
  return (
    <Box
      className=" p-2 rounded-lg flex gap-2 justify-between relative  transition-all duration-300"
      _hover={{ bg: colorMode === "dark" ? "#202020" : "#f0f0f0" }}
    >
      <Box className="flex gap-2 w-full ">
        <Link href={`/watch/${videoData._id}`} className="w-2/5">
          <Image
            src={videoData?.thumbnail}
            alt="test"
            width={100}
            height={100}
            className="rounded-lg w-full"
          />
        </Link>

        <Box className="w-3/5">
          <Link href={`/watch/${videoData._id}`}>
            <Text
              className="h-fit"
              color={textColor}
              fontSize={"18px"}
              noOfLines={2}
            >
              {videoData.title}
            </Text>
          </Link>
          <Box className="">
            <Link href={`/watch/${videoData._id}`}>
              <Text
                className="h-fit"
                color={secondaryTextColor}
                fontSize={"xs"}
              >
                {videoData.owner?.fullName}
              </Text>
            </Link>
            <Text className="h-fit" color={secondaryTextColor} fontSize={"xs"}>
              {videoData.views} views
            </Text>
          </Box>
        </Box>
      </Box>

      <Box>
        <Menu>
          <MenuButton
            height={0}
            width={6}
            minW={0}
            as={IconButton}
            icon={
              <IconDotsVertical
                width={20}
                className={colorMode == "light" ? "text-black" : "text-white"}
              />
            }
            variant="unstyled"
            aria-label="Options"
          />
          <MenuList
            textColor={textColor}
            bg={"transparent"}
            border={"0px solid #202020"}
            backdropFilter="blur(20px)"
          >
            <MenuItem
              bg={"transparent"}
              _hover={{ backdropFilter: "blur(40px)" }}
              onClick={onOpen}
            >
              Save to Playlist
            </MenuItem>
            <MenuItem
              bg={"transparent"}
              _hover={{ backdropFilter: "blur(40px)" }}
              onClick={onOpenShare}
            >
              Share
            </MenuItem>
            <MenuItem
              bg={"transparent"}
              _hover={{ backdropFilter: "blur(40px)" }}
            >
              Report
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <SaveToPlaylistModal
        isOpen={isOpen}
        onClose={onClose}
        videoId={videoData._id}
      />

      <ShareVideo
        isOpen={isOpenShare}
        onClose={onCloseShare}
        videoId={videoData._id}
      />
    </Box>
  );
};

export default Suggestions;
