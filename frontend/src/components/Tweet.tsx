import React from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  IconButton,
  Divider,
  useColorMode,
} from "@chakra-ui/react";
import {
  IconHeart,
  IconMessageCircle,
  IconEye,
  IconShare,
  IconBookmark,
} from "@tabler/icons-react";
import Image from "next/image";
import { formatPostTime } from "@/utils/relativeTime";
import { useRouter } from "next/navigation";

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
  image?: string;
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
  image,
}) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      key={id}
      mb={2}
      w="100%"
      h="100%"
      maxH="500px"
      display="flex"
      flexDirection="column"
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
    >
      <Flex mb={3} justifyContent="space-between">
        <Flex>
          <Avatar src={author.avatar} size="md" mr={3} />
          <Box>
            <Flex alignItems="center">
              <Text
                fontWeight="bold"
                mr={1}
                color={colorMode == "light" ? "black" : "white"}
              >
                {author.name}
              </Text>
              <Text color="gray.500" fontSize="xs" ml={1}>
                • {formatPostTime(timestamp)}
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

      <Text
        onClick={() => {
          router.push(`/tweet/${id}`);
        }}
        cursor="pointer"
        mb={3}
        color={colorMode == "light" ? "black" : "white"}
        className="line-clamp-1"
      >
        {content}
      </Text>
      {image && (
        <Box
          position="relative"
          width="100%"
          height="200px"
          overflow="hidden"
          borderRadius="md"
          mb={2}
          cursor="pointer"
          onClick={() => {
            router.push(`/tweet/${id}`);
          }}
        >
          <Image
            src={image}
            alt="Tweet Image"
            fill
            style={{ objectFit: "cover" }}
            className="blur-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <Box className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <IconEye size={50} color="white" />
          </Box>
        </Box>
      )}

      <Divider my={2} />

      <Flex justifyContent="space-between" mt="auto">
        <Flex alignItems="center">
          <IconButton
            aria-label="Like"
            icon={<IconHeart size={18} />}
            variant="ghost"
            size="sm"
            _hover={{ color: "red.500" }}
          />
          <Text
            fontSize="xs"
            mr={1}
            color={colorMode == "light" ? "black" : "white"}
          >
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
          <Text
            fontSize="xs"
            mr={1}
            color={colorMode == "light" ? "black" : "white"}
          >
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
          <Text
            fontSize="xs"
            mr={1}
            color={colorMode == "light" ? "black" : "white"}
          >
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
