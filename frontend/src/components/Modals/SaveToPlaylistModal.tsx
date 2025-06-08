import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
} from "@chakra-ui/react";
import usePlaylists from "@/hooks/usePlaylists";
import { myQuery } from "@/api/query";
import { useToast } from "@chakra-ui/react";

import { IconLock, IconLockOpen } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import CreatePlaylistModal from "./CreatePlaylistModal";

interface Video {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  owner: {
    _id: string;
    username: string;
    avatar: string;
  }[];
}

interface Playlist {
  _id: string;
  name: string;
  isPublic: boolean;
  videos: Video[];
  owner: {
    _id: string;
    username: string;
    avatar: string;
  }[];
}

const SaveToPlaylistModal = ({
  isOpen,
  onClose,
  videoId,
}: {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}) => {
  const { data, isLoading, error, isError } = usePlaylists();
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([]);
  const toast = useToast();

  const { isOpen: isCreatePlaylistOpen, onOpen: onOpenCreatePlaylist, onClose: onCloseCreatePlaylist } = useDisclosure();

  const { token } = useSelector((state: RootState) => state);

  // Separate mutations for add and remove
  const addVideoToPlaylistMutation = useMutation({
    mutationFn: (playlistId: string) =>
      myQuery.addVideoToPlaylist(token, playlistId, videoId),
    onSuccess: () => {
      //   queryClient.invalidateQueries({ queryKey: ["playlists"] });
      console.log("Added to playlist");
      toast({
        title: "Video added to playlist",
        description: "Video added to playlist",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const removeVideoFromPlaylistMutation = useMutation({
    mutationFn: (playlistId: string) =>
      myQuery.removeVideoFromPlaylist(token, playlistId, videoId),
    onSuccess: () => {
      //   queryClient.invalidateQueries({ queryKey: ["playlists"] });
      console.log("Removed from playlist");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    // Preselect playlists that already contain the video
    if (data?.data) {
      const preselected: string[] = [];
      data.data.forEach((item: Playlist) => {
        if (item.videos.some((video: Video) => video._id === videoId)) {
          preselected.push(item._id);
        }
      });
      setSelectedPlaylistIds(preselected);
    }
  }, [data, videoId]);

  // Use useCallback to avoid unnecessary re-renders
  const handleCheckboxChange = useCallback(
    (playlistId: string, checked: boolean) => {
      if (checked) {
        // Add to playlist
        setSelectedPlaylistIds((prev) => [...prev, playlistId]);
        addVideoToPlaylistMutation.mutate(playlistId);
      } else {
        // Remove from playlist
        setSelectedPlaylistIds((prev) =>
          prev.filter((id) => id !== playlistId)
        );
        removeVideoFromPlaylistMutation.mutate(playlistId);
      }
    },
    [addVideoToPlaylistMutation, removeVideoFromPlaylistMutation]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        bg="#121212"
        color="white"
        borderRadius="10px"
        width="300px"
      >
        <ModalHeader>Save to Playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error: {String(error)}</div>}
          {data?.data?.map((playlist: Playlist) => (
            <div key={playlist._id} className="w-full flex items-center">
              <Checkbox
                value={playlist._id}
                isChecked={selectedPlaylistIds.includes(playlist._id)}
                onChange={(e) =>
                  handleCheckboxChange(playlist._id, e.target.checked)
                }
                color="white"
                display="flex"
                alignItems="center"
                gap="10px"
                className="w-full "
              >
                <Flex
                  gap="10px"
                  justifyContent="space-between"
                  width="100%"
                  alignItems="center"
                  className="w-full "
                >
                  <Text fontSize="20px">{playlist.name}</Text>
                </Flex>
              </Checkbox>
              {playlist.isPublic ? <IconLock /> : <IconLockOpen />}
            </div>
          ))}
        </ModalBody>

        <ModalFooter display="flex" justifyContent="center">
          <Button colorScheme="gray" mr={3} onClick={onOpenCreatePlaylist} width="100%">
            Create New Playlist
          </Button>
        </ModalFooter>
      </ModalContent>
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={onCloseCreatePlaylist}
        videoId={videoId}
        parentClose={onClose}
      />
    </Modal>
  );
};

export default SaveToPlaylistModal;
