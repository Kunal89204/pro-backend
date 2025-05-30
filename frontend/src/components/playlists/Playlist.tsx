"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import { useThemeColors } from "@/hooks/useThemeColors";

const Playlist = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [colors, setColors] = useState<string[]>(["#cccccc", "#999999"]); // Default colors
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div
      className="flex p-4 m-4 rounded-3xl transition-all duration-300"
      style={{
        backgroundColor: isHovered ? colors[0] : undefined,
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box>
        <Box borderRadius={"12px"} position={"relative"}>
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
            src={
              "http://res.cloudinary.com/dqvqvvwc8/image/upload/v1738686384/kzxbuc9529e8zatxfxn1.jpg"
            }
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
            7 videos
          </Badge>
        </Box>

        {/* Playlist Details */}
        <Text color={textColor} fontWeight={"semibold"}>
          Coding
        </Text>
        <Flex alignItems={"center"} gap={2} fontSize={"sm"}>
          <Text color={secondaryTextColor}>Private</Text>
          <Box h={1} w={1} borderRadius={"full"} bg={"gray.500"}></Box>
          <Text color={secondaryTextColor}>Playlist</Text>
        </Flex>
      </Box>
    </div>
  );
};

export default Playlist;
