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
} from "@chakra-ui/react";

interface ShareVideoProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;

}

const ShareVideo: React.FC<ShareVideoProps> = ({
  isOpen,
  onClose,
  videoId,

}) => {
  const toast = useToast();

  const baseURL = "https://youtube.kunalkhandelwal.dev";
  const videoURL = `${baseURL}/watch/${videoId}`;
  const embedURL = `${baseURL}/embed/video/${videoId}`;

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
    await navigator.clipboard.writeText(text);
    toast({
      title: `${label} copied to clipboard`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  // Responsive modal size
  const modalSize = useBreakpointValue({ base: "xs", sm: "md", md: "lg" });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize} isCentered>
      <ModalOverlay />
      <ModalContent
        // Glasmorphism styles
        bg="rgba(30, 30, 40, 0.55)"
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
          Share Video
        </ModalHeader>
        <ModalCloseButton color="gray.300" />
        <ModalBody>
          <VStack align="stretch" spacing={6}>
            <Box>
              <Text color="gray.200" mb={1} fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>
                Video Link
              </Text>
              <HStack spacing={2}>
                <Input
                  value={videoURL}
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
                  onClick={() => handleCopy(videoURL, "Video link")}
                  colorScheme="gray"
                  variant="solid"
                  size="md"
                  fontWeight="bold"
                >
                  Copy
                </Button>
              </HStack>
            </Box>

            <Box>
              <Text color="gray.200" mb={1} fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>
                Embed Code
              </Text>
              <HStack align="start"  spacing={2} flexWrap="wrap" position="relative">
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

export default ShareVideo;
