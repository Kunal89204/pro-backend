"use client"
import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { myQuery } from '@/api/query';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';


interface UploadProps {
  videoFile: File[];
  thumbnailFile: File[];
  formData: {
    title: string;
    description: string;
  };
  publish:boolean
  onSuccess: () => void;
}

const Upload: React.FC<UploadProps> = ({ videoFile, thumbnailFile, formData, publish, onSuccess }) => {
  const token = useSelector((state:RootState) => state.token)
  const uploadMutation = useMutation({
    mutationFn: async () => {
      
      return myQuery.uploadVideo({
        token,
        title: formData.title,
        description: formData.description,
        publish,
        thumbnail: thumbnailFile[0],
        videoFile: videoFile[0]
      });
    },
    onSuccess: (data) => {
      console.log('Upload successful:', data);
      onSuccess();
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      // Add error handling (e.g., show error message)
    }
  });

  const handleUpload = () => {
    uploadMutation.mutate();
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Review Your Upload</h3>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Title:</p>
            <p>{formData.title}</p>
          </div>
          <div>
            <p className="font-medium">Description:</p>
            <p>{formData.description}</p>
          </div>
          <div>
            <p className="font-medium">Video:</p>
            <p>{videoFile[0]?.name}</p>
          </div>
          <div>
            <p className="font-medium">Publish</p>
            <p>{publish?'yes':"No"}</p>
          </div>
          {thumbnailFile.length > 0 && (
            <div>
              <p className="font-medium">Thumbnail:</p>
              <p>{thumbnailFile[0]?.name}</p>
            </div>
          )}
        </div>
      </div>
      <button 
        onClick={handleUpload}
        disabled={uploadMutation.isPending}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
      </button>
      {uploadMutation.isError && (
        <p className="text-red-500 mt-2">Upload failed. Please try again.</p>
      )}
    </div>
  )
}

export default Upload
