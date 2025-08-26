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

  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import userQueries from "@/api/userQueries";
import { useMutation } from "@tanstack/react-query";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { AxiosError } from "axios";

const ChangePassword = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({ 
    oldPassword: "", 
    newPassword: ""
  });
  const toast = useToast();
  const token = useSelector((state: RootState) => state.token);

  const validateForm = () => {
    const newErrors = { 
      oldPassword: "", 
      newPassword: ""
    };

    if (!oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }

    if (oldPassword === newPassword && oldPassword.trim()) {
      newErrors.newPassword = "New password must be different from old password";
    }

    setErrors(newErrors);
    return !newErrors.oldPassword && !newErrors.newPassword;
  };

  const resetForm = () => {
    setOldPassword("");
    setNewPassword("");
    setErrors({ oldPassword: "", newPassword: "" });
  };

  const handleChangePasswordMutation = useMutation({
    mutationFn: () =>
      userQueries.changePassword(token, oldPassword, newPassword),
    onSuccess: () => {
      toast({
        title: "Password changed successfully",
        description: "Your password has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      resetForm();
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Password change error:", error);
      
      let errorMessage = "Failed to change password. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 401) {
        errorMessage = "Current password is incorrect.";
      } else if (error?.response?.status === 400) {
        errorMessage = "Invalid password format.";
      } else if (error?.response?.status === 429) {
        errorMessage = "Too many attempts. Please try again later.";
      }

      toast({
        title: "Password Change Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await handleChangePasswordMutation.mutateAsync();
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    if (handleChangePasswordMutation.isPending) {
      return; // Prevent closing while request is in progress
    }
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered closeOnOverlayClick={!handleChangePasswordMutation.isPending}>
      <ModalOverlay />
      <ModalContent
        bg="transparent"
        backdropFilter="blur(20px)"
        color="white"
        borderRadius="10px"
        width="350px"
      >
        <ModalHeader>Change Password</ModalHeader>
        <ModalCloseButton isDisabled={handleChangePasswordMutation.isPending} />
        <ModalBody>
          <FormControl isInvalid={!!errors.oldPassword} mb={4}>
            <FormLabel>Current Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              isDisabled={handleChangePasswordMutation.isPending}
            />
            {errors.oldPassword && (
              <FormErrorMessage>{errors.oldPassword}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.newPassword}>
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              isDisabled={handleChangePasswordMutation.isPending}
            />
            {errors.newPassword && (
              <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button 
            variant="ghost" 
            onClick={handleClose}
            isDisabled={handleChangePasswordMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            mr={3} 
            onClick={handleSubmit}
            isLoading={handleChangePasswordMutation.isPending}
            loadingText="Changing..."
          >
            Change Password
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangePassword;
