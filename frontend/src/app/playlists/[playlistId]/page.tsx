"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Spinner,
  Badge,
  useColorModeValue,
  IconButton,
  Container,
  Divider,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { myQuery } from "@/api/query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import { IconEdit, IconTrash, IconPlayerPlayFilled } from "@tabler/icons-react";

import EditPlaylist from "@/components/Modals/EditPlaylist";
import DeletePlaylistModal from "@/components/Modals/DeletePlaylistModal";
import { useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import PlaylistVideo from "@/components/playlists/PlaylistVideo";
import Image from "next/image";


const PlaylistPage = () => {
  const { playlistId } = useParams();
  const token = useSelector((state: RootState) => state.token);

  const {
    isOpen: isEditOpen,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const router = useRouter();

  const {
    data: playlist,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["playlist", playlistId, token],
    queryFn: () => myQuery.getPlaylistById(token, playlistId as string),
    enabled: !!playlistId && !!token,
  });

  const bgColor = useColorModeValue("#fafafa", "#121212");
  const cardBg = useColorModeValue("white", "#111111");
  const borderColor = useColorModeValue("gray.100", "#1a1a1a");
  const textColor = useColorModeValue("gray.900", "#ffffff");
  const subtleTextColor = useColorModeValue("gray.500", "#888888");
  const hoverBg = useColorModeValue("gray.50", "#161616");

  const imgRef = useRef<HTMLImageElement | null>(null);
  const [colors, setColors] = useState<string[]>(["#cccccc", "#999999"]); // Default colors

  useEffect(() => {
    const fetchColors = async () => {
      if (!imgRef.current || !playlist?.data?.videos?.length) return;

      try {
        // Dynamically import ColorThief
        const ColorThief = (await import("colorthief")).default;
        const colorThief = new ColorThief();

        const image = imgRef.current;

        const extractColors = () => {
          try {
            const palette = colorThief.getPalette(image, 2);
            if (palette && palette.length >= 2) {
              const [r1, g1, b1] = palette[0];
              const [r2, g2, b2] = palette[1];

              setColors([
                `rgb(${r1}, ${g1}, ${b1})`,
                `rgb(${r2}, ${g2}, ${b2})`,
              ]);
            }
          } catch (error) {
            console.log("ColorThief extraction failed:", error);
            // Keep default colors
          }
        };

        if (image.complete && image.naturalHeight !== 0) {
          // Image is already loaded
          extractColors();
        } else {
          // Image is not loaded yet, wait for it
          image.onload = extractColors;
          image.onerror = () => {
            console.log("Image failed to load");
            // Keep default colors
          };
        }
      } catch (error) {
        console.log("ColorThief import failed:", error);
        // Keep default colors
      }
    };

    fetchColors();
  }, [playlist]); // Add playlist as dependency so it runs when playlist data is available

  if (isLoading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
        <VStack spacing={4}>
          <Spinner size="lg" thickness="2px" color="blue.400" />
          <Text color={subtleTextColor} fontSize="sm">
            Loading playlist...
          </Text>
        </VStack>
      </Flex>
    );
  }

  if (isError || !playlist) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
        <VStack spacing={4}>
          <Text color="red.400" fontSize="lg" fontWeight="medium">
            {error instanceof Error ? error.message : "Failed to load playlist"}
          </Text>
          <Button size="sm" variant="ghost" onClick={() => router.back()}>
            Go back
          </Button>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="7xl" py={8}>
        {/* Playlist Header */}
        <Box mb={12}>
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={8}
            align="flex-start"
          >
            {/* Playlist Cover */}
            <Box position="relative" flexShrink={0}>
              <Box
                w={{ base: "100%", lg: "full" }}
                h="280px"
                borderRadius="xl"
                overflow="hidden"
                bg={cardBg}
                // border="0px solid"
                // borderColor={borderColor}
                style={{
                  boxShadow: `20px 0px 150px 0px ${colors[0]}`,
                }}
              >
                <Image
                  ref={imgRef} // Add this ref
                  src={
                    playlist.data.videos?.[playlist.data.videos.length - 1]
                      ?.thumbnail ||
                    "https://media.istockphoto.com/id/2167960646/vector/illustration-of-a-botanical-background-featuring-tropical-animals-and-various-tropical.jpg?s=612x612&w=0&k=20&c=KeAaK6shnN5qzapejJRcAIxU5ftUtnBbcYZxJecG1_w="
                  }
                  alt={playlist.data.name}
                  width={1000}
                  height={1000}
                  className="w-full aspect-video h-[280px]"
                  crossOrigin="anonymous" // Add this for ColorThief to work with external images
                />
              </Box>

              {/* Play Button Overlay */}
              <Flex
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                align="center"
                justify="center"
                bg="blackAlpha.600"
                borderRadius="xl"
                opacity={0}
                _hover={{ opacity: 1 }}
                transition="opacity 0.3s"
                cursor="pointer"
              >
                <IconButton
                  icon={<IconPlayerPlayFilled size={30} color="white" />}
                  aria-label="Play playlist"
                  size="xl"
                  borderRadius="full"
                  bg="whiteAlpha.400"
                  color="black"
                  _hover={{ bg: "black", transform: "scale(1.05)" }}
                  transition="all 0.2s" padding={2}
                />
              </Flex>
            </Box>

            {/* Playlist Info */}
            <VStack align="flex-start" spacing={6} flex={1} pt={2}>
              <VStack align="flex-start" spacing={3}>
                <HStack spacing={3}>
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    color={subtleTextColor}
                    fontWeight="medium"
                    letterSpacing="wider"
                  >
                    Playlist
                  </Text>
                  <Badge
                    colorScheme={playlist.data.isPublic ? "green" : "gray"}
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="medium"
                  >
                    {playlist.data.isPublic ? "Public" : "Private"}
                  </Badge>
                </HStack>

                <Text
                  fontSize={{ base: "2xl", md: "4xl" }}
                  fontWeight="bold"
                  color={textColor}
                  lineHeight="shorter"
                  letterSpacing="tight"
                >
                  {playlist.data.name}
                </Text>

                <HStack spacing={4} color={subtleTextColor} fontSize="sm">
                  <HStack spacing={1}>
                    <IconPlayerPlayFilled size={16} />
                    <Text>{playlist.data.videos?.length || 0} videos</Text>
                  </HStack>
                </HStack>
              </VStack>

              {/* Action Buttons */}
              <HStack spacing={3}>
                <Button
                  leftIcon={<IconEdit size={16} />}
                  size="md"
                  variant="outline"
                  borderColor={borderColor}
                  color={textColor}
                  bg={cardBg}
                  _hover={{ bg: hoverBg }}
                  borderRadius="full"
                  fontWeight="medium"
                  onClick={onOpenEdit}
                >
                  Edit
                </Button>
                <IconButton
                  icon={<IconTrash size={16} />}
                  aria-label="Delete playlist"
                  size="md"
                  variant="ghost"
                  color="red.400"
                  _hover={{ bg: "red.50", color: "red.500" }}
                  borderRadius="full"
                  onClick={onOpenDelete}
                />
              </HStack>
            </VStack>
          </Flex>
        </Box>

        <Divider borderColor={borderColor} />

        {/* Videos Section */}
        <Box pt={8}>
          {playlist.data.videos && playlist.data.videos.length > 0 ? (
            <VStack align="stretch" spacing={1}>
              {playlist?.data?.videos?.map(
                (
                  video: {
                    _id: string;
                    thumbnail: string;
                    title: string;
                    description: string;
                    duration: number;
                    views: number;
                  },
                  idx: number
                ) => (
                  <PlaylistVideo
                    key={idx}
                    video={video}
                    idx={idx}
                    playlistId={playlist.data._id}
                  />
                )
              )}
            </VStack>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              py={16}
              textAlign="center"
            >
              <Box
                w={16}
                h={16}
                bg={borderColor}
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={4}
              >
                <IconPlayerPlayFilled size={24} color={subtleTextColor} />
              </Box>
              <Text color={textColor} fontSize="lg" fontWeight="medium" mb={2}>
                No videos yet
              </Text>
              <Text color={subtleTextColor} fontSize="sm" maxW="md">
                This playlist is empty. Add some videos to get started.
              </Text>
            </Flex>
          )}

         
        </Box>

        {/* Modals */}
        <EditPlaylist
          isOpen={isEditOpen}
          onClose={onCloseEdit}
          playlistId={playlist.data._id}
          title={playlist.data.name}
          isPublic={playlist.data.isPublic}
        />
        <DeletePlaylistModal
          isOpen={isDeleteOpen}
          onClose={onCloseDelete}
          playlistId={playlist.data._id}
        />
      </Container>
    </Box>
  );
};

export default PlaylistPage;
