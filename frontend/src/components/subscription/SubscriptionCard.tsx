import { Channel } from "@/app/subscriptions/page";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

const SubscriptionCard = ({ channel }: { channel: Channel["channel"] }) => {
  return (
    <Box>
      <Flex>
        <Image
          src={channel.avatar}
          alt="channel-logo"
          className="rounded-full aspect-square w-20 h-20 object-cover"
          width={200}
          height={200}
        />
        <VStack>
          <Text>{channel.fullName}</Text>
          <Text>{channel.username}</Text>
          <Text>{channel.bio}</Text>
        </VStack>
      </Flex>
    </Box>
  );
};

export default SubscriptionCard;
