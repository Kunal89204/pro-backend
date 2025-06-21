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
import { useMutation } from "@tanstack/react-query";
import { myQuery } from "@/api/query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const RemoveVideoFromHistory = ({
  isOpen,
  onClose,
  videoId,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  refetch: () => void;
}) => {
  const token = useSelector((state: RootState) => state.token);
  const toast = useToast();
  const removeVideoFromHistoryMutation = useMutation({
    mutationFn: () => myQuery.removeVideoFromHistory(token, videoId),
    onSuccess: () => {
      toast({
        title: "Video removed from history",
        description: "Video removed from history",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      refetch();
    },
    onError: () => {
      toast({
        title: "Error removing video from history",
        description: "Error removing video from history",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="transparent"
        backdropFilter="blur(20px)"
        color="white"
        borderRadius="10px"
        width="350px"
        p={4}
      >
        <ModalHeader fontSize={"17px"} fontWeight={"bold"} color={"red.400"}>
          Remove Video From History
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize={"14px"} fontWeight={"normal"} color={"gray.300"}>
            Are you sure you want to remove this video from your history?{" "}
          </Text>
        </ModalBody>

        <ModalFooter display={"flex"} justifyContent={"space-between"} gap={3}>
          <Button color={"gray.400"} variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            color={"black"}
            variant="solid"
            colorScheme="red"
            onClick={() => removeVideoFromHistoryMutation.mutate()}
          >
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RemoveVideoFromHistory;
