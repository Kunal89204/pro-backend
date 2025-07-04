import React from "react";
import Image from "next/image";
import { SearchResult } from "./Results";
import { Box, Flex, Text, Avatar, HStack, VStack, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const Result = ({ item }: { item: SearchResult }) => {
  const router = useRouter();
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDuration = (duration: string | number) => {
    if (typeof duration === "number") {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    return duration;
  };

  return (
    <Box
      p={4}
      borderRadius="lg"
      bg={useColorModeValue("white", "gray.800")}
      boxShadow="sm"
     
      transition="all 0.2s"
      cursor="pointer"
      mb={4}
      className="w-full"
    >
      <Flex gap={4} align="start" className="w-full">
        <Box onClick={() => {
          router.push(`/watch/${item._id}`);
        }} position="relative" flexShrink={0} className="w-1/4 ">
          <Image
            src={item.thumbnail}
            alt={item.title}
            width={1000}
            height={1000}
            className="w-full h-full"
            style={{
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
          <Box
            position="absolute"
            bottom={1}
            right={1}
            bg="blackAlpha.800"
            color="white"
            px={1}
            py={0.5}
            borderRadius="sm"
            fontSize="xs"
            fontWeight="bold"
          >
            {formatDuration(item.duration).split(".")[0]}
          </Box>
        </Box>

        <VStack align="start" flex={1} spacing={2} className="w-3/4 ">
          <Text
            fontSize="lg"
            fontWeight="semibold"
            lineHeight="short"
            noOfLines={2}
            color={useColorModeValue("gray.800", "white")}
            onClick={() => {
              router.push(`/watch/${item._id}`);
            }}
            className="cursor-pointer"
          >
            {item.title}
          </Text>

          <Flex alignItems="center" gap={2}><Text fontSize="sm" color={useColorModeValue("gray.600", "white")}>
            {formatViews(item.views)} views
          </Text>
          <Box className="w-1 h-1 rounded-full bg-gray-600" bg={useColorModeValue("gray.600", "white")}></Box>
          <Text fontSize="sm" color={useColorModeValue("gray.600", "white")}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          </Flex>

          <Text fontSize="sm" color={useColorModeValue("gray.600", "white")} noOfLines={2} lineHeight="base">
            {item.description}
          </Text>

          <HStack spacing={2} align="center">
            <Avatar
              size="sm"
              src={item.owner.avatar}
              name={item.owner.fullName}
            />
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.700", "white")}>
                {item.owner.fullName}
              </Text>
             
            </VStack>
          </HStack>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Result;
