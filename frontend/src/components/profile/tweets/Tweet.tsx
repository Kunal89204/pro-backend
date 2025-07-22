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
import { useRouter } from "next/navigation";

// Chakra Menu Imports
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

const Tweet = ({
  tweet,
  
  userId,
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
 
  userId: string | undefined;
}) => {
  const { colorMode } = useColorMode();
  const { textColor, secondaryTextColor } = useThemeColors();
  const router = useRouter();
  const userIdAccount = useSelector((state: RootState) => state.user?._id);
  
 
  // Markdown processing function
  const processMarkdown = (text: string) => {
    if (!text) return "";
    
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/`(.*?)`/g, `<code style="background: ${colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>`) // Code
      .replace(/\n/g, '<br>'); // Line breaks
  };

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
            <MenuItem onClick={() => router.push(`/tweet/${tweet._id}`)} textColor={textColor}>View</MenuItem>
            {/* <MenuItem onClick={() => router.push(`/tweet/${tweet._id}`)} textColor={textColor}>Bookmark</MenuItem> */}
              {userIdAccount === userId && (
                <>
                  <MenuItem onClick={() => router.push(`/tweet/${tweet._id}/edit`)} textColor={textColor}>Edit</MenuItem>
                  <MenuItem onClick={() => router.push(`/tweet/${tweet._id}/delete`)} textColor={textColor}>Delete</MenuItem>
                </>
              )}
            </MenuList>
        </Menu>
      </Flex>

      <Box
      onClick={() => router.push(`/tweet/${tweet._id}`)}
        className="my-3 cursor-pointer"
        color={textColor}
        dangerouslySetInnerHTML={{
          __html: processMarkdown(tweet.content || "")
        }}
        sx={{
          // Custom styles for markdown elements
          'strong': {
            fontWeight: 'bold',
          },
          'em': {
            fontStyle: 'italic',
          },
          'code': {
            fontSize: '0.9em',
          },
          // Ensure line breaks are preserved
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          // Text truncation for overflow
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
        }}
      />

<Box className="w-full h-64 overflow-hidden relative rounded-xl cursor-pointer" onClick={() => router.push(`/tweet/${tweet._id}`)}>
      {tweet.image && (
          <Image
            src={tweet.image}
            alt="Tweet image"
            fill
            className="object-cover"
          />
        )}
        </Box>
      <Engagement _id={tweet._id} likes={tweet.likesCount} comments={tweet.commentsCount} views={tweet.viewsCount} />
    </Box>
  );
};

export default Tweet;