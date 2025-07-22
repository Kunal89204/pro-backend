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

const TweetPage = () => {
  const { id } = useParams();
  const token = useSelector((state: RootState) => state.token);
  const { data, isLoading } = useQuery({
    queryKey: ["tweet", id],
    queryFn: () => myQuery.getTweetById(token, id as string),
  });

  const addTweetViewMutation = useMutation({
    mutationFn: () => tweetQueries.addTweetView(token, id as string),
    onSuccess: () => {
      console.log("after success: view added");
    },
    onError: () => {
      console.log("error");
    },
  });

  useEffect(() => {
    console.log("view added");
    addTweetViewMutation.mutate();
  }, []);

  return (
    <div className="w-full p-2 flex gap-2">
      <div className="w-3/5 ">
        <Tweet data={data?.data?.tweet} isLoading={isLoading} />

        <Comments tweetId={id as string} />
      </div>

      <div className="w-2/5">
        <UserProfile
          data={data?.data?.tweet?.owner}
          tweetsCount={data?.data?.tweetsCount}
        />
      </div>
    </div>
  );
};

export default TweetPage;
