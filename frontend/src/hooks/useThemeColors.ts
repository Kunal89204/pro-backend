import { useColorModeValue } from "@chakra-ui/react";

export const useThemeColors = () => {
  return {
    bgColor: useColorModeValue("primary.base.light", "primary.base.dark"),
    borderColor: useColorModeValue("gray.300", "gray.700"),
    inputBg: useColorModeValue("primary.base.light", "primary.base.dark"),
    inputTextColor: useColorModeValue("gray.900", "white"),
    buttonBg: useColorModeValue("gray.100", "#383838"),
    hoverBg: useColorModeValue("secondary.hover.bg.light", "#303030"),
textColor:useColorModeValue("primary.text.light", "primary.text.dark"),
    secondaryTextColor:useColorModeValue("secondary.text.light", "secondary.text.dark"),
    secondaryBgColor:useColorModeValue("secondary.base.light", "secondary.base.dark")
  };
};
