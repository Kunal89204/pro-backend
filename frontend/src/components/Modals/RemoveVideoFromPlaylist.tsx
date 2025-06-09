import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,

  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { myQuery } from '@/api/query';

const RemoveVideoFromPlaylist = ({
  isOpen,
  onClose,
  playlistId,
  videoId,
}: {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  videoId: string;
}) => {
  const toast = useToast()
  const token = useSelector((state: RootState) => state.token)
  const removeVideoFromPlaylistMutation = useMutation({
    mutationFn: (playlistId: string) =>
      myQuery.removeVideoFromPlaylist(token, playlistId, videoId),
    onSuccess: () => {
      onClose()
      toast({
        title: "Video removed from playlist",
        description: "Video removed from playlist",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });


  const handleVideoRemoval = async () => {
    removeVideoFromPlaylistMutation.mutate(playlistId)
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(2px)" />
      <ModalContent
        bg={useColorModeValue('#f9f9f9', '#1a1a1a')}
        borderRadius="lg"
        boxShadow="lg"
        px={4}
        py={2}
        transition="all 0.3s"
      >
        <ModalHeader fontSize="lg" fontWeight="semibold" color="red.400">
          Remove Video
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="sm" color="gray.400">
            Are you sure you want to remove this video from the playlist?
          </Text>
        </ModalBody>

        <ModalFooter mt={2}>
          <Button
            onClick={onClose}
            variant="ghost"
            color="gray.500"
            _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
            mr={2}
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            variant="solid"
            _hover={{ opacity: 0.9 }}
            onClick={handleVideoRemoval}
            isLoading={removeVideoFromPlaylistMutation.isPending}
          >
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RemoveVideoFromPlaylist;
