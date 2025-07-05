"use client";
import { myQuery } from "@/api/query";
import SubscriptionCard from "@/components/subscription/SubscriptionCard";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RootState } from "@/lib/store";
import { 
  Box, 
  SimpleGrid, 
  Text, 
  Skeleton, 
  VStack, 
  Center, 
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription,
  Button
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSelector } from "react-redux";

export interface Channel {
  _id: string;
  channel: {
    _id: string;
    bio: string;
    avatar: string;
    fullName: string;
    username: string;
    subscribersCount: number;
  };
}

const Subscriptions = () => {
  const token = useSelector((state: RootState) => state.token);
  const { textColor, secondaryTextColor } = useThemeColors();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["subscribed-channels"],
    queryFn: () => myQuery.subscribedChannels(token),
  });

  console.log(data?.data);

  if (isLoading) {
    return (
      <Box p={6}>
        <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={6}>
          Subscriptions
        </Text>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Box
              key={index}
              p={4}
              borderRadius="2xl"
              border="1px solid"
              borderColor="gray.800"
            >
              <VStack align="start" spacing={3}>
                <Skeleton height="80px" width="80px" borderRadius="full" />
                <VStack align="start" spacing={2} w="full">
                  <Skeleton height="20px" width="70%" />
                  <Skeleton height="16px" width="50%" />
                  <Skeleton height="14px" width="80%" />
                  <Skeleton height="20px" width="40%" />
                </VStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={6}>
        <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={6}>
          Subscriptions
        </Text>
        <Center>
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            borderRadius="lg"
            maxW="md"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Failed to load subscriptions
            </AlertTitle>
            <AlertDescription maxWidth="sm" color={secondaryTextColor}>
              {error?.message || "Something went wrong while fetching your subscriptions."}
            </AlertDescription>
            <Button mt={4} colorScheme="red" onClick={() => refetch()}>
              Try Again
            </Button>
          </Alert>
        </Center>
      </Box>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <Box p={6}>
        <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={6}>
          Subscriptions
        </Text>
        <Center>
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            borderRadius="lg"
            maxW="md"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              No subscriptions yet
            </AlertTitle>
            <AlertDescription maxWidth="sm" color={secondaryTextColor}>
              You haven't subscribed to any channels yet. Start exploring and subscribe to channels you like!
            </AlertDescription>
          </Alert>
        </Center>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={6}>
        Subscriptions ({data.data.length})
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {data.data.map((channel: Channel) => (
          <SubscriptionCard key={channel._id} channel={channel?.channel} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Subscriptions;
