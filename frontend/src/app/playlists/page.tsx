"use client";
import Hero from "@/components/playlists/Hero";
import Playlist from "@/components/playlists/Playlist";
import { Box } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { myQuery } from "@/api/query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const Playlists: React.FC = () => {
  // Color schemes
  const { token } = useSelector((state: RootState) => state);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["playlists"],
    queryFn: () => myQuery.getPlaylists(token),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {String(error)}</div>;
  }

  console.log("i am playlists", data);

  return (
    <Box>
      <Hero />
      <div className="grid grid-cols-4 ">
        {data?.data?.map((playlist: {_id: string, title: string, videos: {_id: string, thumbnail: string, title: string, description: string, duration: number, views: number, owner: {_id: string, username: string, avatar: string}[]}[], owner: {_id: string, username: string, avatar: string}[]}) => (
          <Playlist key={playlist._id} data={playlist} />
        ))}
      </div>
    </Box>
  );
};

export default Playlists;
