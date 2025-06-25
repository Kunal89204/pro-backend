import {
  Box,
  Divider,
  Flex,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Image from "next/image";
import { IconEye } from "@tabler/icons-react";
import { IconHeart } from "@tabler/icons-react";
import { IconMessageCircle } from "@tabler/icons-react";
import { IconShare } from "@tabler/icons-react";
import React from "react";
import { useThemeColors } from "@/hooks/useThemeColors";

const Tweet = ({
  data,
  isLoading,
  
}: {
  data: {
    content: string;
    image: string;
    views: number;
    likes: number;
    comments: number;
  };
  isLoading: boolean;

}) => {
  const { colorMode } = useColorMode();
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
              4 minutes agao
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

      <Divider my={2} />

      <Flex justifyContent="space-between" mt="auto" className="w-full">
        <Flex alignItems="center">
          <IconButton
            aria-label="Like"
            icon={
              <IconHeart
                size={20}
                color={colorMode == "light" ? "black" : "white"}
              />
            }
            variant="ghost"
            size="sm"
            _hover={{ color: "red.500" }}
          />
          <Text
            fontSize="xs"
            mr={1}
            color={colorMode == "light" ? "black" : "white"}
          >
            123
          </Text>
        </Flex>

        <Flex alignItems="center">
          <IconButton
            aria-label="Comment"
            icon={
              <IconEye
                size={20}
                color={colorMode == "light" ? "black" : "white"}
              />
            }
            variant="ghost"
            size="sm"
            _hover={{ color: "blue.500" }}
          />
          <Text
            fontSize="xs"
            mr={1}
            color={colorMode == "light" ? "black" : "white"}
          >
            {data?.views}
          </Text>
        </Flex>

        <Flex alignItems="center">
          <IconButton
            aria-label="Comment"
            icon={
              <IconMessageCircle
                size={20}
                color={colorMode == "light" ? "black" : "white"}
              />
            }
            variant="ghost"
            size="sm"
            _hover={{ color: "blue.500" }}
          />
          <Text
            fontSize="xs"
            mr={1}
            color={colorMode == "light" ? "black" : "white"}
          >
            123
          </Text>
        </Flex>

        <IconButton
          aria-label="Share"
          icon={
            <IconShare
              size={20}
              color={colorMode == "light" ? "black" : "white"}
            />
          }
          variant="ghost"
          size="sm"
          _hover={{ color: "blue.500" }}
        />
      </Flex>
    </div>
  );
};

export default Tweet;
