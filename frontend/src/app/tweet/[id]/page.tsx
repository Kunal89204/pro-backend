"use client";

import { useParams } from "next/navigation";
import React from "react";
import Tweet from "@/components/tweet/Tweet";
import Comments from "@/components/tweet/Comments";
import { myQuery } from "@/api/query";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import UserProfile from "@/components/tweet/UserProfile";

const TweetPage = () => {
  const { id } = useParams();
  const token = useSelector((state: RootState) => state.token);
  const { data, isLoading } = useQuery({
    queryKey: ["tweet", id],
    queryFn: () => myQuery.getTweetById(token, id as string),
  });



  return (
    <div className="w-full p-2 flex gap-2">
      <div className="w-3/5 ">
        <Tweet 
          data={data?.data} 
          isLoading={isLoading} 
          
        />
        
        <Comments tweetId={id as string} />
      </div>

      <div className="w-2/5">
        <UserProfile data={data?.data?.owner} />
      </div>
    </div>
  );
};

export default TweetPage;
