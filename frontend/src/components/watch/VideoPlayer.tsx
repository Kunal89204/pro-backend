import { useThemeColors } from "@/hooks/useThemeColors";
import parseTextWithLinks from "@/utils/parseTextWithLinks";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { IconBookmark, IconShare, IconThumbUp } from "@tabler/icons-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// Define types
interface Owner {
  avatar: string;
  fullName: string;
}

interface VideoData {
  videoFile: string;
  title: string;
  description: string;
  owner: Owner;
  createdAt: string;
  views: number;
  _id: string;
}

interface ApiResponse {
  data: VideoData;
}

interface VideoPlayerProps {
  data: ApiResponse;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ data }) => {
  const vdo = data?.data;
  const [showFullDesc, setShowFullDesc] = useState(false);
  const descriptionLimit = 235; // Character limit before showing "See More"
  const { textColor, secondaryTextColor, secondaryBgColor } = useThemeColors();

  // Video.js refs
  const videoRef = useRef<HTMLDivElement>(null);
  // Video.js player ref - using ReturnType to get the correct type
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);

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

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && vdo?.videoFile) {
      // The Video.js player needs to be attached to an element
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-default-skin");
      videoElement.setAttribute("controls", "");
      videoElement.setAttribute("preload", "auto");
      videoElement.setAttribute("data-setup", "{}");

      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);

        const player = videojs(videoElement, {
          autoplay: true,
          controls: true,
          responsive: true,
          fluid: true,
          aspectRatio: "16:9",
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

  // Dispose of the Video.js player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const handleVideoLike = async (id: string) => {
    console.log("video liked", id);
  };

  const handleVideoSave = async (id: string) => {
    console.log("video saved", id);
  };

  const handleSubscribe = async (id: string) => {
    console.log("subscribed", id);
  };

  return (
    <Box className="w-full">
      <Box className="aspect-video w-full rounded-xl overflow-hidden">
        <div ref={videoRef} />
      </Box>

      <Heading as={"h2"} fontSize={"2xl"} py={1} color={textColor}>
        {vdo?.title}
      </Heading>

      <Flex
        justifyContent={"space-between"}
        flexDir={{ base: "column", lg: "row" }}
        alignItems={{ base: "stretch", lg: "center" }}
      >
        <Flex gap={2} py={3} alignItems={"center"}>
          <Image
            src={vdo?.owner?.avatar}
            alt="Owner Avatar"
            width={1000}
            height={1000}
            className="w-10 lg:w-12 aspect-square object-cover rounded-full"
          />
          <Box>
            <Text color={textColor} fontWeight={"semibold"} noOfLines={1}>
              {vdo?.owner?.fullName}
            </Text>
            <Text color={secondaryTextColor} fontSize={"xs"} fontWeight={"600"}>
              100 subscribers
            </Text>
          </Box>
          <Box mx={4} alignSelf={"end"}>
            <Button onClick={() => handleSubscribe(vdo?._id)}>Subscribe</Button>
          </Box>
        </Flex>

        <Flex gap={2}>
          <Button
            className="flex gap-2"
            colorScheme="gray"
            onClick={() => handleVideoLike(vdo?._id)}
          >
            <IconThumbUp /> Like
          </Button>
          <Button className="flex gap-2">
            <IconShare /> Share
          </Button>
          <Button onClick={() => handleVideoSave(vdo?._id)}>
            <IconBookmark /> Save
          </Button>
        </Flex>
      </Flex>

      <Box
        bg={secondaryBgColor}
        borderRadius={"10px"}
        my={2}
        p={2}
        position={"relative"}
      >
        <Flex color={textColor} gap={2} fontSize={"sm"} fontWeight={"semibold"}>
          <Text>{vdo?.views} Views</Text>
          <Text>{formattedDate}</Text>
        </Flex>
        <Text fontWeight={"semibold"} color={textColor}>
          Description
        </Text>
        <Text color={secondaryTextColor} position="relative">
          {showFullDesc
            ? parseTextWithLinks(vdo?.description || "")
            : parseTextWithLinks(
                (vdo?.description || "").slice(0, descriptionLimit)
              )}
          {vdo?.description?.length > descriptionLimit && (
            <Button
              variant="link"
              position="absolute"
              right={10}
              bottom={2}
              color={textColor}
              fontWeight="semibold"
              onClick={() => setShowFullDesc(!showFullDesc)}
            >
              {showFullDesc ? " See Less" : " See More"}
            </Button>
          )}
        </Text>
      </Box>
    </Box>
  );
};

export default VideoPlayer;
