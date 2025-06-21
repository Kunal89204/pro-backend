"use client";
import React, { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import { myQuery } from "@/api/query";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// Define types

const EmbedVideoPlayer = () => {
  const { videoId } = useParams();
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => myQuery.getVideoByIdForEmbed(videoId as string),
  });

  const vdo = data?.data;

  // Format the date (e.g., "4 Feb 2025")
  const formattedDate = vdo?.createdAt
    ? new Date(vdo.createdAt)
        .toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        .replace(",", "")
    : "";

  // Initialize video player
  useEffect(() => {
    if (!playerRef.current && vdo?.videoFile) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-default-skin");
      videoElement.setAttribute("controls", "");
      videoElement.setAttribute("preload", "auto");
      videoElement.setAttribute("data-setup", "{}");

      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);

        const player = videojs(videoElement, {
          autoplay: false,
          controls: true,
          responsive: true,
          fluid: true,
          fill: true, // Make video fill entire container
          playbackRates: [0.5, 1, 1.25, 1.5, 2],
          sources: [
            {
              src: vdo.videoFile,
              type: "video/mp4",
            },
          ],
        });

        playerRef.current = player;

        player.ready(() => {
          console.log("Video.js player is ready");
        });
      }
    }
  }, [vdo?.videoFile]);

  // Cleanup video player
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  if (isLoading) {
    return (
      <Box className="w-full h-screen flex items-center justify-center bg-black">
        <Text color="white" fontSize="lg">Loading video...</Text>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="w-full h-screen flex items-center justify-center bg-black">
        <Text color="red.400" fontSize="lg">
          Error loading video: {error?.message || "Unknown error"}
        </Text>
      </Box>
    );
  }

  return (
    <Box className="w-full h-screen bg-black relative">
      {/* Full Screen Video Player */}
      <Box className="w-full h-full relative">
        <div ref={videoRef} className="w-full h-full" />
        {/* Video Title Overlay (always visible, on top of video) */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          zIndex={10}
          bgGradient="linear(to-b, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)"
          p={{ base: 3, md: 5 }}
          borderTopRadius="md"
          className="video-title-overlay"
          // Remove pointerEvents: "none" so that the title link is clickable
        >
          <Heading
            as="h1"
            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
            color="white"
            mb={2}
            noOfLines={2}
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
          >
            <a
              href={`https://youtube.kunalkhandelwal.dev/watch/${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                pointerEvents: "auto",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {vdo?.title}
            </a>
          </Heading>
          <Flex gap={4} color="gray.300" fontSize={{ base: "sm", md: "md" }}>
            <Text>{vdo?.owner?.fullName}</Text>
            <Text>•</Text>
            <Text>{formattedDate}</Text>
          </Flex>
        </Box>
      </Box>
      <style jsx>{`
        .video-title-overlay {
          transition: opacity 0.3s;
          opacity: 1;
        }
      `}</style>
    </Box>
  );
};

export default EmbedVideoPlayer;