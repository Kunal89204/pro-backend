import Tweet from "./Tweet";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { myQuery } from "@/api/query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

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

  const {
    data: tweets,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tweets"],
    queryFn: () => myQuery.getTweetsOfUser(token, username as string),
  });

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-1">
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
    <div className="grid grid-cols-4 gap-2">
      {tweets?.data?.map((tweet: TweetType) => (
        <Tweet key={tweet._id} tweet={tweet} username={username} userId={userId} />
      ))}
    </div>
  );
};

export default Tweets;
