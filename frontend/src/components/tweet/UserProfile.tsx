import React from "react";
import { Box, Flex, Text, Button, Avatar } from "@chakra-ui/react";
import Image from "next/image";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useRouter } from "next/navigation";

const UserProfile = ({
  data,
  tweetsCount,
}: {
  data: {
    fullName: string;
    username: string;
    bio: string;
    coverImage: string;
    avatar: string;
    subscribersCount: number;
    tweetsCount: number;
  };
  tweetsCount: number;
}) => {
  const { textColor, secondaryTextColor, bgColor } = useThemeColors();
  const router = useRouter();
  return (
    <Box
      // borderWidth="1px"
      borderRadius="lg"
      bg={bgColor}
      overflow="hidden"
      p={4}
      maxWidth={"60%"}
      mx={"auto"}
      position={"sticky"}
      top={100}
    >
      {/* Cover Image */}
      <Box position="relative" height="100px" mb={12}>
        <Image
          src={data?.coverImage}
          alt="Cover photo"
          fill
          className="object-cover rounded-xl"
        />
        {/* Profile Image */}
        <Avatar
          size="xl"
          src={data?.avatar}
          position="absolute"
          bottom="-40px"
          left="50%"
          transform="translateX(-50%)"
          border="2px solid rgb(100,0,0)"
        />
      </Box>

      {/* User Info */}
      <Flex direction="column" alignItems="center" mb={4}>
        <Text fontWeight="bold" fontSize="xl" color={textColor}>
          {data?.fullName}
        </Text>
        <Text color={secondaryTextColor} mb={2}>
          @{data?.username}
        </Text>
        <Text color={textColor} textAlign="center" mb={3}>
          {data?.bio}
        </Text>

        <Flex gap={4} mb={3}>
          <Flex direction="column" alignItems="center">
            <Text fontWeight="bold" color={textColor}>
              {tweetsCount}
            </Text>
            <Text color={secondaryTextColor} fontSize="sm">
              Tweets
            </Text>
          </Flex>
          <Flex direction="column" alignItems="center">
            <Text fontWeight="bold" color={textColor}>
              {data?.subscribersCount}
            </Text>
            <Text color={secondaryTextColor} fontSize="sm">
              Subscribers
            </Text>
          </Flex>
        </Flex>

        <Button onClick={() => router.push(`/profile/${data?.username}`)} colorScheme="gray" size="md" width="full" borderRadius={"full"}>
          Go to Profile
        </Button>
      </Flex>
    </Box>
  );
};

export default UserProfile;
