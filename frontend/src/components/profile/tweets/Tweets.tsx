import Tweet from "./Tweet";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { myQuery } from "@/api/query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Skeleton, SkeletonCircle, SkeletonText, Box, VStack, Text, Icon } from "@chakra-ui/react";
import { IconMessageOff } from "@tabler/icons-react";
import { useThemeColors } from "@/hooks/useThemeColors";

type TweetType = {
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  content: string;
  image: string;
  _id: string;
};

const Tweets = ({username, userId}: {username: string | undefined, userId: string | undefined}) => {
  const token = useSelector((state: RootState) => state.token);
  const { textColor, secondaryTextColor } = useThemeColors();

  const {
    data: tweets,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tweets"],
    queryFn: () => myQuery.getTweetsOfUser(token, username as string),
  });

  const NoTweetsComponent = () => (
    <Box className="flex flex-col items-center justify-center py-16 px-4">
      <VStack spacing={4} textAlign="center">
        <Box
          p={6}
          borderRadius="full"
          bg="gray.50"
          _dark={{ bg: "gray.800" }}
        >
          <Icon as={IconMessageOff} boxSize={12} color="gray.400" />
        </Box>
        <Text fontSize="xl" fontWeight="semibold" color={textColor}>
          No tweets yet
        </Text>
        <Text color={secondaryTextColor} maxW="md">
          This user hasn&apos;t posted any tweets yet. Check back later for new content!
        </Text>
      </VStack>
    </Box>
  );

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <div className="flex items-center gap-2">
              <SkeletonCircle aspectRatio={1} size="10" />
              <SkeletonText
                key={index}
                className="w-full h-4 my-8 "
                noOfLines={2}
              />
            </div>
            <Skeleton key={index} className="w-full h-64" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      {tweets?.data?.length > 0 ? tweets?.data?.map((tweet: TweetType) => (
        <Tweet key={tweet._id} tweet={tweet}  userId={userId} />
      )) : <div className="col-span-full"><NoTweetsComponent /></div>}
    </div>
  );
};

export default Tweets;
