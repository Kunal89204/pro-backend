import { useThemeColors } from "@/hooks/useThemeColors";
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
  const playerRef = useRef<null | videojs.Player>(null);

  // Format the date (e.g., "4 Feb 2025")
  const formattedDate = new Date(vdo.createdAt).toLocaleDateString();

  return (
    <div>Video Player</div>
  );
};

export default VideoPlayer; 