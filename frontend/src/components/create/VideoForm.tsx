import React from 'react'

interface FormData {
  title: string;
  description: string;
}

interface VideoFormProps {
  onFormDataChange: (data: FormData) => void;
  initialData: FormData;
}

const VideoForm: React.FC<VideoFormProps> = ({ onFormDataChange, initialData }) => {
  const [formData, setFormData] = React.useState<FormData>(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    onFormDataChange(newFormData);
  };

  return (
    <div className="space-y-4">
    <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            placeholder="Enter video title"
        />
    </div>
    <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="Enter video description"
        />
    </div>
</div>
  )
}

export default VideoForm
