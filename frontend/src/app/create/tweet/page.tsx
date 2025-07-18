"use client";
import { myQuery } from "@/api/query";
import { RootState } from "@/lib/store";
import {
  Box,
  Button,
  Flex,
  Text,
  Textarea,
  IconButton,
  Progress,
  useToast,
  ScaleFade,
  Collapse,
  HStack,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { IconPhoto, IconSend, IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";

const TweetUpload = () => {
  const avatarImage = useSelector((state: RootState) => state.user.avatarImage);
  const [tweetText, setTweetText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toast = useToast();
  const token = useSelector((state: RootState) => state.token);
  const { colorMode } = useColorMode();
  const MAX_CHARACTERS = 280;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  const charactersLeft = MAX_CHARACTERS - tweetText.length;
  const progressValue = (tweetText.length / MAX_CHARACTERS) * 100;

  const handleImageUpload = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      
      // Check file type - only images and gifs
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image or GIF file",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Check file size - 10MB limit
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const url = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewUrl(url);
    },
    [previewUrl, toast]
  );

  const removeImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl("");
  }, [previewUrl]);

  const createTweetMutation = useMutation({
    mutationFn: (formData: FormData) => myQuery.createTweet(token, formData),
    onSuccess: () => {
      toast({
        title: "Tweet posted!",
        description: "Your tweet has been shared successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setTweetText("");
      setSelectedImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl("");
      
    },

    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post tweet",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleTweet = async () => {
    if (!tweetText.trim() && !selectedImage) {
      toast({
        title: "Empty tweet",
        description: "Please add some content to your tweet",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("content", tweetText);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    createTweetMutation.mutate(formData);
  };

  // Handle keyboard events for proper line breaks
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Regular Enter - submit tweet
      e.preventDefault();
      handleTweet();
    } else if (e.key === 'Enter' && e.shiftKey) {
      // Shift+Enter - add line break (default behavior)
      // Let the default behavior handle this
    }
  };

  // Basic markdown processing for display
  const processMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 4px;">$1</code>') // Code
      .replace(/\n/g, '<br>'); // Line breaks
  };

  const getProgressColor = () => {
    if (charactersLeft <= 0) return "red.400";
    if (charactersLeft <= 20) return "orange.400";
    return "gray.500";
  };

  return (
    <Box
      p={6}
      maxW={"800px"}
      bg="transparent"
      margin={"auto"}
      backdropFilter="blur(20px)"
      borderRadius="2xl"
      position="relative"
      overflow="hidden"
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={colorMode === "dark" ? "white" : "gray.700"}
          >
            Compose Tweet
          </Text>
          <Box textAlign="right">
            <Text fontSize="sm" color={getProgressColor()} fontWeight="medium">
              {charactersLeft < 0
                ? `${Math.abs(charactersLeft)} over limit`
                : `${charactersLeft} left`}
            </Text>
            <Box w="200px" mt={1}>
              <Progress
                value={progressValue}
                size="sm"
                colorScheme={
                  charactersLeft <= 0
                    ? "red"
                    : charactersLeft <= 20
                    ? "orange"
                    : "blue"
                }
                borderRadius="full"
                bg={
                  colorMode === "dark" ? "rgba(255, 255, 255, 0.1)" : "gray.300"
                }
              />
            </Box>
          </Box>
        </Flex>

        {/* Main content area */}
        <HStack align="flex-start" spacing={4}>
          {/* Avatar */}
          <Box position="relative">
            <Image
              src={avatarImage || "/default-avatar.png"}
              alt="Profile"
              width={56}
              height={56}
              className="aspect-square rounded-full object-cover ring-2 ring-blue-400/20"
            />
            <Box
              position="absolute"
              bottom={-1}
              right={-1}
              w={4}
              h={4}
              bg="green.400"
              borderRadius="full"
              border="2px solid"
              borderColor="gray.900"
            />
          </Box>

          {/* Text input area */}
          <Box flex={1}>
            <Textarea
              ref={textareaRef}
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's happening? (Use **bold**, *italic*, `code`, or Shift+Enter for line breaks)"
              bg="rgba(255, 255, 255, 0.1)"
              border={
                colorMode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.1)"
              }
              borderRadius="xl"
              fontSize="lg"
              minH="120px"
              maxH="400px"
              resize="vertical"
              color={colorMode === "dark" ? "white" : "black"}
              _hover={{
                bg: "rgba(255, 255, 255, 0.08)",
              }}
              _focus={{
                bg: "rgba(255, 255, 255, 0.08)",
                borderColor: "rgba(29, 161, 242, 0.8)",
                boxShadow: "0 0 0 3px rgba(29, 161, 242, 0.1)",
              }}
              _placeholder={{
                color: "gray.400",
              }}
              overflow={"hidden"}
              whiteSpace="pre-wrap"
            />
          </Box>
        </HStack>

        {/* Preview area for formatted text */}
        {tweetText && (
          <Box ml="60px">
            <Text fontSize="sm" color="gray.500" mb={2}>
              Preview:
            </Text>
            <Box
              bg="rgba(255, 255, 255, 0.05)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              borderRadius="lg"
              p={4}
              fontSize="md"
              color={colorMode === "dark" ? "white" : "black"}
              dangerouslySetInnerHTML={{
                __html: processMarkdown(tweetText)
              }}
            />
          </Box>
        )}

        {/* Image preview */}
        <Collapse in={!!previewUrl} animateOpacity>
          <Box
            borderRadius="xl"
            p={4}
          >
            <ScaleFade in={!!previewUrl} initialScale={0.8}>
              <Box
                position="relative"
                borderRadius="lg"
                overflow="hidden"
                maxW="500px"
                ml={"60px"}
              >
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={1000}
                  height={1000}
                  className="object-cover w-full"
                />
                <IconButton
                  aria-label="Remove image"
                  icon={<IconX size={16} />}
                  size="xs"
                  position="absolute"
                  top={2}
                  right={2}
                  bg="rgba(0, 0, 0, 0.7)"
                  color="white"
                  borderRadius="full"
                  _hover={{ bg: "rgba(0, 0, 0, 0.9)" }}
                  onClick={removeImage}
                />
              </Box>
            </ScaleFade>
          </Box>
        </Collapse>

        {/* Markdown help text */}
        <Box ml="60px">
          <Text fontSize="xs" color="gray.500">
            Markdown tips: **bold**, *italic*, `code` • Shift+Enter for line breaks • Enter to post
          </Text>
        </Box>

        {/* Action buttons */}
        <Flex justify="space-between" align="center">
          {/* Media options */}
          <HStack spacing={1}>
            <IconButton
              aria-label="Add photo"
              icon={<IconPhoto size={20} />}
              variant="ghost"
              color="purple.400"
              borderRadius="full"
              _hover={{
                bg: "rgba(29, 161, 242, 0.1)",
                transform: "scale(1.05)",
              }}
              transition="all 0.2s ease"
              onClick={() => fileInputRef.current?.click()}
              isDisabled={!!selectedImage}
            />
          </HStack>

          {/* Tweet button */}
          <Button
            leftIcon={<IconSend size={18} />}
            bg="linear-gradient(135deg, #4A25A7, #D22C4A)"
            color="white"
            borderRadius="full"
            px={8}
            py={6}
            fontWeight="bold"
            fontSize="md"
            _hover={{
              transform: "translateY(-1px)",
            }}
            _active={{
              transform: "translateY(0px)",
            }}
            transition="all 0.3s ease"
            isLoading={createTweetMutation.isPending}
            loadingText="Posting..."
            onClick={handleTweet}
            isDisabled={charactersLeft < 0}
          >
            Tweet
          </Button>
        </Flex>
      </VStack>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleImageUpload(e.target.files)}
      />
    </Box>
  );
};

export default TweetUpload;