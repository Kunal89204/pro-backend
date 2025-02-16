import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Define the theme config
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// Define the colors for light and dark modes
const colors = {
  primary: {
    base: {
      light: "#ffffff", // Primary background for light mode
      dark: "#121212", // Primary background for dark mode
    },
    text: {
      light: "#1A202C", // Text color for light mode
      dark: "white", // Text color for dark mode
    },
    hover: {
      bg: {
        light: "#E2E8F0", // Hover background for light mode
        dark: "#2D3748", // Hover background for dark mode
      },
      text: {
        light: "#2D3748", // Hover text color for light mode
        dark: "#A0AEC0", // Hover text color for dark mode
      },
    },
  },
  secondary: {
    base: {
      light: "#f0f1f2", // Secondary background for light mode
      dark: "#1A202C", // Secondary background for dark mode
    },
    text: {
      light: "#2D3748", // Secondary text color for light mode
      dark: "#CBD5E0", // Secondary text color for dark mode
    },
    hover: {
      bg: {
        light: "#CBD5E0", // Hover background for light mode
        dark: "#4A5568", // Hover background for dark mode
      },
      text: {
        light: "#1A202C", // Hover text color for light mode
        dark: "#E2E8F0", // Hover text color for dark mode
      },
    },
  },
  accent: {
    base: {
      light: "#3182CE", // Accent color for light mode
      dark: "#63B3ED", // Accent color for dark mode
    },
    hover: {
      bg: {
        light: "#2B6CB0", // Hover accent background for light mode
        dark: "#4299E1", // Hover accent background for dark mode
      },
      text: {
        light: "#E2E8F0", // Hover accent text color for light mode
        dark: "#F7FAFC", // Hover accent text color for dark mode
      },
    },
  },
  gray: {
    50: "#F7FAFC",
    100: "#EDF2F7",
    200: "#E2E8F0",
    300: "#CBD5E0",
    400: "#A0AEC0",
    500: "#718096",
    600: "#4A5568",
    700: "#2D3748",
    800: "#1A202C",
    900: "#171923",
  },
};

const theme = extendTheme({
  config,
  colors,
});

export default theme;
