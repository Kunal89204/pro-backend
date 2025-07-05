import React, { useState } from "react";
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
  Flex,
  useToast,
} from "@chakra-ui/react";
import { Switch } from "@chakra-ui/react";
import { IconAlertCircle } from "@tabler/icons-react";
import { myQuery } from "@/api/query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon } from "@chakra-ui/icons";

const CreatePlaylistModal = ({
  isOpen,
  onClose,
  videoId,
  parentClose,
}: {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  parentClose: () => void;
}) => {
  const [playlistName, setPlaylistName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const toast = useToast();
  const token  = useSelector((state: RootState) => state?.token);

  const createPlaylistMutation = useMutation({
    mutationFn: ({
      playlistName,
      isPublic,
      videoId,
    }: {
      playlistName: string;
      isPublic: boolean;
      videoId: string;
    }) => myQuery.createPlaylist(token, playlistName, isPublic, videoId),
    onSuccess: () => {
      toast({
        position: "bottom",
        render: () => (
          <Flex
            alignItems={"center"}
            gap={2}
            className="border bg-black border-[#101010] rounded-md p-2"
          >
            <CheckIcon color="green" />
            <Text color={'white'}>Playlist created successfully</Text>
          </Flex>
        ),
      });
    },
    onError: () => {
      toast({
        title: "Failed to create playlist",
        status: "error",
      });
    },
  });

  const handleSave = () => {
    if (playlistName.trim() === "") {
      toast({
        position: "bottom",
        render: () => (
          <Flex
            alignItems={"center"}
            gap={2}
            className="border bg-black border-[#101010] rounded-md p-4"
          >
            <IconAlertCircle color="red" />
            <Text>Playlist name is required</Text>
          </Flex>
        ),
      });
    } else {
      createPlaylistMutation.mutate({
        playlistName,
        isPublic,
        videoId,
      });
      onClose();
      parentClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="transparent"
        backdropFilter="blur(20px)"
        color="white"
        borderRadius="10px"
        // width="300px"
      >
        <ModalHeader>Create Playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text py={2} >Playlist Name</Text>
          <Input
            placeholder={"Enter playlist name"}
            required
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <Flex alignItems={"center"} gap={2} py={4} mt={4}>
            <Switch
              colorScheme="gray"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
            />{" "}
            <Text>Public</Text>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={handleSave} width="100%">
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreatePlaylistModal;
