import React from 'react';
import { DownloadIcon, XIcon } from './icons';

interface ContextImageModalProps {
  imageUrl: string;
  imageName: string;
  onClose: () => void;
}

const ContextImageModal: React.FC<ContextImageModalProps> = ({ imageUrl, imageName, onClose }) => {
  const handleExport = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close modal on escape key press
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-brand-dark rounded-lg shadow-2xl w-full max-w-4xl h-auto max-h-[90vh] flex flex-col relative animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 flex-grow flex items-center justify-center">
            <img src={imageUrl} alt="Artwork in context" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
            <button
                onClick={handleExport}
                className="bg-brand-accent hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
                <DownloadIcon className="w-5 h-5"/>
                Download
            </button>
            <button onClick={onClose} className="bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-colors">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ContextImageModal;