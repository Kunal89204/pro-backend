import React, {  useState } from "react";
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
  Input,
  Switch,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { myQuery } from "@/api/query";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import usePlaylists from "@/hooks/usePlaylists";

const EditPlaylist = ({
  isOpen,
  onClose,
  playlistId,
  // colors,
  title,
  isPublic,
}: {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  // colors: string[];
  title: string;
  isPublic: boolean;
}) => {
  const [playlistName, setPlaylistName] = useState(title);
  const [isPublicState, setIsPublicState] = useState(isPublic);
  const token  = useSelector((state: RootState) => state?.token);
  const { refetch } = usePlaylists();
  const toast = useToast();
  const { mutate: editPlaylist, isPending } = useMutation({
    mutationFn: () =>
      myQuery.editPlaylist(token, playlistId, playlistName, isPublicState),
    onSuccess: () => {
      onClose();
      toast({
        title: "Playlist edited successfully",
        status: "success",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Failed to edit playlist",
        status: "error",
      });
    },
  });

  const handleSave = () => {
    editPlaylist();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={"transparent"} backdropFilter="blur(50px)" borderRadius="10px">
        <ModalHeader color={'white'}>Edit Playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text py={2} fontSize={"lg"} color={'white'}>
            Playlist Name
          </Text>
          <Input
            value={playlistName}
            color={'white'}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <Flex alignItems={"center"} gap={2} py={4} mt={4}>
            <Switch
              colorScheme="gray"
              isChecked={isPublicState}
              onChange={() => setIsPublicState(!isPublicState)}
            />{" "}
            <Text color={'white'}>Public</Text>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" variant={'ghost'} mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            colorScheme="gray"
            isLoading={isPending}
            color={'white'}
            _hover={{ color: 'black', bg: 'white' }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPlaylist;
