"use client";
import { myQuery } from "@/api/query";
import Comments from "@/components/watch/Comments";
import VideoPlayer from "@/components/watch/VideoPlayer";
import { RootState } from "@/lib/store";
import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  useColorMode,
  VStack,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import vdonotfound from "../../../../public/assets/videonotfound.jpg";
import test3 from "../../../../public/assets/test3.jpg";
import Image from "next/image";
import { useThemeColors } from "@/hooks/useThemeColors";
import SideSuggestions from "@/components/watch/SideSuggestions";
import commentQueries from "@/api/commentQueries";

const Watch = ({ params }: { params: { id: string } }) => {
  const token = useSelector((state: RootState) => state.token);
  const router = useRouter();
  const { textColor, secondaryTextColor } = useThemeColors();
  const { colorMode } = useColorMode();

  const addVideoToWatchHistoryMutation = useMutation({
    mutationFn: () => myQuery.addVideoToWatchHistory(token, params.id),
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
    
    },
  });

  useEffect(() => {
    addVideoToWatchHistoryMutation.mutate();
  }, [params.id]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["video", params.id],
    queryFn: () => myQuery.getVideoById(token, params.id),
  });

 
 const {data:commentsData, isLoading:commentsDataLoading, isError:isCommentsError, error:commentsError, refetch:commentsRefetch} = useQuery({
  queryKey: ["commentsData", params.id],
  queryFn: () => commentQueries.getComments(token, params.id),
 })

  

  if (isError) {
    console.log("error in video", error);
  }

  if (isCommentsError) {
    console.log("error in comments", commentsError);
  }

  if (isLoading) {
    return (
      <Box className="mt-4 w-full gap-4 flex flex-col lg:flex-row">
        <Box className="lg:w-2/3 px-3 lg:px-0">
          {/* Video Player Skeleton */}
          <Skeleton height="500px" borderRadius="lg" mb={4} />

          {/* Video Title Skeleton */}
          <SkeletonText noOfLines={2} spacing={4} skeletonHeight={6} mb={3} />

          {/* Video Info Skeleton */}
          <Box className="flex items-center gap-4 mb-4">
            <Skeleton height="40px" width="40px" borderRadius="full" />
            <Box className="flex-1">
              <SkeletonText noOfLines={1} width="150px" mb={1} />
              <SkeletonText noOfLines={1} width="100px" />
            </Box>
            <Skeleton height="40px" width="120px" borderRadius="md" />
          </Box>

          {/* Comments Section Skeleton */}
          <Box className="mt-6">
            <SkeletonText noOfLines={1} width="200px" mb={4} />
            {Array.from({ length: 3 }).map((_, index) => (
              <Box key={index} className="flex gap-3 mb-4">
                <Skeleton height="40px" width="40px" borderRadius="full" />
                <Box className="flex-1">
                  <SkeletonText noOfLines={1} width="120px" mb={2} />
                  <SkeletonText noOfLines={2} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="lg:w-1/3 px-3 lg:px-0">
          {/* Side Suggestions Skeleton */}
          <Box className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Box key={index} className="flex gap-3">
                <Skeleton height="90px" width="160px" borderRadius="md" />
                <Box className="flex-1">
                  <SkeletonText noOfLines={2} mb={2} />
                  <SkeletonText noOfLines={1} width="80px" />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  // Handling video not found case
  if (!data || data.response?.data?.success === false) {
    return (
      <Center h="80vh">
        <VStack spacing={4} textAlign="center">
          <Image
            src={colorMode == "dark" ? test3 : vdonotfound}
            alt="placehodler"
            width={1000}
            className="w-1/2 rounded-3xl"
          />
          <Heading size="lg" color={textColor}>
            Video Not Found
          </Heading>
          <Text color={secondaryTextColor}>
            The video you are looking for does not exist or has been removed.
          </Text>
          <Button colorScheme="blue" onClick={() => router.push("/")}>
            Go Back Home
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Box className="mt-4 w-full flex flex-col lg:flex-row ">
      <Box className="lg:w-2/3 px-3 lg:px-0 ">
        <VideoPlayer data={data} />
        <Comments
          comments={commentsData?.comments}
          videoId={params.id}
          refetch={commentsRefetch}
          isLoading={commentsDataLoading}
        />
      </Box>
      <Box className="lg:w-1/3 px-3 lg:px-0">
        <SideSuggestions videoId={params.id} />
      </Box>
    </Box>
  );
};

export default Watch;
