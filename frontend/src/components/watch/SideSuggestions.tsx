import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import Suggestions from "./Suggestions";
import { useThemeColors } from "@/hooks/useThemeColors";

const SideSuggestions = () => {
  const {  textColor } = useThemeColors();

  const fakeArray = Array.from({ length: 10 });
  return (
    <Box className=" p-2 rounded-lg">
      <Heading size="md" color={textColor}>
        Related Videos
      </Heading>

      <Flex flexDirection={"column"} gap={0} className="relative">
        {fakeArray.map((item, index) => (
          <Suggestions key={index} />
        ))}
      </Flex>
    </Box>
  );
};

export default SideSuggestions;
