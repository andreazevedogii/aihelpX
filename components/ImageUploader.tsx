
import React, { useState, useCallback } from 'react';
import { UploadCloudIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);


  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center p-8 max-w-lg mx-auto">
        <h1 className="text-4xl font-bold text-gray-800">ArtSpark AI Toolkit</h1>
        <p className="mt-4 text-lg text-gray-600">
          Upload your artwork to ignite your marketing. Generate descriptions, social posts, and more with the power of AI.
        </p>
        <div
          className={`mt-10 p-10 border-2 border-dashed rounded-lg transition-colors duration-200 ${
            isDragging ? 'border-brand-accent bg-indigo-50' : 'border-gray-300 bg-white'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-4">
            <UploadCloudIcon className={`w-12 h-12 ${isDragging ? 'text-brand-accent' : 'text-gray-400'}`} />
            <span className="font-semibold text-brand-accent">Click to upload</span>
            <span className="text-gray-500">or drag and drop</span>
            <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
