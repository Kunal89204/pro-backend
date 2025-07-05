"use client";
import { myQuery } from "@/api/query";
import SubscriptionCard from "@/components/subscription/SubscriptionCard";
import { RootState } from "@/lib/store";
import { Box, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSelector } from "react-redux";

export interface Channel {
  _id:string,
  channel: {
      _id:string,
      bio:string, 
      avatar:string,
      fullName:string,
      username:string,
    }
}

const Subscriptions = () => {
  const token = useSelector((state: RootState) => state.token);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subscribed-channels"],
    queryFn: () => myQuery.subscribedChannels(token),
  });

  console.log(data?.data);

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold">
        Subscriptions
      </Text>

      {data?.data.map((channel:Channel) => (
        <SubscriptionCard key={channel._id} channel={channel?.channel} />
      ))}
    </Box>
  );
};

export default Subscriptions;
