import React from 'react'
import { Box, Flex, Text, Button, Divider, Avatar } from "@chakra-ui/react"
import Image from "next/image"
import { useThemeColors } from "@/hooks/useThemeColors"

const UserProfile = () => {
  const { textColor, secondaryTextColor } = useThemeColors()

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} maxWidth={"60%"} mx={"auto"} position={"sticky"} top={100}>
      {/* Cover Image */}
      <Box position="relative" height="100px" mb={12}>
        <Image 
          src="http://localhost:3000/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdqvqvvwc8%2Fimage%2Fupload%2Fv1749469542%2Fllcowjyi6w8rfgdg5rps.png&w=2048&q=75"
          alt="Cover photo"
          fill
          className="object-cover"
        />
        {/* Profile Image */}
        <Avatar
          size="xl"
          src="https://res.cloudinary.com/dqvqvvwc8/image/upload/v1749469493/iaa6foq2m5lslbkaruxu.png"
          position="absolute"
          bottom="-40px"
          left="50%"
          transform="translateX(-50%)"
          border="4px solid white"
        />
      </Box>

      {/* User Info */}
      <Flex direction="column" alignItems="center" mb={4}>
        <Text fontWeight="bold" fontSize="xl" color={textColor}>Kunal Khandelwal</Text>
        <Text color={secondaryTextColor} mb={2}>@kunal</Text>
        <Text color={textColor} textAlign="center" mb={3}>
          Full-stack developer passionate about creating amazing web experiences
        </Text>
        
        <Flex gap={4} mb={3}>
          <Flex direction="column" alignItems="center">
            <Text fontWeight="bold" color={textColor}>245</Text>
            <Text color={secondaryTextColor} fontSize="sm">Posts</Text>
          </Flex>
          <Flex direction="column" alignItems="center">
            <Text fontWeight="bold" color={textColor}>15.3K</Text>
            <Text color={secondaryTextColor} fontSize="sm">Followers</Text>
          </Flex>
          <Flex direction="column" alignItems="center">
            <Text fontWeight="bold" color={textColor}>843</Text>
            <Text color={secondaryTextColor} fontSize="sm">Following</Text>
          </Flex>
        </Flex>

        <Button colorScheme="blue" size="sm" width="full">
          Subscribe
        </Button>
      </Flex>

      <Divider my={3} />

      {/* Additional Info */}
      <Box>
        <Text fontWeight="bold" mb={2} color={textColor}>About</Text>
        <Flex alignItems="center" mb={2}>
          <Text fontSize="sm" color={secondaryTextColor}>📍 San Francisco, CA</Text>
        </Flex>
        <Flex alignItems="center" mb={2}>
          <Text fontSize="sm" color={secondaryTextColor}>🔗 github.com/kunalkhandelwal</Text>
        </Flex>
        <Flex alignItems="center">
          <Text fontSize="sm" color={secondaryTextColor}>📅 Joined January 2020</Text>
        </Flex>
      </Box>
    </Box>
  )
}

export default UserProfile
