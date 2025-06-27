import React from "react";
import {
  Box,
  
  Flex,

  Text,
  useColorMode,
} from "@chakra-ui/react";
import Image from "next/image";
import { useThemeColors } from "@/hooks/useThemeColors";
import { formatPostTime } from "@/utils/relativeTime";

import { IconDotsVertical} from "@tabler/icons-react";

import Engagement from "./Engagement";

// Chakra Menu Imports
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,

} from "@chakra-ui/react";

const Tweet = ({
  tweet,
}: {
  tweet: {
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    content: string;
    image: string;
    _id: string;
   
  };
}) => {
  const { colorMode } = useColorMode();
  const { textColor, secondaryTextColor } = useThemeColors();

  return (
    <Box
      className="mb-1 py-2 border p-2 rounded-xl"
      _hover={{ bg: colorMode == "light" ? "gray.100" : "gray.800" }}
    >
      <Flex justifyContent="space-between">
        <Text className="text-gray-500 text-xs" color={secondaryTextColor}>
          {formatPostTime ? formatPostTime(tweet.createdAt) : "Just now"}
        </Text>
        <Menu>
          <MenuButton>
            <IconDotsVertical
              size={20}
              color={colorMode == "light" ? "black" : "white"}
            />
          </MenuButton>

          <MenuList>
            <MenuItem>View</MenuItem>
            <MenuItem>Edit</MenuItem>
            <MenuItem>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Text className="my-3" color={textColor} noOfLines={1}>
        {tweet.content}
      </Text>

      {tweet.image && (
        <Box className="w-full h-64 overflow-hidden relative rounded-xl">
          <Image
            src={tweet.image}
            alt="Tweet image"
            fill
            className="object-cover"
          />
        </Box>
      )}
      <Engagement _id={tweet._id} likes={tweet.likesCount} comments={tweet.commentsCount} views={tweet.viewsCount} />
    </Box>
  );
};

export default Tweet;
