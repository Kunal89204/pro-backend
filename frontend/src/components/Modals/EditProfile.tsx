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
  Text,
  Input,
} from "@chakra-ui/react";

const EditProfile = ({
  isOpen,
  onClose,
  userId,
  fullName,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string | undefined;
  fullName: string | undefined;
}) => {
  console.log(userId, fullName);
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
          <Input type="text" placeholder="Full Name" value={fullName} />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose} variant={"outline"}>
            Close
          </Button>
          <Button variant="solid" colorScheme="gray">Update</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfile;
