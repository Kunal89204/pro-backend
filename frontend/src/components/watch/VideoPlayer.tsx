import { useThemeColors } from "@/hooks/useThemeColors";
import parseTextWithLinks from "@/utils/parseTextWithLinks";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { IoMdThumbsUp } from "react-icons/io";
import { MdOutlineThumbUp } from "react-icons/md";

import { CiShare2 } from "react-icons/ci";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import SaveToPlaylistModal from "../Modals/SaveToPlaylistModal";
import { myQuery } from "@/api/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { CiBookmark } from "react-icons/ci";

// Define types
interface Owner {
  avatar: string;
  fullName: string;
  _id: string;
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
  const token = useSelector((state: RootState) => state.token);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const descriptionLimit = 235; // Character limit before showing "See More"
  const { textColor, secondaryTextColor } = useThemeColors();
  const { isOpen, onClose, onOpen } = useDisclosure();

  // Video js refs
  const videoRef = useRef<HTMLDivElement>(null);
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
    if (!playerRef.current && vdo?.videoFile) {
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

  const likeVideoMutation = useMutation({
    mutationFn: (id: string) => myQuery.likeVideo(token, id),
    onSuccess: () => {
      refetch();
    },
  });

  const subscribeChannelMutation = useMutation({
    mutationFn: (id: string) => myQuery.subscribeChannel(token, id),
    onSuccess: () => {
      subscribeRefetch();
    },
  });

  const {
    data: likeData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["like", vdo?._id],
    queryFn: () => myQuery.likeVideoStatus(token, vdo?._id),
  });

  const {
    data: subscribeData,
    isLoading: subscribeLoading,
    refetch: subscribeRefetch,
  } = useQuery({
    queryKey: ["subscribe", vdo?._id],
    queryFn: () => myQuery.subscribeStatus(token, vdo?.owner?._id),
  });

  useEffect(() => {
    if (subscribeData && !subscribeLoading) {
      console.log("I am here", subscribeData);
    }
  }, [subscribeData, subscribeLoading]);

  useEffect(() => {
    if (likeData) {
      setIsLiked(likeData.liked);
    }
  }, [likeData, isLoading]);

  const handleVideoLike = async (id: string) => {
    setIsLiked(!isLiked);
    likeVideoMutation.mutate(id);
  };

  const handleVideoSave = async (id: string) => {
    console.log("video saved", id);
    onOpen();
  };

  const handleSubscribe = async (id: string) => {
    console.log("subscribed", id);
    subscribeChannelMutation.mutate(id);
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
              {subscribeData?.data?.subscriberCount} subscribers
            </Text>
          </Box>
          <Box mx={4} alignSelf={"end"}>
            <Button
              onClick={() => handleSubscribe(vdo?.owner?._id)}
              borderRadius={"full"}
              position="relative"
              transition="background 0.3s, color 0.3s, box-shadow 0.3s, transform 0.2s"
              colorScheme={subscribeData?.data?.subscribed ? "green" : "red"}
              bg={subscribeData?.data?.subscribed ? "green.400" : undefined}
              color={subscribeData?.data?.subscribed ? "white" : undefined}
              _hover={{
                transform: "scale(1.05)",
                boxShadow: subscribeData?.data?.subscribed
                  ? "0 0 0 4px rgba(72,187,120,0.2)"
                  : "0 0 0 4px rgba(66,153,225,0.2)",
              }}
              _active={{
                transform: "scale(0.98)",
              }}
            >
              {subscribeData?.data?.subscribed ? "Subscribed" : "Subscribe"}
            </Button>
          </Box>
        </Flex>

        <Flex gap={2} alignItems={"center"}>
          <Button
            className="flex gap-2 "
            colorScheme="gray"
            borderRadius={"full"}
            onClick={() => handleVideoLike(vdo?._id)}
            fontWeight={"normal"}
          >
            {isLiked ? (
              <IoMdThumbsUp size={20} />
            ) : (
              <MdOutlineThumbUp size={20} />
            )}{" "}
            {likeData?.likeCount}
          </Button>
          <Button
            borderRadius={"full"}
            className="flex gap-2 rounded-full"
            fontWeight={"normal"}
          >
            <CiShare2 size={20} /> Share
          </Button>
          <Button
            borderRadius={"full"}
            className="flex gap-2 rounded-full"
            onClick={() => handleVideoSave(vdo?._id)}
            fontWeight={"normal"}
          >
            <CiBookmark size={20} /> Save
          </Button>
        </Flex>
      </Flex>

      <Box
        bg={"#202020"}
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
      <SaveToPlaylistModal
        isOpen={isOpen}
        onClose={onClose}
        videoId={vdo?._id}
      />
    </Box>
  );
};

export default VideoPlayer;
