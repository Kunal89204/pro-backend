import React from "react";
import { Box, Flex, Text, Avatar, IconButton, Divider } from "@chakra-ui/react";
import {
  IconHeart,
  IconMessageCircle,
  IconEye,
  IconShare,
  IconBookmark,
} from "@tabler/icons-react";
import Image from "next/image";

interface TweetProps {
  id?: string;
  author?: {
    name: string;
    username: string;
    avatar: string;
  };
  content?: string;
  timestamp?: string;
  likes?: number;
 
  comments?: number;
  views?: number;
}

const Tweet: React.FC<TweetProps> = ({
  id,
  author = {
    name: "John Doe",
    username: "johndoe",
    avatar: "https://via.placeholder.com/40",
  },
  content = "This is a sample tweet content.",
  timestamp = "2h ago",
  likes = 0,
  comments = 0,
  views = 0,
}) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      key={id}
      mb={2}
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
      //   maxH="500px"
    >
      <Flex mb={3} justifyContent="space-between">
        <Flex>
          <Avatar src={author.avatar} size="md" mr={3} />
          <Box>
            <Flex alignItems="center">
              <Text fontWeight="bold" mr={1}>
                {author.name}
              </Text>
              <Text color="gray.500" fontSize="xs" ml={1}>
                • {timestamp}
              </Text>
            </Flex>
            <Text color="gray.500" fontSize="xs">
              @{author.username}
            </Text>
          </Box>
        </Flex>
        <IconButton
          aria-label="Comment"
          icon={<IconBookmark size={18} />}
          variant="ghost"
          size="sm"
          _hover={{ color: "blue.500" }}
        />
      </Flex>

      <Text mb={3}>{content}</Text>
      <Box>
        <Image
          src="https://img.freepik.com/free-vector/follow-me-social-business-theme-design_24877-50426.jpg?uid=R102693816&ga=GA1.1.1255758767.1750578121&semt=ais_hybrid&w=740"
          alt="Tweet Image"
          width={1000}
          height={1000}
        />
      </Box>

      <Divider my={2} />

      <Flex justifyContent="space-between" mt={2}>
        <Flex alignItems="center">
          <IconButton
            aria-label="Like"
            icon={<IconHeart size={18} />}
            variant="ghost"
            size="sm"
            _hover={{ color: "red.500" }}
          />
          <Text fontSize="xs" mr={1}>
            {likes}
          </Text>
        </Flex>

        <Flex alignItems="center">
          <IconButton
            aria-label="Comment"
            icon={<IconEye size={18} />}
            variant="ghost"
            size="sm"
            _hover={{ color: "blue.500" }}
          />
          <Text fontSize="xs" mr={1}>
            {views}
          </Text>
        </Flex>

        <Flex alignItems="center">
          <IconButton
            aria-label="Comment"
            icon={<IconMessageCircle size={18} />}
            variant="ghost"
            size="sm"
            _hover={{ color: "blue.500" }}
          />
          <Text fontSize="xs" mr={1}>
            {comments}
          </Text>
        </Flex>

        <IconButton
          aria-label="Share"
          icon={<IconShare size={18} />}
          variant="ghost"
          size="sm"
          _hover={{ color: "blue.500" }}
        />
      </Flex>
    </Box>
  );
};

export default Tweet;
