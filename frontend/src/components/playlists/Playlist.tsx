"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Badge,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useRouter } from "next/navigation";
import { IconDotsVertical } from "@tabler/icons-react";

const Playlist = ({
  data,
}: {
  data: {
    _id: string;
    name: string;
    isPublic: boolean;
    videos: {
      _id: string;
      thumbnail: string;
      title: string;
      description: string;
      duration: number;
      views: number;
      owner: { _id: string; username: string; avatar: string }[];
    }[];
    owner: { _id: string; username: string; avatar: string }[];
  };
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [colors, setColors] = useState<string[]>(["#cccccc", "#999999"]); // Default colors
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { colorMode } = useColorMode();
  useEffect(() => {
    const fetchColors = async () => {
      if (!imgRef.current) return;

      // Dynamically import ColorThief
      const ColorThief = (await import("colorthief")).default;
      const colorThief = new ColorThief();

      const image = imgRef.current;
      if (image.complete) {
        const palette = colorThief.getPalette(image, 2);
        if (palette && palette.length >= 2) {
          const [r1, g1, b1] = palette[0];
          const [r2, g2, b2] = palette[1];

          setColors([`rgb(${r1}, ${g1}, ${b1})`, `rgb(${r2}, ${g2}, ${b2})`]);
        }
      } else {
        image.onload = () => {
          const palette = colorThief.getPalette(image, 2);
          if (palette && palette.length >= 2) {
            const [r1, g1, b1] = palette[0];
            const [r2, g2, b2] = palette[1];

            setColors([`rgb(${r1}, ${g1}, ${b1})`, `rgb(${r2}, ${g2}, ${b2})`]);
          }
        };
      }
    };

    fetchColors();
  }, []);

  const { textColor, secondaryTextColor } = useThemeColors();

  if (data.videos.length === 0) return null;

  return (
    <div
      className="flex p-4 m-0 rounded-3xl transition-all duration-300"
      style={{
        backgroundColor: isHovered
          ? `${colors[0].replace("rgb", "rgba").replace(")", ", 0.3)")}`
          : undefined,
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box>
        <Box
          borderRadius={"12px"}
          position={"relative"}
          onClick={() =>
            router.push(`/watch/${data.videos[data.videos.length - 1]._id}`)
          }
        >
          {/* First Box (Lighter Shade) */}
          <Box
            className="absolute w-[90%] left-1/2 -translate-x-1/2 h-full -z-0 bottom-2 rounded-xl border border-black opacity-50"
            style={{ backgroundColor: colors[1] }}
          ></Box>

          {/* Second Box (Darker Shade for Depth) */}
          <Box
            className="absolute w-[95%] left-1/2 -translate-x-1/2 h-full -z-0 bottom-1 rounded-xl border border-black opacity-70"
            style={{ backgroundColor: colors[0] }}
          ></Box>

          {/* Main Image */}
          <Image
            ref={imgRef}
            src={data?.videos[data.videos.length - 1]?.thumbnail}
            alt=""
            width={1000}
            height={1000}
            className="rounded-xl relative z-0"
          />

          {/* Badge */}
          <Badge
            position="absolute"
            right={2}
            bottom={2}
            bg="rgba(0,0,0,0.6)"
            textColor="white"
            borderRadius={3}
          >
            {data?.videos?.length} videos
          </Badge>
        </Box>

        {/* Playlist Details */}
        <Flex justifyContent={"space-between"} alignItems={"start"} pt={2}>
          <Box>
            <Text color={textColor} fontWeight={"semibold"} fontSize={"18px"}>
              {data?.name}
            </Text>
            <Flex alignItems={"center"} gap={2} fontSize={"sm"}>
              <Text color={secondaryTextColor}>
                {data?.isPublic ? "Public" : "Private"}
              </Text>
              <Box h={1} w={1} borderRadius={"full"} bg={"gray.500"}></Box>
              <Text color={secondaryTextColor}>Playlist</Text>
            </Flex>
          </Box>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={
                <IconDotsVertical
                  width={18}
                  className={
                    colorMode === "light" ? "text-gray-400" : "text-gray-500"
                  }
                />
              }
              variant="ghost"
              size="sm"
              aria-label="Options"
              p={1}
              minW={0}
              height="28px"
              width="28px"
              bg="transparent"
              _hover={{
                bg: `${colors[0]
                  .replace("rgb", "rgba")
                  .replace(")", ", 0.3)")}`,
              }}
              _active={{ bg: "transparent" }}
            />
            <MenuList
              minW="100px"
              py={1}
              px={0}
              borderRadius="md"
              boxShadow="md"
              bg={`${colors[0].replace("rgb", "rgba").replace(")", ", 0.9)")}`}
              border="none"
            >
              <MenuItem
                fontSize="sm"
                px={3}
                py={2}
                bg="transparent"
                _hover={{
                  bg: `${colors[0]
                    .replace("rgb", "rgba")
                    .replace(")", ", 0.3)")}`,
                }}
                _focus={{
                  bg: `${colors[0]
                    .replace("rgb", "rgba")
                    .replace(")", ", 0.8)")}`,
                }}
                color={"gray.100"}
              >
                Edit
              </MenuItem>
              <MenuItem
                fontSize="sm"
                px={3}
                py={2}
                bg="transparent"
                _hover={{
                  bg: `${colors[0]
                    .replace("rgb", "rgba")
                    .replace(")", ", 0.3)")}`,
                }}
                _focus={{
                  bg: `${colors[0]
                    .replace("rgb", "rgba")
                    .replace(")", ", 0.8)")}`,
                }}
                color={"gray.100"}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
    </div>
  );
};

export default Playlist;
