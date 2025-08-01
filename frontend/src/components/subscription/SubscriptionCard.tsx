import { Channel } from "@/app/subscriptions/page";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  Box,
  Flex,
  Text,
  VStack,
  Avatar,
  useColorModeValue,
  Badge,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/navigation";

const SubscriptionCard = ({ channel }: { channel: Channel["channel"] }) => {
  const { textColor, secondaryTextColor } = useThemeColors();
  const cardBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const router = useRouter();
  return (
    <Box
      bg={cardBg}
      p={4}
      borderRadius="2xl"
      boxShadow="sm"
      transition="all 0.3s ease"
      _hover={{ boxShadow: "md", bg: hoverBg }}
      w="full"
      maxW="420px"
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "whiteAlpha.100")}
    >
      <Flex align="center" gap={4}>
        <Avatar src={channel.avatar} name={channel.fullName} size="xl" onClick={() => router.push(`/profile/${channel.username}`)} className="cursor-pointer" />

        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight="bold" fontSize="lg" color={textColor} onClick={() => router.push(`/profile/${channel.username}`)} className="cursor-pointer">
            {channel.fullName}
          </Text>

          <Text fontSize="sm" color={secondaryTextColor} onClick={() => router.push(`/profile/${channel.username}`)} className="cursor-pointer">
            @{channel.username}
          </Text>

          {channel.bio && (
            <Text fontSize="sm" noOfLines={2} color={secondaryTextColor} onClick={() => router.push(`/profile/${channel.username}`)} className="cursor-pointer">
              {channel.bio}
            </Text>
          )}

          <HStack>
            <Badge colorScheme="purple" borderRadius="md" onClick={() => router.push(`/profile/${channel.username}`)} className="cursor-pointer">
              {channel.subscribersCount} Subscribers
            </Badge>
          </HStack>
        </VStack>
      </Flex>
    </Box>
  );
};

export default SubscriptionCard;
