import React from "react";
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
  useToast,
  Flex,
} from "@chakra-ui/react";
import { myQuery } from "@/api/query";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { IconTrash } from "@tabler/icons-react";

const DeletePlaylistModal = ({
  isOpen,
  onClose,
  playlistId,
}: {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
}) => {
  const token  = useSelector((state: RootState) => state?.token);
  const toast = useToast();

  const { mutate: deletePlaylist, isPending } = useMutation({
    mutationFn: () => myQuery.deletePlaylist(token, playlistId),
    onSuccess: () => {
      toast({
        position: "bottom-right",
        duration: 3000,
        render: () => (
          <Flex
            align="center"
            gap={2}
            p={3}
            bg="#1a1a1a"
            color="white"
            borderRadius="md"
            boxShadow="lg"
          >
            <IconTrash color="red" size={18} />
            <Text fontSize="sm">Playlist deleted successfully</Text>
          </Flex>
        ),
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Failed to delete playlist",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    },
  });

  const handleDelete = () => {
    deletePlaylist();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(6px)" />
      <ModalContent
        bg="#1a1a1a"
        color="white"
        borderRadius="lg"
        px={6}
        py={4}
        boxShadow="dark-lg"
      >
        <ModalHeader fontSize="lg" fontWeight="semibold">
          Confirm Deletion
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text fontSize="sm" color="gray.300">
            Are you sure you want to permanently delete this playlist? This
            action cannot be undone.
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button variant="ghost" onClick={onClose} color="gray.400">
            Cancel
          </Button>
          <Button
            colorScheme="red"
            isLoading={isPending}
            onClick={handleDelete}
            borderRadius="md"
          >
            Delete Playlist
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeletePlaylistModal;
