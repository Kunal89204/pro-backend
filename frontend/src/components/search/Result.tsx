import React from "react";
import Image from "next/image";
import { SearchResult } from "./Results";
import {
  Box,
  Flex,
  Text,
  Avatar,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useThemeColors } from "@/hooks/useThemeColors";

const Result = ({ item }: { item: SearchResult }) => {
  const router = useRouter();
  const { textColor, secondaryTextColor } = useThemeColors();
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
      // bg={useColorModeValue("white", "#111111")}
      boxShadow="sm"
      transition="all 0.2s"
      cursor="pointer"
      mb={4}
      className="w-full"
    >
      <Flex
        gap={4}
        align="start"
        className="w-full"
        direction={{ base: "column", md: "row" }}
      >
        <Box
          onClick={() => {
            router.push(`/watch/${item._id}`);
          }}
          position="relative"
          flexShrink={0}
          className="lg:w-1/4 w-full"
        >
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

       

        <VStack align="start" flex={1} spacing={2} className="lg:w-3/4 w-full">
          {/* Title */}
          <Flex gap={3} align="start">
            <Box>
              <Avatar
                src={item.owner.avatar}
                name={item.owner.fullName}
                size={{ base: "sm", md: "md" }}
              />
            </Box>
            <Box>
              <Text
                color={textColor}
                fontSize={{ base: "lg", md: "xl" }}
                lineHeight="short"
                noOfLines={2}
                onClick={() => {
                  router.push(`/watch/${item._id}`);
                }}
                className="cursor-pointer"
              >
                {item.title}
              </Text>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={secondaryTextColor}
              >
                {item.owner.fullName}
              </Text>

              {/* <Text fontSize={{ base: "xs", md: "sm" }} py={2} className="hidden md:block"  color={secondaryTextColor} noOfLines={2} lineHeight="base">
                {item.description}
              </Text> */}
              <Flex align="center" gap={1}>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color={secondaryTextColor}
                >
                  {formatViews(item.views)} views
                </Text>
                <Box
                  className="w-1 h-1 rounded-full bg-gray-600"
                  bg={useColorModeValue("gray.600", "white")}
                ></Box>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color={secondaryTextColor}
                >
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </Flex>
            </Box>
          </Flex>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Result;
