"use client";
import {
  IconMessage2Plus,
  IconSearch,
  IconVideo,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import { useThemeColors } from "@/hooks/useThemeColors";

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const pathname = usePathname();
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();

  const { buttonBg, hoverBg, inputTextColor } = useThemeColors();

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/embed/video/")
  ) {
    return null;
  }

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      // bg={pathname.startsWith("/playlists/") ? "transparent" : "#121212"}
      bg={"transparent"}
      backdropFilter="blur(10px)"
      px={4}
      py={2}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center">
        <Box></Box>

        {/* Search Bar */}
        <InputGroup
          maxW={{ base: "full", lg: "40%" }}
          borderRadius="full"
          border="0px solid"
          borderColor={"rgba(255, 255, 255, 0.1)"}
          className="relative"
        >
          <Input
            placeholder="Search..."
            bg={colorMode == "light" ? "gray.200" : "rgba(10, 10, 10, 0.8)"}
            color={inputTextColor}
            borderRadius="full"
            py={2}
            px={4}
            _focusVisible={{ outline: "none" }}
            _focus={{ outline: "none", borderColor: "primary.main" }}
          />
          <InputRightAddon borderRightRadius={"full"}>
            <IconButton
              aria-label="Search"
              icon={<IconSearch />}
              variant="ghost"
              borderRadius="full"
              _hover={"none"}
              _focus={"none"}
            />
          </InputRightAddon>

          {/* <Box className="absolute top-12 rounded left-0 w-full h-full flex items-center justify-start bg-[#424242] text-white">
            <Flex gap={2} px={4} py={2}>

              <Link href={'/'}>
                <Text className="">All</Text>
              </Link>
            </Flex>
            
          </Box> */}
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
          {/* <Link href="/create"> */}
          <Box className="relative">
            <Button
              display={{ base: "none", lg: "inline-flex" }}
              bg={buttonBg}
              borderRadius="full"
              px={8}
              py={2}
              boxShadow="sm"
              _hover={{ bg: hoverBg, color: "primary.med" }}
              onClick={() => setShowCreate(!showCreate)}
            >
              Create
            </Button>

            {showCreate && (
              <Box className="absolute top-[110%] right-0 flex flex-col gap-2  rounded-md p-2" bg={colorMode == "light" ? "gray.200" : "#222222"}>
                <Button
                  onClick={() => {
                    router.push("/create/video");
                    setShowCreate(false);
                  }}
                  background={"transparent"}
                  className="flex gap-2"
                >
                  {" "}
                  <IconVideo size={18} /> Upload Video
                </Button>
                <Button
                  onClick={() => {
                    router.push("/create/tweet");
                    setShowCreate(false);
                  }}
                  background={"transparent"}
                  className="flex gap-2"
                >
                  {" "}
                  <IconMessage2Plus size={18} /> Upload Tweet
                </Button>
              </Box>
            )}
          </Box>
          {/* </Link> */}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
