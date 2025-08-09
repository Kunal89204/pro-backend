import { myQuery } from "@/api/query";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import React from "react";
import { RootState } from "@/lib/store";

import Tweet from "@/components/Tweet";
import {
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { IconBookmarkOff, IconAlertCircle } from "@tabler/icons-react";

const Bookmarks = () => {
  const token = useSelector((state: RootState) => state.token);

  const { data, isLoading, error } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => myQuery.getBookMarkedTweets(token),
  });

  if (error) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        p={10}
        borderRadius="lg"
        borderStyle="dashed"
        minHeight="300px"
      >
        <IconAlertCircle size={64} color="#E53E3E" strokeWidth={1.5} />
        <Text fontSize="2xl" fontWeight="bold" mt={4} color="red.500">
          Error Loading Bookmarks
        </Text>
        <Text color="gray.500" textAlign="center" mt={2}>
          There was a problem loading your bookmarks. Please try again later.
        </Text>
      </Flex>
    );
  }


  if (isLoading) {
    return (
      <div>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Bookmarks
        </Text>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" p={4} mb={2}>
              <div className="flex items-center gap-2 mb-3">
                <SkeletonCircle size="10" />
                <div>
                  <SkeletonText noOfLines={1} width="120px" />
                  <SkeletonText noOfLines={1} width="80px" mt={1} />
                </div>
              </div>
              <SkeletonText noOfLines={2} mb={3} />
              <Skeleton height="150px" mb={3} borderRadius="md" />
              <div className="flex justify-between">
                <SkeletonText noOfLines={1} width="20px" />
                <SkeletonText noOfLines={1} width="20px" />
                <SkeletonText noOfLines={1} width="20px" />
              </div>
            </Box>
          ))}
        </div>
      </div>
    );
  }

  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      {data?.data?.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          p={10}
          // borderWidth="1px"
          borderRadius="lg"
          borderStyle="dashed"
          gridColumn="span 4"
          minHeight="300px"
        >
          <IconBookmarkOff size={64} color="#718096" strokeWidth={1.5} />
          <Text fontSize="2xl" fontWeight="bold" mt={4} color="gray.500">
            No Bookmarks Found
          </Text>
          <Text color="gray.400" textAlign="center" mt={2}>
            Save tweets for later by clicking the bookmark icon on any tweet
          </Text>
        </Flex>
      ) : (
        data?.data.map(
          (item: {
            _id: string;
            tweet: {
              _id: string;
              owner: {
                fullName: string;
                username: string;
                avatar: string;
                _id: string;
              };
              content: string;
              image: string;
              createdAt: string;
              likesCount: number;
              comments: number;
              viewsCount: number;
            };
          }) => (
            <Tweet
              key={item._id}
              id={item.tweet._id}
              author={{
                name: item.tweet.owner.fullName,
                username: item.tweet.owner.username,
                avatar: item.tweet.owner.avatar,
                _id: item.tweet.owner._id,
              }}
              content={item.tweet.content}
              image={item.tweet.image}
              timestamp={item.tweet.createdAt}
              likesCount={item.tweet.likesCount}
              comments={item.tweet.comments}
              viewsCount={item.tweet.viewsCount}
            />
          )
        )
      )}
    </div>
  );
};

export default Bookmarks;
