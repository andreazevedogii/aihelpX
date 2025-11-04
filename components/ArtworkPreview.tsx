import React, { useState } from 'react';
import { DownloadIcon, EditIcon, RevertIcon, XIcon } from './icons';
import ContextImageModal from './ContextImageModal';

interface ArtworkPreviewProps {
  imageUrl: string;
  imageName: string;
  tags: string[];
  isLoading: boolean;
  onReset: () => void;
  onImageEdit: (prompt: string) => Promise<void>;
  onRevertImage: () => Promise<void>;
  isEditing: boolean;
  isRevertable: boolean;
  editError: string | null;
  contextImages: (string | 'error')[];
  isContextLoading: boolean;
}

const TagSkeleton: React.FC = () => (
    <div className="animate-pulse bg-gray-600 rounded-full px-4 py-2 h-8 w-24"></div>
);

const ContextImageSkeleton: React.FC = () => (
    <div className="w-1/4 md:w-full aspect-[4/5] bg-gray-800 rounded-lg animate-pulse"></div>
);

const ArtworkPreview: React.FC<ArtworkPreviewProps> = ({ 
    imageUrl, 
    imageName,
    tags, 
    isLoading, 
    onReset,
    onImageEdit,
    onRevertImage,
    isEditing,
    isRevertable,
    editError,
    contextImages,
    isContextLoading
 }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedContextImage, setSelectedContextImage] = useState<{ url: string; index: number } | null>(null);

  const handleGenerateClick = () => {
    if (prompt.trim()) {
      onImageEdit(prompt);
    }
  };

  const handleExport = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full text-white relative">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <button 
             onClick={onReset}
             className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center">
                <XIcon className="w-4 h-4 mr-2" />
                Upload New
            </button>
            <div className="flex items-center space-x-2">
                {isRevertable && !isEditing && (
                   <button onClick={onRevertImage} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center">
                       <RevertIcon className="w-4 h-4 mr-2" />
                       Revert
                   </button>
                )}
                <button 
                  onClick={handleExport}
                  disabled={isEditing}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Export Image
                </button>
                <button 
                  onClick={() => setShowEditor(!showEditor)} 
                  className="bg-brand-accent hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
                  aria-expanded={showEditor}
                >
                    <EditIcon className="w-4 h-4 mr-2" />
                    Edit with AI
                </button>
            </div>
        </div>

      <div className="flex-grow flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/5 order-2 md:order-1 flex md:flex-col gap-2">
            <img src={imageUrl} alt="Artwork thumbnail" className="w-1/4 md:w-full rounded-lg border-2 border-white object-cover aspect-[4/5]" />
            {isContextLoading ? (
                <>
                    <ContextImageSkeleton />
                    <ContextImageSkeleton />
                    <ContextImageSkeleton />
                    <ContextImageSkeleton />
                </>
            ) : (
                contextImages.map((src, index) => {
                     if (src === 'error' || !src) {
                        return (
                            <div key={index} className="w-1/4 md:w-full aspect-[4/5] bg-gray-800/50 rounded-lg flex items-center justify-center text-red-400" title="Failed to generate">
                                <XIcon className="w-6 h-6" />
                            </div>
                        );
                    }
                    return (
                        <button 
                            key={index} 
                            onClick={() => setSelectedContextImage({ url: src, index })}
                            className="w-1/4 md:w-full rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-accent ring-offset-2 ring-offset-brand-dark"
                        >
                            <img src={src} alt={`Context ${index + 1}`} className="w-full h-full object-cover aspect-[4/5] opacity-75 hover:opacity-100 transition-opacity" />
                        </button>
                    );
                })
            )}
        </div>
        
        <div className="w-full md:w-4/5 order-1 md:order-2 flex flex-col">
            <div className="flex-grow bg-black rounded-lg flex items-center justify-center overflow-hidden relative">
                <img src={imageUrl} alt="Artwork" className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${isEditing ? 'opacity-50' : 'opacity-100'}`} />
                 {isEditing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-center p-4">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-white font-semibold">Editing your artwork...</p>
                    </div>
                )}
            </div>
             {showEditor && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg transition-all duration-300">
                    <label htmlFor="edit-prompt" className="text-sm font-medium text-gray-300">Describe your edit</label>
                    <div className="flex gap-2 mt-2">
                        <input
                            id="edit-prompt"
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'Add a retro film grain effect'"
                            className="flex-grow bg-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-brand-accent focus:outline-none transition-colors"
                            disabled={isEditing}
                        />
                        <button
                            onClick={handleGenerateClick}
                            disabled={isEditing || !prompt.trim()}
                            className="bg-brand-accent hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isEditing ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                    {editError && <p className="text-red-400 mt-2 text-sm">{editError}</p>}
                </div>
            )}
        </div>
      </div>

       <div className="mt-4 flex flex-wrap gap-2 items-center min-h-[40px]">
        {isLoading ? (
            <>
                <TagSkeleton />
                <TagSkeleton />
                <TagSkeleton />
                <TagSkeleton />
                <TagSkeleton />
            </>
        ) : (
            tags.map((tag, index) => (
                <span key={index} className="bg-gray-700 text-gray-200 text-sm font-medium px-4 py-2 rounded-full">
                    {tag}
                </span>
            ))
        )}
      </div>

        {selectedContextImage && (
            <ContextImageModal 
                imageUrl={selectedContextImage.url} 
                onClose={() => setSelectedContextImage(null)} 
                imageName={`artwork-in-context-${selectedContextImage.index + 1}.png`} 
            />
        )}
    </div>
  );
};

export default ArtworkPreview;