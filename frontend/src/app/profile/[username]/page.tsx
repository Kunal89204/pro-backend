"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef, useState, useEffect } from "react";
import { myQuery } from "@/api/query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Image from "next/image";
import {
  Flex,
  Box,
  Text,
  Button,
  Avatar,
  Input,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { setAuth } from "@/lib/slices/authSlice";
import { useThemeColors } from "@/hooks/useThemeColors";
import Myvideos from "@/components/profile/Myvideos";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import EditProfile from "@/components/Modals/EditProfile";
import Tweets from "@/components/profile/tweets/Tweets";
import Bookmarks from "@/components/profile/bookmarks/Bookmarks";
import { useRouter, useSearchParams } from "next/navigation";

const Profile = () => {
  const token = useSelector((state: RootState) => state.token);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const router = useRouter();
  const username = searchParams.get("username") || "";
  // Color modes import
  const { textColor, secondaryTextColor, buttonBg } = useThemeColors();

  // Cover Image States
  const [coverImage, setCoverImage] = useState<File | undefined>();
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);

  // Avatar Image States
  const [avatarImage, setAvatarImage] = useState<File | undefined>();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
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
      const user = data?.data;
      dispatch(
        setAuth({
          user: {
            username: user?.username,
            email: user?.email,
            fullName: user?.fullName,
            avatarImage: user?.avatar,
          },
          token: token,
        })
      );
   
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

  // Ensure we have a valid username for routing
  const profileUsername = user?.data?.username || username;

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
              <Button
                onClick={handleCoverImageUpdate}
                mt={2}
                isLoading={coverImageMutation.isPending}
              >
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
                <Text
                  fontSize={"4xl"}
                  color={textColor}
                  fontWeight={"semibold"}
                >
                  {user?.data?.fullName}
                </Text>
                <Text color={secondaryTextColor}>@{user?.data?.username}</Text>
                <Text color={secondaryTextColor}>{user?.data?.bio}</Text>

                <Flex gap={2}>
                  <Button
                    variant={"unstyled"}
                    textColor={secondaryTextColor}
                    px={4}
                    my={4}
                    bg={buttonBg}
                    onClick={onOpen}
                    borderRadius={"full"}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant={"unstyled"}
                    textColor={secondaryTextColor}
                    px={4}
                    my={4}
                    bg={buttonBg}
                    borderRadius={"full"}
                  >
                    Change Password
                  </Button>
                </Flex>
              </Box>
            </Flex>

            {selectedAvatar && (
              <Button
                onClick={handleAvatarImageUpdate}
                mt={2}
                isLoading={avatarImageMutation.isPending}
              >
                Upload Avatar
              </Button>
            )}
          </div>
        )}
      </div>

      <Tabs variant={"solid-rounded"} defaultIndex={tab === "videos" ? 0 : tab === "tweets" ? 1 : tab === "saved" ? 2 : 0}>
        <TabList>
          <Tab
            mx={1}
            color={colorMode == "dark" ? "white" : "black"}
            _selected={{ color: "white", bg: "gray.500" }}
            onClick={() => {
              router.push(`/profile/${profileUsername}?tab=videos`, { scroll: false });
            }}
          >
            Videos
          </Tab>
          <Tab
            mx={1}
            color={colorMode == "dark" ? "white" : "black"}
            _selected={{ color: "white", bg: "gray.500" }}
            onClick={() => {
              router.push(`/profile/${profileUsername}?tab=tweets`, { scroll: false });
            }}
          >
            Tweets
          </Tab>
          <Tab
            mx={1}
            color={colorMode == "dark" ? "white" : "black"}
            _selected={{ color: "white", bg: "gray.500" }}
            onClick={() => {
              router.push(`/profile/${profileUsername}?tab=saved`, { scroll: false });
            }}
          >
            Saved
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel >
            <Myvideos />
          </TabPanel>
          <TabPanel>
            <Tweets />
          </TabPanel>
          <TabPanel>
            <Bookmarks />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <EditProfile
        isOpen={isOpen}
        onClose={onClose}
    
        fullName={user?.data?.fullName}
        bio={user?.data?.bio}
        />
    </div>
  );
};

export default Profile;
