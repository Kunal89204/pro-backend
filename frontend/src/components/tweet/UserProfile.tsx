import React from "react";
import { Box, Flex, Text, Button, Avatar } from "@chakra-ui/react";
import Image from "next/image";
import { useThemeColors } from "@/hooks/useThemeColors";

const UserProfile = ({
  data,
}: {
  data: {
    fullName: string;
    username: string;
    bio: string;
    coverImage: string;
    avatar: string;
  };
}) => {
  const { textColor, secondaryTextColor } = useThemeColors();

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
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
              245
            </Text>
            <Text color={secondaryTextColor} fontSize="sm">
              Posts
            </Text>
          </Flex>
          <Flex direction="column" alignItems="center">
            <Text fontWeight="bold" color={textColor}>
              15.3K
            </Text>
            <Text color={secondaryTextColor} fontSize="sm">
              Followers
            </Text>
          </Flex>
          <Flex direction="column" alignItems="center">
            <Text fontWeight="bold" color={textColor}>
              843
            </Text>
            <Text color={secondaryTextColor} fontSize="sm">
              Following
            </Text>
          </Flex>
        </Flex>

        <Button colorScheme="gray" size="md" width="full" borderRadius={"full"}>
          Subscribe
        </Button>
      </Flex>
    </Box>
  );
};

export default UserProfile;
