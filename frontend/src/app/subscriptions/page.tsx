"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Text,
  Flex,
  Heading,
  Spinner,
  Grid,
  useColorModeValue,
  Container,

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
      });
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

  const cardBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Container maxW="container.xl" py={8}>
      <Heading 
        size="md" 
        mb={6} 
        fontWeight="medium"
        letterSpacing="tight"
      >
        Subscriptions
      </Heading>

      {loading ? (
        <Flex justify="center" align="center" h="50vh">
          <Spinner size="md" color="blue.500" />
        </Flex>
      ) : (
        <Grid 
          templateColumns={{ 
            base: "repeat(1, 1fr)", 
            sm: "repeat(2, 1fr)", 
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)" 
          }} 
          gap={4}
        >
          {subscriptions.map((sub) => (
            <Box
              key={sub._id}
              p={4}
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              transition="all 0.2s"
              _hover={{ 
                transform: "translateY(-2px)",
                shadow: "sm" 
              }}
            >
              <Flex align="center" gap={3}>
                <Avatar
                  name={sub.channel.fullName}
                  src={sub.channel.avatar}
                  size="md"
                />
                <Box>
                  <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                    {sub.channel.fullName}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={0.5}>
                    @{sub.channel.username}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </Grid>
      )}
      
      {!loading && subscriptions.length === 0 && (
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          h="50vh"
          color="gray.500"
        >
          <Text>No subscriptions yet</Text>
        </Flex>
      )}
    </Container>
  );
};

export default Subscriptions;
