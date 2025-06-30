"use client";
import { IconMessage2Plus, IconSearch, IconVideo } from "@tabler/icons-react";
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
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import { useThemeColors } from "@/hooks/useThemeColors";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { myQuery } from "@/api/query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const pathname = usePathname();
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const token = useSelector((state: RootState) => state.token);
  const { buttonBg, hoverBg, inputTextColor } = useThemeColors();

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/embed/video/")
  ) {
    return null;
  }

  const {
    data: suggestions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () => myQuery.getSuggestions(token, query),
    // enabled: !!query,
  });

  console.log(suggestions?.suggestions);

  const handleSearch = (value: string) => {
    if (value.trim().split("").length == 0) {
      setQuery("");
    }
    setQuery(value);
    refetch();
  };

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
            bg={colorMode == "light" ? "gray.200" : "rgba(10, 10, 10, 1)"}
            color={inputTextColor}
            borderRadius="full"
            py={2}
            px={4}
            _focusVisible={{ outline: "none" }}
            _focus={{ outline: "none", borderColor: "primary.main" }}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
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

          {suggestions?.suggestions?.length > 0 && (
            <Box className="absolute top-12 rounded left-0 w-full p-4 flex items-center justify-start bg-[#424242] text-white">
              <Flex className="flex-col gap-2">
                {isLoading ? (
                  <Text>Loading...</Text>
                ) : (
                  suggestions?.suggestions?.map((item: any, i: number) => (
                    <Link
                      onClick={() => setQuery("")}
                      href={`/search?q=${item}`}
                      key={i}
                      className="hover:underline"
                    >
                      <Text>{item}</Text>
                    </Link>
                  ))
                )}
              </Flex>
            </Box>
          )}
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
              <Box
                className="absolute top-[110%] right-0 flex flex-col gap-2  rounded-md p-2"
                bg={colorMode == "light" ? "gray.200" : "#222222"}
              >
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
