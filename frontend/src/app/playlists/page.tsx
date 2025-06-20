"use client";
import Hero from "@/components/playlists/Hero";
import Playlist from "@/components/playlists/Playlist";
import { Box, Flex, Spinner, Text, useColorMode } from "@chakra-ui/react";
import React from "react";
import usePlaylists from "@/hooks/usePlaylists";
import { useThemeColors } from "@/hooks/useThemeColors";


const Playlists: React.FC = () => {
  // Color schemes

  const { data, isLoading, error, isError } = usePlaylists();

const {colorMode}  = useColorMode()
const {textColor} = useThemeColors()

  if (isLoading) {
    return  <Flex
      className={`w-full h-screen bg-gradient-to-br ${colorMode == "dark"?" via-black to-gray-900":""} `}
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
  }

  if (isError) {
    return <div>Error: {String(error)}</div>;
  }

 

  return (
    <Box>
      <Hero />
      <div className="grid grid-cols-4 gap-1 px-1 ">
        {data?.data?.map(
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
          }) => (
            <Playlist key={playlist._id} data={playlist} />
          )
        )}
      </div>
    </Box>
  );
};

export default Playlists;
