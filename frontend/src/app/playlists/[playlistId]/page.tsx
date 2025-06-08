"use client";
import React from "react";
import {
  Box,
  Flex,
  Text,
  Image,
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
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconPlayerPlayFilled,
  IconEye,
} from "@tabler/icons-react";
import EditPlaylist from "@/components/Modals/EditPlaylist";
import DeletePlaylistModal from "@/components/Modals/DeletePlaylistModal";
import { useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { formatDuration } from "@/utils/formatDuration";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const { token } = useSelector((state: RootState) => state);

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

  const bgColor = useColorModeValue("#fafafa", "#0a0a0a");
  const cardBg = useColorModeValue("white", "#111111");
  const borderColor = useColorModeValue("gray.100", "#1a1a1a");
  const textColor = useColorModeValue("gray.900", "#ffffff");
  const subtleTextColor = useColorModeValue("gray.500", "#888888");
  const hoverBg = useColorModeValue("gray.50", "#161616");

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

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

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
                border="1px solid"
                borderColor={borderColor}
                shadow="sm"
              >
                <Image
                  src={
                    playlist.data.videos?.[playlist.data.videos.length - 1]
                      ?.thumbnail || "/assets/playlist_placeholder.png"
                  }
                  alt={playlist.data.name}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  fallbackSrc="/assets/playlist_placeholder.png"
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
                  icon={<IconPlayerPlayFilled size={32} />}
                  aria-label="Play playlist"
                  size="xl"
                  borderRadius="full"
                  bg="whiteAlpha.900"
                  color="black"
                  _hover={{ bg: "white", transform: "scale(1.05)" }}
                  transition="all 0.2s"
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
              {playlist.data.videos.map((video: {
                _id: string;
                thumbnail: string;
                title: string;
                description: string;
                duration: number;
                views: number;
              }, idx: number) => (
                <Box
                  key={video._id}
                  p={4}
                  borderRadius="lg"
                  cursor="pointer"
                  onClick={() => router.push(`/watch/${video._id}`)}
                  _hover={{ bg: hoverBg }}
                  transition="all 0.2s"
                  border="1px solid"
                  borderColor="transparent"
                  //   _hover={{ borderColor: borderColor }}
                >
                  <Flex align="center" gap={4}>
                    {/* Video Index */}
                    <Text
                      fontSize="sm"
                      color={subtleTextColor}
                      fontWeight="medium"
                      minW="24px"
                      textAlign="center"
                    >
                      {idx + 1}
                    </Text>

                    {/* Video Thumbnail */}
                    <Box
                      w="120px"
                      h="68px"
                      borderRadius="md"
                      overflow="hidden"
                      bg={cardBg}
                      flexShrink={0}
                      position="relative"
                    >
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        fallbackSrc="/assets/video_placeholder.png"
                      />

                      {/* Duration Badge */}
                      <Box
                        position="absolute"
                        bottom={1}
                        right={1}
                        bg="blackAlpha.800"
                        color="white"
                        px={2}
                        py={0.5}
                        borderRadius="sm"
                        fontSize="xs"
                        fontWeight="medium"
                      >
                        {formatDuration(video.duration)}
                      </Box>
                    </Box>

                    {/* Video Info */}
                    <VStack align="flex-start" spacing={2} flex={1} minW={0}>
                      <Text
                        fontWeight="medium"
                        color={textColor}
                        fontSize="md"
                        noOfLines={2}
                        lineHeight="shorter"
                      >
                        {video.title}
                      </Text>

                      {video.description && (
                        <Text
                          fontSize="sm"
                          color={subtleTextColor}
                          noOfLines={1}
                          lineHeight="shorter"
                        >
                          {video.description}
                        </Text>
                      )}

                      <HStack spacing={3} fontSize="xs" color={subtleTextColor}>
                        <HStack spacing={1}>
                          <IconEye size={12} />
                          <Text>{formatViews(video.views)} views</Text>
                        </HStack>
                      </HStack>
                    </VStack>

                    {/* More Options */}
                    <IconButton
                      icon={<IconDotsVertical size={16} />}
                      aria-label="More options"
                      size="sm"
                      variant="ghost"
                      color={subtleTextColor}
                      _hover={{ bg: hoverBg, color: textColor }}
                      borderRadius="full"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle more options
                      }}
                    />
                  </Flex>
                </Box>
              ))}
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
