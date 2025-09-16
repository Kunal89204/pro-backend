"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import Tweet from "@/components/tweet/Tweet";
import Comments from "@/components/tweet/Comments";
import { myQuery } from "@/api/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import UserProfile from "@/components/tweet/UserProfile";
import tweetQueries from "@/api/tweetQueries";
import { AxiosError } from "axios";

const TweetPage = () => {
  const { id } = useParams();
  const token = useSelector((state: RootState) => state.token);


  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["tweet", id],
    queryFn: () => myQuery.getTweetById(token, id as string),
  });

  const addTweetViewMutation = useMutation({
    mutationFn: () => tweetQueries.addTweetView(token, id as string),
    onSuccess: () => {
      console.log("after success: view added");
    },
    onError: (error:AxiosError) => {
      console.log("error", error?.response?.data);
      // console.log()
    },
  });

  useEffect(() => {
    console.log("view added");
    addTweetViewMutation.mutate();
  }, []);

  if (isError) {
    console.log("error:", error);
    return <div>Error: {error.message}</div>;
  }

  console.log("data::::", data?.status);


  if (data?.status === 404) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <span className="text-red-500 text-lg font-semibold">Tweet not found</span>
        <span className="text-gray-400 mt-2">The tweet you are looking for does not exist or has been deleted.</span>
      </div>
    );
  }

  

  return (
    <div className="w-full p-2 flex gap-2">
      <div className="w-full md:w-3/5 ">
        <Tweet data={data?.data?.tweet} isLoading={isLoading} />

        <Comments tweetId={id as string} />
      </div>

      <div className="w-2/5 hidden md:block">
        <UserProfile
          data={data?.data?.tweet?.owner}
          tweetsCount={data?.data?.tweetsCount}
        />
      </div>
    </div>
  );
};

export default TweetPage;
