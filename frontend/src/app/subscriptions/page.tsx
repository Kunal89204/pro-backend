"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Text,
  Flex,
  Heading,

  Grid,
  useColorModeValue,
  Container,
  Badge,

  VStack,
  HStack,
  Skeleton,
  SkeletonCircle,
  useBreakpointValue,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { FiUsers, FiCalendar, FiSearch } from "react-icons/fi";
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

const SubscriptionSkeleton = () => (
  <Box
    p={6}
    bg={useColorModeValue("white", "gray.800")}
    borderRadius="xl"
    borderWidth="1px"
    borderColor={useColorModeValue("gray.100", "gray.700")}
    shadow="sm"
  >
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
        <SkeletonCircle size="16" />
        <VStack align="start" spacing={2} flex={1}>
          <Skeleton height="4" width="70%" />
          <Skeleton height="3" width="50%" />
        </VStack>
      </HStack>
      <Divider />
      <HStack justify="space-between">
        <Skeleton height="3" width="40%" />
        <Skeleton height="6" width="20%" />
      </HStack>
    </VStack>
  </Box>
);

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

  const bgGradient = useColorModeValue(
    "linear(to-br, gray.50, blue.50)",
    "linear(to-br, gray.900, blue.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.100", "gray.700");
  const cardShadow = useColorModeValue("sm", "dark-lg");
  const textColor = useColorModeValue("gray.800", "white");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const headerGradient = useColorModeValue(
    "linear(to-r, blue.600, purple.600)",
    "linear(to-r, blue.300, purple.300)"
  );

  const columns = useBreakpointValue({ 
    base: 1, 
    sm: 2, 
    md: 3, 
    lg: 4,
    xl: 5
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="container.2xl" py={8}>
        {/* Header Section */}
        <Box mb={8}>
          <Flex align="center" gap={4} mb={6}>
            <Box
              p={3}
              bg={cardBg}
              borderRadius="xl"
              shadow={cardShadow}
              borderWidth="1px"
              borderColor={cardBorder}
            >
              <Icon as={FiUsers} boxSize={6} color={accentColor} />
            </Box>
            <VStack align="start" spacing={1}>
              <Heading 
                size="xl" 
                fontWeight="bold"
                bgGradient={headerGradient}
                bgClip="text"
                letterSpacing="tight"
              >
                My Subscriptions
              </Heading>
              <Text color={subtextColor} fontSize="md">
                {loading ? "Loading..." : `${subscriptions.length} channels subscribed`}
              </Text>
            </VStack>
          </Flex>
        </Box>

        {/* Content Section */}
        {loading ? (
          <Grid 
            templateColumns={`repeat(${columns}, 1fr)`}
            gap={6}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <SubscriptionSkeleton key={index} />
            ))}
          </Grid>
        ) : subscriptions.length === 0 ? (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            h="60vh"
            textAlign="center"
          >
            <Box
              p={8}
              bg={cardBg}
              borderRadius="2xl"
              shadow={cardShadow}
              borderWidth="1px"
              borderColor={cardBorder}
              maxW="md"
            >
              <Icon as={FiSearch} boxSize={12} color={subtextColor} mb={4} />
              <Heading size="md" color={textColor} mb={2}>
                No Subscriptions Yet
              </Heading>
              <Text color={subtextColor} fontSize="sm">
                Start exploring and subscribe to channels you love to see them here.
              </Text>
            </Box>
          </Flex>
        ) : (
          <Grid 
            templateColumns={`repeat(${columns}, 1fr)`}
            gap={6}
          >
            {subscriptions.map((sub) => (
              <Box
                key={sub._id}
                p={6}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={cardBorder}
                shadow={cardShadow}
                transition="all 0.3s ease"
                cursor="pointer"
                _hover={{ 
                  transform: "translateY(-4px)",
                  // shadow: useColorModeValue("lg", "dark-lg"),
                  borderColor: accentColor,
                }}
                _active={{
                  transform: "translateY(-2px)",
                }}
                position="relative"
                overflow="hidden"
              >
                {/* Subtle gradient overlay */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  height="2px"
                  bgGradient="linear(to-r, blue.400, purple.400)"
                />
                
                <VStack spacing={4} align="stretch">
                  {/* Channel Info */}
                  <HStack spacing={4}>
                    <Avatar
                      name={sub.channel.fullName}
                      src={sub.channel.avatar}
                      size="lg"
                      ring={2}
                      // ringColor={useColorModeValue("gray.200", "gray.600")}
                      transition="all 0.2s"
                      _hover={{
                        ringColor: accentColor,
                        transform: "scale(1.05)"
                      }}
                    />
                    <VStack align="start" spacing={1} flex={1} minW={0}>
                      <Text 
                        fontWeight="semibold" 
                        fontSize="md" 
                        color={textColor}
                        noOfLines={2}
                        lineHeight="shorter"
                      >
                        {sub.channel.fullName}
                      </Text>
                      <Text 
                        fontSize="sm" 
                        color={subtextColor}
                        noOfLines={1}
                      >
                        @{sub.channel.username}
                      </Text>
                    </VStack>
                  </HStack>

                  <Divider />

                  {/* Subscription Details */}
                  <HStack justify="space-between" align="center">
                    <HStack spacing={2}>
                      <Icon as={FiCalendar} boxSize={3} color={subtextColor} />
                      <Text fontSize="xs" color={subtextColor}>
                        {formatDate(sub.createdAt)}
                      </Text>
                    </HStack>
                    <Badge
                      colorScheme="blue"
                      variant="subtle"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      Subscribed
                    </Badge>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Subscriptions;