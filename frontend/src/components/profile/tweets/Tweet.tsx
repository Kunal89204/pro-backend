import React from "react";
import {
  Box,
  
  Flex,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Image from "next/image";
import { useThemeColors } from "@/hooks/useThemeColors";
import { formatPostTime } from "@/utils/relativeTime";

import { IconDotsVertical, IconEye, IconShare } from "@tabler/icons-react";
import { IconHeart } from "@tabler/icons-react";
import { IconMessageCircle } from "@tabler/icons-react";

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
      <Flex justifyContent="space-between" mt="1" className="w-full">
        <Flex alignItems="center">
          <IconButton
            aria-label="Like"
            icon={
              <IconHeart
                size={20}
                color={colorMode == "light" ? "black" : "white"}
              />
            }
            variant="ghost"
            size="sm"
            _hover={{ color: "red.500" }}
          />
          <Text
            fontSize="xs"
            mr={1}
            color={colorMode == "light" ? "black" : "white"}
          >
            12323
          </Text>
        </Flex>

        <Flex alignItems="center">
          <IconButton
            aria-label="Comment"
            icon={
              <IconEye
                size={20}
                color={colorMode == "light" ? "black" : "white"}
              />
            }
            variant="ghost"
            size="sm"
            _hover={{ color: "blue.500" }}
          />
          <Text
            fontSize="xs"
            mr={1}
            color={colorMode == "light" ? "black" : "white"}
          >
            {/* {data?.views} */}12
          </Text>
        </Flex>

        <Flex alignItems="center">
          <IconButton
            aria-label="Comment"
            icon={
              <IconMessageCircle
                size={20}
                color={colorMode == "light" ? "black" : "white"}
              />
            }
            variant="ghost"
            size="sm"
            _hover={{ color: "blue.500" }}
          />
          <Text
            fontSize="xs"
            mr={1}
            color={colorMode == "light" ? "black" : "white"}
          >
            123
          </Text>
        </Flex>

        <IconButton
          aria-label="Share"
          icon={
            <IconShare
              size={20}
              color={colorMode == "light" ? "black" : "white"}
            />
          }
          variant="ghost"
          size="sm"
          _hover={{ color: "blue.500" }}
        />
      </Flex>
    </Box>
  );
};

export default Tweet;
