"use client";
import Hero from "@/components/playlists/Hero";
import Playlist from "@/components/playlists/Playlist";
import { Box, Flex, Spinner, Text, useColorMode, VStack, Icon } from "@chakra-ui/react";
import React from "react";
import usePlaylists from "@/hooks/usePlaylists";
import { useThemeColors } from "@/hooks/useThemeColors";
import { IconPlaylist } from "@tabler/icons-react";

const Playlists: React.FC = () => {
  // Color schemes

  const { data, isLoading, error, isError } = usePlaylists();

  const { colorMode } = useColorMode();
  const { textColor, secondaryTextColor } = useThemeColors();

  if (isLoading) {
    return (
      <Flex
        className={`w-full h-screen bg-gradient-to-br ${
          colorMode == "dark" ? " via-black to-gray-900" : ""
        } `}
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
      >
        {/* Glowing Blurred Circle Background */}
        <Box
          className="absolute w-[300px] h-[300px] bg-purple-500/30 rounded-full blur-3xl animate-pulse"
          style={{ top: "20%", left: "40%" }}
        />
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          zIndex="10"
        >
          <Spinner
            thickness="3px"
            speed="0.7s"
            emptyColor="gray.700"
            color="gray.400"
            size="xl"
          />
          <Text
            mt={4}
            fontSize="lg"
            color={textColor}
            letterSpacing="wide"
            fontWeight="semibold"
          >
            Loading your playlists
          </Text>
        </Flex>
      </Flex>
    );
  }

  if (isError) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <Box>
      <Hero />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 px-1 ">
        {data?.data?.length > 0 ? (
          data?.data?.map(
            (playlist: {
              _id: string;
              name: string;
              isPublic: boolean;
              videos: {
                _id: string;
                thumbnail: string;
                title: string;
                description: string;
                duration: number;
                views: number;
                owner: { _id: string; username: string; avatar: string }[];
              }[];
              owner: { _id: string; username: string; avatar: string }[];
            }) => <Playlist key={playlist._id} data={playlist} />
          )
        ) : (
          <Box
            gridColumn="1 / -1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
            position="relative"
          >
            {/* Subtle background gradient */}
            <Box
              className="absolute w-[200px] h-[200px] opacity-10 rounded-full blur-2xl"
              bg="purple.500"
              style={{ top: "30%", left: "45%" }}
            />
            
            <VStack spacing={6} textAlign="center" zIndex="10">
              <Box
                p={6}
                borderRadius="full"
                bg={colorMode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                border="1px solid"
                borderColor={colorMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              >
                <Icon
                  as={IconPlaylist}
                  boxSize={12}
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                />
              </Box>
              
              <VStack spacing={2}>
                <Text
                  fontSize="2xl"
                  fontWeight="semibold"
                  color={textColor}
                  letterSpacing="tight"
                >
                  No playlists yet
                </Text>
                <Text
                  fontSize="md"
                  color={secondaryTextColor}
                  maxW="400px"
                  lineHeight="relaxed"
                >
                  Start creating your first playlist to organize your favorite videos
                </Text>
              </VStack>
            </VStack>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default Playlists;
