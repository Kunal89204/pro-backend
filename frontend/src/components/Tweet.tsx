"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  IconButton,
  Divider,
  useColorMode,
} from "@chakra-ui/react";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import Image from "next/image";
import { formatPostTime } from "@/utils/relativeTime";
import { useRouter } from "next/navigation";
import Engagement from "./profile/tweets/Engagement";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { myQuery } from "@/api/query";

interface TweetProps {
  id?: string | undefined;
  author?: {
    name: string;
    username: string;
    avatar: string;
    _id: string;
  };
  content?: string;
  timestamp?: string;
  likesCount?: number|undefined;

  comments?: number;
  views?: number;
  image?: string;
}

const Tweet: React.FC<TweetProps> = ({
  id,
  author,
  content,
  timestamp,
  likesCount,
  comments,
  views,
  image,
}) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.token);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const bookMarkMutation = useMutation({
    mutationFn: () => myQuery.bookMarkTweet(token, id),
    onSuccess: () => {
      console.log("bookmarked");
    },
    onError: () => {
      console.log("error");
      setIsBookmarked(!isBookmarked);
    },
  });

  const { data: bookmarkStatus } = useQuery({
    queryKey: ["bookmarkStatus", id],
    queryFn: () => myQuery.getBookmarkStatus(token, id),
    enabled: !!id,
  });

  useEffect(() => {
    if (bookmarkStatus) {
      setIsBookmarked(bookmarkStatus.data.isBookmarked);
    }
  }, [bookmarkStatus]);

  const handleBookMark = () => {
    setIsBookmarked(!isBookmarked);
    bookMarkMutation.mutate();
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      px={4}
      pb={2}
      pt={4}
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
          <Avatar src={author?.avatar} size="md" mr={3} />
          <Box>
            <Flex alignItems="center">
              <Text
                fontWeight="bold"
                mr={1}
                color={colorMode == "light" ? "black" : "white"}
              >
                {author?.name}
              </Text>
              <Text color="gray.500" fontSize="xs" ml={1}>
                • {formatPostTime(timestamp || "")}
              </Text>
            </Flex>
            <Text color="gray.500" fontSize="xs">
              @{author?.username}
            </Text>
          </Box>
        </Flex>
        <IconButton
          aria-label="Comment"
          icon={
            isBookmarked ? (
              <IconBookmarkFilled size={18} fill="currentColor" />
            ) : (
              <IconBookmark size={18} />
            )
          }
          variant="ghost"
          colorScheme="gray"
          size="sm"
          onClick={handleBookMark}
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
            // className="blur-xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Box>
      )}

      <Divider my={0} />

      <Engagement
        _id={id || ""}
      
        likes={likesCount }
        comments={comments || 0}
        views={views || 0}
      />
    </Box>
  );
};

export default Tweet;
