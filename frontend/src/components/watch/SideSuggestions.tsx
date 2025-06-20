"use client";
import { Box, Flex, Heading, Skeleton, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Suggestions from "./Suggestions";
import { useThemeColors } from "@/hooks/useThemeColors";
import { myQuery } from "@/api/query";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const SideSuggestions = ({ videoId }: { videoId: string }) => {
  const { textColor } = useThemeColors();
  const token = useSelector((state: RootState) => state.token);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["OnPageRecommendations", videoId],
    queryFn: () => myQuery.onPageVideoRecommendations(token, videoId),
  });

  useEffect(() => {
    console.log("I am heresss", data);
    console.log(videoId);
  }, [data, videoId]);

  const dummyArray = Array.from({ length: 10 });

  return (
    <Box className=" p-2 rounded-lg">
      <Heading size="md" color={textColor}>
        Related Videos
      </Heading>

      <Flex flexDirection={"column"} gap={0} className="relative">
        {isError ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={8}
            borderRadius="lg"
            bg="red.50"
            border="1px solid"
            borderColor="red.200"
            my={4}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E53E3E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginBottom: 12 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <circle cx="12" cy="16" r="1" />
            </svg>
            <Text color="red.600" fontWeight="bold" fontSize="lg" mb={2}>
              Oops! Something went wrong.   
            </Text>
            <Text color="red.500" fontSize="sm" mb={2}>
              We couldn&apos;t load related videos right now.
            </Text>
            <Text color={textColor} fontSize="xs" opacity={0.7}>
              {error instanceof Error ? error.message : "Unknown error"}
            </Text>
          </Box>
        ) : isLoading ? (
          dummyArray.map((item, index) => (
            <Box key={index} className="flex gap-2 my-2 w-full">
              <Skeleton height={"100px"} width={2 / 5} borderRadius={"10px"} />
              <Box className="flex flex-col gap-2 w-3/5">
                <Skeleton
                  height={"10px"}
                  width={"250px"}
                  borderRadius={"10px"}
                />
                <Skeleton
                  height={"10px"}
                  width={"150px"}
                  borderRadius={"10px"}
                />
                <Skeleton
                  height={"10px"}
                  width={"100px"}
                  my={2}
                  borderRadius={"10px"}
                />
              </Box>
            </Box>
          ))
        ) : (
          data?.data?.map(
            (
              item: {
                _id: string;
                title: string;
                thumbnail: string;
                owner: {
                  fullName: string;
                };
                views: number;
              },
              index: number
            ) => <Suggestions key={index} videoData={item} />
          )
        )}
      </Flex>
    </Box>
  );
};

export default SideSuggestions;
