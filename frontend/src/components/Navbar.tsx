"use client";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import { useThemeColors } from '@/hooks/useThemeColors'

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const { bgColor, borderColor, buttonBg, hoverBg, inputBg, inputTextColor } = useThemeColors()

  if (typeof window !== "undefined" && (window.location.pathname === "/login" || window.location.pathname === "/register")) {
    return null;
  }

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      bg={bgColor}
      px={4}
      py={2}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center">
        <Box></Box>

        {/* Search Bar */}
        <InputGroup maxW={{ base: "full", lg: "40%" }} borderRadius="full" border="1px solid" borderColor={borderColor}>
          <Input
            placeholder="Search..."
            bg={inputBg}
            color={inputTextColor}
            borderRadius="full"
            py={2}
            px={4}
            _focus={{ outline: "none", borderColor: "primary.main" }}
          />
          <InputRightElement>
            <IconButton
              aria-label="Search"
              icon={<IconSearch />}
              variant="ghost"
              borderRadius="full"
            />
          </InputRightElement>
        </InputGroup>

        {/* Color Mode Toggle & Create Button */}
        <Flex align="center" gap={2}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            size="md"
            variant="ghost"
          />
          <Link href="/create">
            <Button
              display={{ base: "none", lg: "inline-flex" }}
              bg={buttonBg}
              borderRadius="full"
              px={8}
              py={2}
              boxShadow="sm"
              _hover={{ bg: hoverBg, color: "primary.med" }}
            >
              Create
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
