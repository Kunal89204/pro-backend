"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Text,
  VStack,
  HStack,
  Heading,
  Spinner,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface Channel {
  _id: string;
  username: string;
  fullName: string;
  avatar: string;
}

interface Subscription {
  _id: string;
  channel: Channel;
  createdAt: string;
}

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.token);

  const fetchSubscriptions = useCallback(async () => {
    try {
      const response = await axios.get("https://youtube-backend.kunalkhandelwal.dev/api/v1/subscription/subscribed-channels", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // replace with your endpoint
      setSubscriptions(response.data.data);
    } catch (error) {
      console.error("Failed to fetch subscriptions", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const cardBg = useColorModeValue("gray.50", "gray.800");

  return (
    <Box p={6}>
      <Heading size="lg" mb={6} textAlign="center">
        Your Subscriptions
      </Heading>

      {loading ? (
        <Spinner size="xl" thickness="4px" color="purple.400" />
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {subscriptions.map((sub) => (
            <Box
              key={sub._id}
              p={5}
              bg={cardBg}
              borderRadius="2xl"
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: "xl", transform: "scale(1.02)" }}
            >
              <HStack spacing={4}>
                <Avatar
                  name={sub.channel.fullName}
                  src={sub.channel.avatar}
                  size="lg"
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{sub.channel.fullName}</Text>
                  <Text fontSize="sm" color="gray.500">
                    @{sub.channel.username}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Subscriptions;
