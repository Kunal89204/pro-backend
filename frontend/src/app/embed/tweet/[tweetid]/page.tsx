"use client";
import { useParams } from "next/navigation";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import tweetQueries from "@/api/tweetQueries";
import Image from "next/image";
import { Box, Flex, Text, useColorMode, Divider } from "@chakra-ui/react";
import {
  IconHeart,
  IconEye,
  IconMessageCircle,
  IconShare,
} from "@tabler/icons-react";
import { useThemeColors } from "@/hooks/useThemeColors";
import { formatPostTime } from "@/utils/relativeTime";

const EmbedTweet = () => {
  const { tweetid } = useParams();
  const { colorMode } = useColorMode();
  const { textColor, secondaryTextColor } = useThemeColors();
  
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["tweet", tweetid],
    queryFn: () => tweetQueries.getTweetByIdForEmbed(tweetid as string),
  });

  if (isError) {
    return (
      <div className="max-w-lg mx-auto p-6 border border-red-300 rounded-lg bg-red-50">
        <Text color="red.500" fontSize="sm">
          Unable to load tweet: {error.message}
        </Text>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto p-6 border border-gray-200 rounded-lg animate-pulse">
        <Flex gap={3} mb={4}>
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <Box flex={1}>
            <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </Box>
        </Flex>
        <div className="h-20 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    );
  }

  const processMarkdown = (text: string) => {
    if (!text) return "";

    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(
        /`(.*?)`/g,
        `<code style="background: ${
          colorMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
        }; padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>`
      ) // Code
      .replace(/\n/g, "<br>"); // Line breaks
  };

  const tweet = data?.data;

  return (
    <Box
      maxW="lg"
      mx="auto"
      border="1px"
      borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
      borderRadius="lg"
      p={6}
      bg={colorMode === "dark" ? "gray.800" : "white"}
      boxShadow="lg"
      _hover={{
        boxShadow: "xl",
        transform: "translateY(-1px)",
      }}
      transition="all 0.2s ease-in-out"
    >
      {/* Header */}
      <Flex alignItems="center" gap={3} mb={4}>
        <Image
          src={tweet?.owner?.avatar || "/default-avatar.png"}
          alt={`${tweet?.owner?.fullName || "User"}'s avatar`}
          width={48}
          height={48}
          className="rounded-full object-cover aspect-square"
        />
        <Box flex={1}>
          <Text
            fontWeight="bold"
            fontSize="md"
            color={textColor}
            lineHeight="tight"
          >
            {tweet?.owner?.fullName || "Unknown User"}
          </Text>
          <Text
            fontSize="sm"
            color={secondaryTextColor}
            lineHeight="tight"
          >
            @{tweet?.owner?.username || "unknown"}
          </Text>
        </Box>
        <Text fontSize="xs" color={secondaryTextColor}>
          {tweet?.createdAt ? formatPostTime(tweet.createdAt) : ""}
        </Text>
      </Flex>

      {/* Content */}
      <Box
        mb={tweet?.image ? 4 : 3}
        color={textColor}
        fontSize="md"
        lineHeight="relaxed"
        dangerouslySetInnerHTML={{
          __html: processMarkdown(tweet?.content || ""),
        }}
        sx={{
          strong: {
            fontWeight: "bold",
          },
          em: {
            fontStyle: "italic",
          },
          code: {
            fontSize: "0.9em",
          },
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      />

      {/* Image */}
      {tweet?.image && (
        <Box mb={4} borderRadius="md" overflow="hidden">
          <Image
            src={tweet.image}
            alt="Tweet image"
            width={500}
            height={300}
            className="w-full h-auto object-cover"
            style={{
              borderRadius: "8px",
            }}
          />
        </Box>
      )}

      <Divider mb={3} borderColor={colorMode === "dark" ? "gray.600" : "gray.200"} />

      {/* Engagement Stats */}
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={1} color={secondaryTextColor}>
          <IconHeart size={16} />
          <Text fontSize="sm">{tweet?.likesCount || 0}</Text>
        </Flex>
        
        <Flex alignItems="center" gap={1} color={secondaryTextColor}>
          <IconMessageCircle size={16} />
          <Text fontSize="sm">{tweet?.comments || 0}</Text>
        </Flex>
        
        <Flex alignItems="center" gap={1} color={secondaryTextColor}>
          <IconEye size={16} />
          <Text fontSize="sm">{tweet?.viewsCount || 0}</Text>
        </Flex>
        
        <Flex alignItems="center" gap={1} color={secondaryTextColor}>
          <IconShare size={16} />
        </Flex>
      </Flex>

      {/* Footer */}
      <Box mt={4} pt={3} borderTop="1px" borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}>
        <Text fontSize="xs" color={secondaryTextColor} textAlign="center">
          View on Tvideo
        </Text>
      </Box>
    </Box>
  );
};

export default EmbedTweet;
