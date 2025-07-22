import {
  Box,
  Divider,
  Flex,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { useThemeColors } from "@/hooks/useThemeColors";
import { formatPostTime } from "@/utils/relativeTime";
import Engagement from "../profile/tweets/Engagement";

const Tweet = ({
  data,
  isLoading,
}: {
  data: {
    content: string;
    image: string;
    viewsCount: number;
    likesCount: number;
    comments: number;
    createdAt: string;
    _id: string;
    userId: string;
    owner: {
      avatar: string;
    };
  };
  isLoading: boolean;
}) => {
  
  const { textColor, secondaryTextColor } = useThemeColors();
  const { colorMode } = useColorMode();

  // Markdown processing function
  const processMarkdown = (text: string) => {
    if (!text) return "";
    
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/`(.*?)`/g, `<code style="background: ${colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>`) // Code
      .replace(/\n/g, '<br>'); // Line breaks
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div>
          <Image
            src={
              data?.owner?.avatar
            }
            className="object-cover rounded-full w-10 aspect-square"
            alt="tweet"
            width={1000}
            height={1000}
          />
        </div>
        <Flex className="flex-col">
          <Flex className="items-center gap-1">
            <Text className="font-bold" color={textColor}>
              Kunal Khandelwal
            </Text>
            <Box className="w-1 h-1 bg-gray-500 rounded-full"></Box>
            <Text className="text-gray-500 text-xs" color={secondaryTextColor}>
              {formatPostTime(data?.createdAt)}
            </Text>
          </Flex>
          <Text className="text-gray-500 text-sm" color={secondaryTextColor}>
            @kunal
          </Text>
        </Flex>
      </div>

      <Box
        className="my-3"
        color={textColor}
        dangerouslySetInnerHTML={{
          __html: processMarkdown(data?.content || "")
        }}
        sx={{
          // Custom styles for markdown elements
          'strong': {
            fontWeight: 'bold',
          },
          'em': {
            fontStyle: 'italic',
          },
          'code': {
            fontSize: '0.9em',
          },
          // Ensure line breaks are preserved
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      />

      {data?.image && (
        <Box className="w-full min-h-[400px] max-h-[600px] overflow-hidden flex justify-center items-center relative rounded-lg -z-0">
          <Box className="absolute inset-0 z-0">
            <Image
              src={data?.image}
              alt="tweet background"
              fill
              className="blur-xl opacity-90 object-cover"
            />
          </Box>
          <Image
            src={data?.image}
            alt="tweet"
            width={1000}
            height={1000}
            className="h-full w-auto z-10 relative object-cover"
          />
        </Box>
      )}

      <Divider my={2} />

      <Engagement _id={data._id}  likes={data.likesCount} comments={data.comments} views={data.viewsCount} />
    </div>
  );
};

export default Tweet;