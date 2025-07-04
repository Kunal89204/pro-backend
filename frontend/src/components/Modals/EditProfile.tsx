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
  Text,
  Input,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { myQuery } from "@/api/query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const EditProfile = ({
  isOpen,
  onClose,
  
  fullName,
  bio,
}: {
  isOpen: boolean;
  onClose: () => void;

  fullName: string | undefined;
  bio: string | undefined;
}) => {
  const token = useSelector((state: RootState) => state.token);
  const [fullNameState, setFullNameState] = useState(fullName);
  const [bioState, setBioState] = useState(bio);
  const queryClient = useQueryClient();
  const updateProfileMutation = useMutation({
    mutationFn: () => myQuery.updateProfile(token, fullNameState, bioState),
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], (old: {data: {fullName: string, bio: string}}) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            fullName: fullNameState,
            bio: bioState,
          },
        };
      });
      onClose();
    },
  });

  const handleUpdateProfile = async () => {
    updateProfileMutation.mutate();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="transparent"
        backdropFilter="blur(20px)"
        color="white"
        borderRadius="10px"
        width="300px"
      >
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text py={2}>Full Name</Text>
          <Input
            type="text"
            placeholder="Full Name"
            value={fullNameState}
            onChange={(e) => setFullNameState(e.target.value)}
          />
          <Text py={2}>Bio</Text>
          <Input
            type="text"
            placeholder="Bio"
            value={bioState}
            onChange={(e) => setBioState(e.target.value)}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="gray"
            mr={3}
            onClick={onClose}
            variant={"outline"}
          >
            Close
          </Button>
          <Button
            variant="solid"
            colorScheme="gray"
            onClick={handleUpdateProfile}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfile;
