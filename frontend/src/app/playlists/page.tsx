"use client";
import Hero from "@/components/playlists/Hero";
import Playlist from "@/components/playlists/Playlist";
import { Box } from "@chakra-ui/react";
import React from "react";
import usePlaylists from "@/hooks/usePlaylists";

const Playlists: React.FC = () => {
  // Color schemes

  const { data, isLoading, error, isError } = usePlaylists();

  if (isLoading) {
    return <div>Loading...</div>;
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
