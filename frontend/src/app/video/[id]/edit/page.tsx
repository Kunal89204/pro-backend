"use client";
import { myQuery } from "@/api/query";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Skeleton,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useThemeColors } from "@/hooks/useThemeColors";
import videoQueries from "@/api/videoQueries";

const EditVideo = () => {
  const { id } = useParams();
  const token = useSelector((state: RootState) => state.token);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [newThumbnailFile, setNewThumbnailFile] = useState<File | null>(null);
  const [thumbnailChanged, setThumbnailChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { textColor } = useThemeColors();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["video", id],
    queryFn: () => myQuery.getVideoById(token, id as string),
  });

  useEffect(() => {
    if (data?.data) {
      setTitle(data?.data?.title);
      setDescription(data?.data?.description);
      setThumbnail(data?.data?.thumbnail);
    }
  }, [data?.data]);

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewThumbnailFile(file);
      setThumbnailChanged(true);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnail(previewUrl);
    }
  };

  const handleUpdateVideoMutation = useMutation({
    mutationFn: (formData: FormData) =>
      videoQueries.updateVideo(token, id as string, formData),
    onSuccess: () => {
      router.push(`/watch/${id}`);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleUpdate = () => {
   

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);

    if (thumbnailChanged && newThumbnailFile) {
      
      formData.append("thumbnail", newThumbnailFile);
    }

    
    

    handleUpdateVideoMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Box p={2}>
        <Skeleton height="20px" width="100px" borderRadius={2} my={2} />
        <Skeleton height="30px" width="500px" borderRadius={4} />
        <Skeleton height="20px" width="100px" borderRadius={2} mb={2} mt={10} />
        <Skeleton height="100px" width="500px" borderRadius={4} />
        <Skeleton height="20px" width="60px" borderRadius={2} mb={2} mt={10} />
        <Skeleton height="200px" width="500px" borderRadius={4} />
      </Box>
    );
  }

  if (isError) {
    return <Box>Error: {error.message}</Box>;
  }

  return (
    <Flex gap={10} alignItems="center">
      <Box>
        <FormControl>
          <FormLabel textColor={textColor}>Title</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            textColor={textColor}
          />

          <FormLabel textColor={textColor}>Description</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            textColor={textColor}
          />

          <FormLabel textColor={textColor}>Thumbnail</FormLabel>
          <Image
            src={thumbnail}
            alt="Thumbnail"
            width={1000}
            height={1000}
            className="w-2/3 cursor-pointer"
            onClick={handleThumbnailClick}
          />
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            style={{ display: "none" }}
          />

          <Button
            mt={4}
            onClick={handleUpdate}
            isLoading={handleUpdateVideoMutation.isPending}
          >
            Update
          </Button>
        </FormControl>
      </Box>

      <Box className="p-10">
        <iframe
          src={`https://youtube.kunalkhandelwal.dev/embed/video/${data?.data?._id}`}
          frameBorder="0"
          width={"600px"}
          className="aspect-video overflow-hidden rounded-xl"
          allowFullScreen
        ></iframe>
      </Box>
    </Flex>
  );
};

export default EditVideo;
