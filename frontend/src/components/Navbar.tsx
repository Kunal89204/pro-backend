"use client";
import { IconMessage2Plus, IconSearch, IconVideo } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import { useThemeColors } from "@/hooks/useThemeColors";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { myQuery } from "@/api/query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useDebounce } from "@/hooks/useDebounce";

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const pathname = usePathname();
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const token = useSelector((state: RootState) => state.token);
  const { buttonBg, hoverBg, inputTextColor } = useThemeColors();
  const debouncedQuery = useDebounce(query, 300);

  const {
    data: suggestions,
    isFetching,
  } = useQuery({
    queryKey: ["suggestions", debouncedQuery],
    queryFn: () => myQuery.getSuggestions(token, debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 60000, // 1 minute
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/embed/video/") ||
    pathname.startsWith("/embed/tweet/")
  ) {
    return null;
  }

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const showSuggestions = isSearchFocused && 
    debouncedQuery.trim().length > 0 && 
    (isFetching || suggestions?.suggestions?.length > 0);

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      bg={"transparent"}
      backdropFilter="blur(10px)"
      px={4}
      py={2}
      // boxShadow="xl"
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
          ref={searchRef}
          as="form"
          onSubmit={handleSearchSubmit}
          // bg={"red"}
        >
          <Input
            placeholder="Search..."
            bg={colorMode == "light" ? "gray.100" : "rgba(10, 10, 10, 1)"}
            color={inputTextColor}
            borderRadius="full"
            py={4}
            px={4}
            value={query}
            _focusVisible={{ outline: "none" }}
            _focus={{ outline: "none", borderColor: "primary.main" }}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            onFocus={() => setIsSearchFocused(true)}
          />
          <InputRightAddon borderRightRadius={"full"}>
            <IconButton
              aria-label="Search"
              icon={<IconSearch />}
              variant="ghost"
              borderRadius="full"
              _hover={"none"}
              _focus={"none"}
              type="submit"
            />
          </InputRightAddon>

          {showSuggestions && (
            <Box 
              className="absolute top-12 rounded left-0 w-full p-4 flex items-center justify-start bg-[#424242] text-white"
              boxShadow="md"
              animation="fadeIn 0.2s ease-in-out"
            >
              <Flex className="flex-col gap-2 w-full">
                {isFetching ? (
                  <Flex justify="center" align="center" py={2}>
                    <Spinner size="sm" mr={2} />
                    <Text>Searching...</Text>
                  </Flex>
                ) : suggestions?.suggestions?.length > 0 ? (
                  suggestions.suggestions.map((item: string, i: number) => (
                    <Link
                      onClick={() => {
                        setQuery(item);
                        setIsSearchFocused(false);
                      }}
                      href={`/search?q=${encodeURIComponent(item)}`}
                      key={i}
                      className="hover:bg-[#525252] p-2 rounded transition-colors"
                    >
                      <Flex align="center">
                        <IconSearch size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
                        <Text noOfLines={1}>{item}</Text>
                      </Flex>
                    </Link>
                  ))
                ) : (
                  <Text py={2} opacity={0.7}>No suggestions found</Text>
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
