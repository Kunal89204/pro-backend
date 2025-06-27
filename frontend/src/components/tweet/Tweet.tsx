import {
  Box,
  Divider,
  Flex,

  Text,

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
    views: number;
    likesCount: number;
    comments: number;
    createdAt: string;
    _id: string;
    userId: string;
  };
  isLoading: boolean;
}) => {
  
  const { textColor, secondaryTextColor } = useThemeColors();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("data.image", data.image);
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div>
          <Image
            src={
              "https://res.cloudinary.com/dqvqvvwc8/image/upload/v1749469493/iaa6foq2m5lslbkaruxu.png"
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

      <Text className=" my-3" color={textColor}>
        {data?.content}
      </Text>

      {data?.image && (
        <Box className="w-full min-h-[400px] max-h-[600px] overflow-hidden flex justify-center items-center relative rounded-lg">
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

      <Engagement _id={data._id}  likes={data.likesCount} comments={data.comments} views={data.views} />
    </div>
  );
};

export default Tweet;
