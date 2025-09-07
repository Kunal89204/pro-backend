import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Text,
  Box,
  useToast,
  VStack,
  Code,
  HStack,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";


interface ShareTweetProps {
  isOpen: boolean;
  onClose: () => void;
  tweetId: string | undefined;
}

const ShareTweet: React.FC<ShareTweetProps> = ({ isOpen, onClose, tweetId }) => {
  const toast = useToast();
  const { colorMode } = useColorMode();

  const baseURL = "https://tvideo.kunalkhandelwal.dev";
  const tweetURL = tweetId ? `${baseURL}/tweet/${tweetId}` : "";
  const embedURL = tweetId ? `${baseURL}/embed/tweet/${tweetId}` : "";

  const embedCode = `<iframe
  src="${embedURL}"
  width="560"
  height="315"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  loading="lazy"
  style="border: none;">
</iframe>`;

  const handleCopy = async (text: string, label: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast({
      title: `${label} copied to clipboard`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  const modalSize = useBreakpointValue({ base: "xs", sm: "md", md: "lg" });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize} isCentered>
      <ModalOverlay />
      <ModalContent
        bg={colorMode == "light" ? "rgba(255,255,255,0.08)" : "rgba(30, 30, 40, 0.55)"}
        borderRadius="2xl"
        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        backdropFilter="blur(24px) saturate(180%)"
        border="1px solid rgba(255,255,255,0.18)"
        px={{ base: 2, sm: 4 }}
        py={2}
        maxW={{ base: "95vw", sm: "90vw", md: "600px" }}
        w="100%"
      >
        <ModalHeader color="white" fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
          Share Tweet
        </ModalHeader>
        <ModalCloseButton color="gray.300" />
        <ModalBody>
          <VStack align="stretch" spacing={6}>
            <Box>
              <Text color="gray.200" mb={1} fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>
                Tweet Link
              </Text>
              <HStack spacing={2}>
                <Input
                  value={tweetURL}
                  placeholder="Tweet link unavailable"
                  isReadOnly
                  variant="filled"
                  bg="rgba(255,255,255,0.08)"
                  color="white"
                  fontSize={{ base: "sm", md: "md" }}
                  _focus={{ bg: "rgba(255,255,255,0.12)" }}
                  _hover={{ bg: "rgba(255,255,255,0.12)" }}
                  border="none"
                  px={3}
                  py={2}
                />
                <Button
                  onClick={() => handleCopy(tweetURL, "Tweet link")}
                  colorScheme="gray"
                  variant="solid"
                  size="md"
                  fontWeight="bold"
                  isDisabled={!tweetId}
                >
                  Copy
                </Button>
              </HStack>
            </Box>

            <Box>
              <Text color={colorMode == "light" ? "white" : "black"} mb={1} fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>
                Embed Code
              </Text>
              <HStack align="start" spacing={2} flexWrap="wrap" position="relative">
                <Box
                  flex={1}
                  minW={0}
                  maxW="100%"
                  overflowX="auto"
                  bg="rgba(40,40,60,0.5)"
                  borderRadius="md"
                  border="1px solid rgba(255,255,255,0.10)"
                  p={4}
                  sx={{
                    "::-webkit-scrollbar": {
                      height: "6px",
                    },
                    "::-webkit-scrollbar-thumb": {
                      background: "rgba(255,255,255,0.12)",
                      borderRadius: "4px",
                    },
                  }}
                >
                  <Code
                    p={0}
                    borderRadius="md"
                    bg="transparent"
                    color="green.200"
                    fontSize={{ base: "xs", sm: "sm" }}
                    whiteSpace="pre"
                    overflowX="auto"
                    display="block"
                    w="100%"
                    maxW="100%"
                  >
                    {embedCode}
                  </Code>
                </Box>
                <Button
                  onClick={() => handleCopy(embedCode, "Embed code")}
                  colorScheme="gray"
                  variant="ghost"
                  size="sm"
                  fontWeight="light"
                  flexShrink={0}
                  position="absolute"
                  right={1}
                  top={1}
                  isDisabled={!tweetId}
                >
                  Copy
                </Button>
              </HStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={onClose}
            colorScheme="whiteAlpha"
            borderColor="rgba(255,255,255,0.18)"
            color="white"
            _hover={{
              bg: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.30)",
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShareTweet;
