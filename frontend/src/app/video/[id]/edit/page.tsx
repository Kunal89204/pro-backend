"use client";
import { myQuery } from "@/api/query";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Skeleton,
  Textarea,
  Container,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  AspectRatio,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useThemeColors } from "@/hooks/useThemeColors";
import videoQueries from "@/api/videoQueries";
import { IconUpload, IconArrowLeft } from "@tabler/icons-react";

const EditVideo = () => {
  const { id } = useParams();
  const token = useSelector((state: RootState) => state.token);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [newThumbnailFile, setNewThumbnailFile] = useState<File | null>(null);
  const [thumbnailChanged, setThumbnailChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { textColor, secondaryTextColor } = useThemeColors();
  const router = useRouter();
  const toast = useToast();

  const cardBg = useColorModeValue("white", "#202020");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["video", id],
    queryFn: () => myQuery.getVideoById(token, id as string),
  });

  useEffect(() => {
    if (data?.data) {
      setTitle(data?.data?.title);
      setDescription(data?.data?.description);
      setThumbnail(data?.data?.thumbnail);
    }
  }, [data?.data]);

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewThumbnailFile(file);
      setThumbnailChanged(true);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnail(previewUrl);
      toast({
        title: "Thumbnail updated",
        description: "Your new thumbnail will be saved when you update the video.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateVideoMutation = useMutation({
    mutationFn: (formData: FormData) =>
      videoQueries.updateVideo(token, id as string, formData),
    onSuccess: () => {
      toast({
        title: "Video updated",
        description: "Your video has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push(`/watch/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating your video. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.log(error);
    },
  });

  const handleUpdate = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your video.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (thumbnailChanged && newThumbnailFile) {
      formData.append("thumbnail", newThumbnailFile);
    }

    handleUpdateVideoMutation.mutate(formData);
  };

  const handleBack = () => {
    router.push(`/watch/${id}`);
  };

  if (isLoading) {
    return (
      <Container maxW="6xl" py={8}>
        <VStack spacing={6} align="stretch">
          <HStack spacing={4}>
            <Skeleton height="40px" width="40px" borderRadius="md" />
            <Skeleton height="32px" width="200px" borderRadius="md" />
          </HStack>
          <Flex gap={8} direction={{ base: "column", lg: "row" }}>
            <Box flex={1}>
              <Card bg={cardBg} borderColor={borderColor}>
                <CardHeader>
                  <Skeleton height="24px" width="150px" borderRadius="md" />
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Skeleton height="16px" width="50px" mb={2} borderRadius="sm" />
                      <Skeleton height="40px" borderRadius="md" />
                    </Box>
                    <Box>
                      <Skeleton height="16px" width="80px" mb={2} borderRadius="sm" />
                      <Skeleton height="120px" borderRadius="md" />
                    </Box>
                    <Box>
                      <Skeleton height="16px" width="70px" mb={2} borderRadius="sm" />
                      <Skeleton height="200px" borderRadius="md" />
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </Box>
            <Box flex={1}>
              <Card bg={cardBg} borderColor={borderColor}>
                <CardHeader>
                  <Skeleton height="24px" width="100px" borderRadius="md" />
                </CardHeader>
                <CardBody>
                  <Skeleton height="300px" borderRadius="md" />
                </CardBody>
              </Card>
            </Box>
          </Flex>
        </VStack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="6xl" py={8}>
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <VStack spacing={4}>
              <Text fontSize="lg" color="red.500">
                Error loading video
              </Text>
              <Text color={secondaryTextColor}>{error.message}</Text>
              <Button onClick={handleBack} variant="outline">
                Go Back
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack spacing={4}>
          <IconButton
            aria-label="Go back"
            icon={<IconArrowLeft />}
            variant="ghost"
            onClick={handleBack}
            size="lg"
          />
          <Heading size="lg" color={textColor}>
            Edit Video
          </Heading>
        </HStack>

        <Flex gap={8} direction={{ base: "column", lg: "row" }}>
          <Box flex={1}>
            <Card bg={cardBg} borderColor={borderColor} shadow="sm">
              <CardHeader>
                <Heading size="md" color={textColor}>
                  Video Details
                </Heading>
              </CardHeader>
              <Divider />
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <FormControl isRequired>
                    <FormLabel color={textColor} fontWeight="semibold">
                      Title
                    </FormLabel>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      color={textColor}
                      placeholder="Enter video title"
                      size="lg"
                      focusBorderColor="blue.400"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color={textColor} fontWeight="semibold">
                      Description
                    </FormLabel>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      color={textColor}
                      placeholder="Enter video description"
                      rows={6}
                      resize="vertical"
                      focusBorderColor="blue.400"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color={textColor} fontWeight="semibold">
                      Thumbnail
                    </FormLabel>
                    <VStack spacing={3} align="stretch">
                      <AspectRatio ratio={16 / 9} maxW="400px">
                        <Box
                          position="relative"
                          borderRadius="lg"
                          overflow="hidden"
                          cursor="pointer"
                          onClick={handleThumbnailClick}
                          border="2px"
                          borderColor={borderColor}
                          _hover={{
                            borderColor: "blue.400",
                            transform: "scale(1.02)",
                          }}
                          transition="all 0.2s"
                        >
                          {thumbnail ? (
                            <Image
                              src={thumbnail}
                              alt="Thumbnail"
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <Flex
                              align="center"
                              justify="center"
                              h="100%"
                              bg="gray.100"
                              _dark={{ bg: "gray.700" }}
                            >
                              <VStack spacing={2}>
                                <IconUpload size={32} color={secondaryTextColor} />
                                <Text color={secondaryTextColor} fontSize="sm">
                                  Click to upload thumbnail
                                </Text>
                              </VStack>
                            </Flex>
                          )}
                        </Box>
                      </AspectRatio>
                      <Button
                        leftIcon={<IconUpload />}
                        onClick={handleThumbnailClick}
                        variant="outline"
                        size="sm"
                        maxW="200px"
                      >
                        Change Thumbnail
                      </Button>
                    </VStack>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      display="none"
                    />
                  </FormControl>

                  <HStack spacing={4} pt={4}>
                    <Button
                      colorScheme="gray"
                      onClick={handleUpdate}
                      isLoading={handleUpdateVideoMutation.isPending}
                      loadingText="Updating..."
                      size="lg"
                      flex={1}
                    >
                      Update Video
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      size="lg"
                      isDisabled={handleUpdateVideoMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </Box>

          <Box flex={1}>
            <Card bg={cardBg} borderColor={borderColor} shadow="sm">
              <CardHeader>
                <Heading size="md" color={textColor}>
                  Preview
                </Heading>
              </CardHeader>
              <Divider />
              <CardBody>
                <AspectRatio ratio={16 / 9}>
                  <iframe
                    src={`https://youtube.kunalkhandelwal.dev/embed/video/${data?.data?._id}`}
                    frameBorder="0"
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                    allowFullScreen
                  />
                </AspectRatio>
              </CardBody>
            </Card>
          </Box>
        </Flex>
      </VStack>
    </Container>
  );
};

export default EditVideo;
