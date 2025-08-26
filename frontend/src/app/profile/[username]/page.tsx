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
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { setAuth } from "@/lib/slices/authSlice";
import { useThemeColors } from "@/hooks/useThemeColors";
import Myvideos from "@/components/profile/Myvideos";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import EditProfile from "@/components/Modals/EditProfile";
import Tweets from "@/components/profile/tweets/Tweets";
import Bookmarks from "@/components/profile/bookmarks/Bookmarks";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { logout } from "@/lib/slices/authSlice";
import ChangePassword from "@/components/Modals/ChangePassword";

const Profile = () => {
  const token = useSelector((state: RootState) => state.token);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isChangePasswordOpen, onOpen: onOpenChangePassword, onClose: onCloseChangePassword } = useDisclosure();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const router = useRouter();
  const username = useParams().username;
  // Color modes import
  const { textColor, secondaryTextColor, buttonBg } = useThemeColors();

  const owner = useSelector((state: RootState) => state.user.username);
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
    queryFn: () => myQuery.getCurrentUser(token, username as string),
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
      <>
        <Skeleton
          className="w-[98%]  mx-auto h-64  overflow-hidden"
          borderRadius={"2xl"}
        />
        <Flex>
          <SkeletonCircle size="40" m={2} />
          <SkeletonText
            mt="8"
            noOfLines={2}
            spacing="4"
            skeletonHeight="5"
            width={"400px"}
          />
        </Flex>
      </>
    );
  }

  if (error) {
    console.log("I am error", error?.message);
    if (error?.message == "Access token has expired. Please log in again.") {
      dispatch(logout());
      router.push("/login");
    }
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
              className="w-full lg:h-64 h-44 relative rounded-xl overflow-hidden"
              onClick={
                owner === username && owner === user?.data?.username
                  ? () => coverFileInputRef.current?.click()
                  : undefined
              }
              cursor={
                owner === username && owner === user?.data?.username
                  ? "pointer"
                  : "default"
              }
            >
              {selectedBanner || user?.data?.coverImage ? (
                <Image
                  src={selectedBanner || user?.data?.coverImage}
                  alt="Cover"
                  width={1000}
                  height={400}
                  className="w-full lg:h-64 h-44 object-cover"
                />
              ) : (
                <Box className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <Text fontSize="lg" color="gray.600">
                    {owner === username && owner === user?.data?.username
                      ? "Select Banner Image"
                      : "No Banner Image"}
                  </Text>
                </Box>
              )}
              {owner === username && owner === user?.data?.username && (
                <Input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={coverFileInputRef}
                  onChange={handleBannerChange}
                />
              )}
            </Box>

            {selectedBanner &&
              owner === username &&
              owner === user?.data?.username && (
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
                  size={{ base: "lg", md: "lg", lg: "2xl" }}
                  onClick={
                    owner === username && owner === user?.data?.username
                      ? () => avatarFileInputRef.current?.click()
                      : undefined
                  }
                  cursor={
                    owner === username && owner === user?.data?.username
                      ? "pointer"
                      : "default"
                  }
                />
                {owner === username && owner === user?.data?.username && (
                  <Input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={avatarFileInputRef}
                    onChange={handleAvatarChange}
                  />
                )}
              </Box>

              <Box>
                <Text
                  fontSize={{ base: "xl", md: "4xl" }}
                  color={textColor}
                  fontWeight={"semibold"}
                >
                  {user?.data?.fullName}
                </Text>
                <Text color={secondaryTextColor}>@{user?.data?.username}</Text>
                <Text color={secondaryTextColor}>{user?.data?.bio}</Text>

                {owner === username && owner === user?.data?.username && (
                  <Flex gap={2}>
                    <Button
                      variant={"unstyled"}
                      textColor={secondaryTextColor}
                      fontSize={{ base: "sm" }}
                      px={{ base: 3, md: 4 }}
                      my={{ base: 2, md: 4 }}
                      bg={buttonBg}
                      onClick={onOpen}
                      borderRadius={"full"}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant={"unstyled"}
                      textColor={secondaryTextColor}
                      px={{ base: 3, md: 4 }}
                      my={{ base: 2, md: 4 }}
                      bg={buttonBg}
                      borderRadius={"full"}
                      fontSize={{ base: "sm" }}
                      onClick={onOpenChangePassword}
                    >
                      Change Password
                    </Button>
                  </Flex>
                )}
              </Box>
            </Flex>

            {selectedAvatar &&
              owner === username &&
              owner === user?.data?.username && (
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

      <Tabs
        variant={"solid-rounded"}
        defaultIndex={
          tab === "videos" ? 0 : tab === "tweets" ? 1 : tab === "saved" ? 2 : 0
        }
      >
        <TabList>
          <Tab
            mx={1}
            color={colorMode == "dark" ? "white" : "black"}
            _selected={{ color: "white", bg: "gray.500" }}
            onClick={() => {
              router.push(`/profile/${profileUsername}?tab=videos`, {
                scroll: false,
              });
            }}
          >
            Videos
          </Tab>
          <Tab
            mx={1}
            color={colorMode == "dark" ? "white" : "black"}
            _selected={{ color: "white", bg: "gray.500" }}
            onClick={() => {
              router.push(`/profile/${profileUsername}?tab=tweets`, {
                scroll: false,
              });
            }}
          >
            Tweets
          </Tab>
          {owner === username && owner === user?.data?.username && (
            <Tab
              mx={1}
              color={colorMode == "dark" ? "white" : "black"}
              _selected={{ color: "white", bg: "gray.500" }}
              onClick={() => {
                router.push(`/profile/${profileUsername}?tab=saved`, {
                  scroll: false,
                });
              }}
            >
              Saved
            </Tab>
          )}
        </TabList>

        <TabPanels>
          <TabPanel>
            <Myvideos username={username as string} />
          </TabPanel>
          <TabPanel>
            <Tweets username={user?.data?.username} userId={user?.data?._id} />
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
      <ChangePassword isOpen={isChangePasswordOpen} onClose={onCloseChangePassword} />
    </div>
  );
};

export default Profile;
