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
} from "@chakra-ui/react";
import { myQuery } from "@/api/query";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const DeletePlaylistModal = ({
  isOpen,
  onClose,
  playlistId,
}: {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
}) => {
  const { token } = useSelector((state: RootState) => state);
  const toast = useToast();
  const { mutate: deletePlaylist, isPending } = useMutation({
    mutationFn: () => myQuery.deletePlaylist(token, playlistId),
    onSuccess: () => {
      onClose();
      toast({
        title: "Playlist deleted successfully",
        status: "success",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete playlist",
        status: "error",
      });
    },
  });

  const handleDelete = () => {
    deletePlaylist();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={"#121212"} color="white" borderRadius="10px">
        <ModalHeader>Delete Playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are You sure you want to delete this playlist?</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            variant="solid"
            colorScheme="red"
            onClick={handleDelete}
            isLoading={isPending}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeletePlaylistModal;
