"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef, useState, useEffect } from "react";
import { myQuery } from "@/api/query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Image from "next/image";
import { Flex, Box, Text, Button, Avatar, Input, useColorMode } from "@chakra-ui/react";
import { setAuth } from "@/lib/slices/authSlice";
import { useThemeColors } from "@/hooks/useThemeColors";
import Myvideos from "@/components/profile/Myvideos";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'


const Profile = () => {
  const token = useSelector((state: RootState) => state.token);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch()
  const { colorMode } = useColorMode()

  // Color modes import
  const { textColor, secondaryTextColor, buttonBg } = useThemeColors()

  // Cover Image States
  const [coverImage, setCoverImage] = useState<File | undefined>();
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);

  // Avatar Image States
  const [avatarImage, setAvatarImage] = useState<File | undefined>();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => myQuery.getCurrentUser(token),
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });

  const coverImageMutation = useMutation({
    mutationFn: () =>
      myQuery.updateCoverImage(token, coverImage, user?.data?.coverImage || ""),
    onSuccess: () => {
      refetch();
      setSelectedBanner(null);
    },
  });

  const avatarImageMutation = useMutation({
    mutationFn: () =>
      myQuery.updateUserAvatar(token, avatarImage, user?.data?.avatar || ""),
    onSuccess: (data) => {
      const user = data?.data
      dispatch(setAuth({ user: { username: user?.username, email: user?.email, fullName: user?.fullName, avatarImage: user?.avatar }, token: token }))
      console.log(data)
      refetch();
      setSelectedAvatar(null);
    },
  });

  // Handle Cover Image Change
  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedBanner(imageUrl);
    }
  };

  // Handle Avatar Image Change
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarImage(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedAvatar(imageUrl);
    }
  };

  // Handle Cover Image Upload
  const handleCoverImageUpdate = () => {
    if (coverImage) {
      coverImageMutation.mutate();
    } else {
      console.warn("No cover image selected");
    }
  };

  // Handle Avatar Image Upload
  const handleAvatarImageUpdate = () => {
    if (avatarImage) {
      avatarImageMutation.mutate();
    } else {
      console.warn("No avatar image selected");
    }
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (selectedBanner) URL.revokeObjectURL(selectedBanner);
      if (selectedAvatar) URL.revokeObjectURL(selectedAvatar);
    };
  }, [selectedBanner, selectedAvatar]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mt-4">
        {user && (
          <div>
            {/* Cover Image */}
            <Box
              className="w-full h-64 relative rounded-xl overflow-hidden cursor-pointer"
              onClick={() => coverFileInputRef.current?.click()}
            >
              {selectedBanner || user?.data?.coverImage ? (
                <Image
                  src={selectedBanner || user?.data?.coverImage}
                  alt="Cover"
                  width={1000}
                  height={400}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <Box className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <Text fontSize="lg" color="gray.600">
                    Select Banner Image
                  </Text>
                </Box>
              )}
              <Input
                type="file"
                accept="image/*"
                hidden
                ref={coverFileInputRef}
                onChange={handleBannerChange}
              />
            </Box>

            {selectedBanner && (
              <Button onClick={handleCoverImageUpdate} mt={2}>
                Upload Cover
              </Button>
            )}

            {/* Avatar Image */}
            <Flex py={4} alignItems={"start"} gap={6}>
              <Box position="relative">
                <Avatar
                  src={selectedAvatar || user?.data?.avatar}
                  name={user?.data?.fullName}
                  className="w-32 rounded-full"
                  width={40}
                  height={40}
                  onClick={() => avatarFileInputRef.current?.click()}
                  cursor="pointer"
                />
                <Input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={avatarFileInputRef}
                  onChange={handleAvatarChange}
                />
              </Box>

              <Box>
                <Text fontSize={"4xl"} color={textColor} fontWeight={"semibold"}>
                  {user?.data?.fullName}
                </Text>
                <Text color={secondaryTextColor}>@{user?.data?.username}</Text>

                <Flex gap={2}>
                  <Button
                    variant={"unstyled"}
                    textColor={secondaryTextColor}

                    px={4}
                    my={4}
                    bg={buttonBg}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant={"unstyled"}
                    textColor={secondaryTextColor}

                    px={4}
                    my={4}
                    bg={buttonBg}
                  >
                    Change Password
                  </Button>
                </Flex>
              </Box>
            </Flex>

            {selectedAvatar && (
              <Button onClick={handleAvatarImageUpdate} mt={2}>
                Upload Avatar
              </Button>
            )}
          </div>
        )}
      </div>

      <Tabs variant={'solid-rounded'} colorScheme="blue">
        <TabList >
          <Tab mx={1} color={colorMode == 'dark' ? "white" : "black"}>Videos</Tab>
          <Tab mx={1} color={colorMode == 'dark' ? "white" : "black"}>Tweets</Tab>
          <Tab mx={1} color={colorMode == 'dark' ? "white" : "black"}>Playlists</Tab>
        </TabList>

        <TabPanels>
          <TabPanel><Myvideos /></TabPanel>
          <TabPanel><p>Tweets</p></TabPanel>
          <TabPanel><p>Playlists</p></TabPanel>
        </TabPanels>
      </Tabs>

    </div>
  );
};

export default Profile;
