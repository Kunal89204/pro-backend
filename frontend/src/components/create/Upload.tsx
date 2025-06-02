"use client";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { myQuery } from "@/api/query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Text, useColorMode } from "@chakra-ui/react";
import { useThemeColors } from "@/hooks/useThemeColors";

interface UploadProps {
  videoFile: File[];
  thumbnailFile: File[];
  formData: {
    title: string;
    description: string;
  };
  publish: boolean;
  onSuccess: () => void;
}

const Upload: React.FC<UploadProps> = ({
  videoFile,
  thumbnailFile,
  formData,
  publish,
  onSuccess,
}) => {
  const token = useSelector((state: RootState) => state.token);
  const uploadMutation = useMutation({
    mutationFn: async () => {
      return myQuery.uploadVideo({
        token,
        title: formData.title,
        description: formData.description,
        publish,
        thumbnail: thumbnailFile[0],
        videoFile: videoFile[0],
      });
    },
    onSuccess: (data) => {
      console.log("Upload successful:", data);
      onSuccess();
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      // Add error handling (e.g., show error message)
    },
  });

  const handleUpload = () => {
    uploadMutation.mutate();
  };

  const { colorMode } = useColorMode();
  const { secondaryTextColor, textColor } = useThemeColors();
  return (
    <div>
      <div className="mb-4">
        <Text className="text-lg font-medium mb-2" color={textColor}>
          Review Your Upload
        </Text>
        <div className="space-y-4">
          <div>
            <Text className="font-medium" color={secondaryTextColor}>Title:</Text>
            <Text color={textColor}>{formData.title}</Text>
          </div>
          <div>
            <Text className="font-medium" color={secondaryTextColor}>Description:</Text>
            <Text color={textColor}>{formData.description}</Text>
          </div>
          <div>
            <Text className="font-medium" color={secondaryTextColor}>Video:</Text>
            <Text color={textColor}>{videoFile[0]?.name}</Text>
          </div>
          <div>
            <Text className="font-medium" color={secondaryTextColor}>Publish</Text>
            <Text color={textColor}>{publish ? "yes" : "No"}</Text>
          </div>
          {thumbnailFile.length > 0 && (
            <div>
              <Text className="font-medium" color={secondaryTextColor}>Thumbnail:</Text>
              <Text color={textColor}>{thumbnailFile[0]?.name}</Text>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={handleUpload}
        disabled={uploadMutation.isPending}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {uploadMutation.isPending ? "Uploading..." : "Upload"}
      </button>
      {uploadMutation.isError && (
        <p className="text-red-500 mt-2">Upload failed. Please try again.</p>
      )}
    </div>
  );
};

export default Upload;
