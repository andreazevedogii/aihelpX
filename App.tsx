import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ArtworkPreview from './components/ArtworkPreview';
import ToolsPanel from './components/ToolsPanel';
import GeneratedContentModal from './components/GeneratedContentModal';
import { Tool } from './types';
import { generateTagsForImage, generateTextForTool, editImageWithPrompt } from './services/geminiService';
import { CONTEXT_PROMPTS } from './constants';

export default function App() {
  const [artwork, setArtwork] = useState<{ url: string; file: File } | null>(null);
  const [originalArtwork, setOriginalArtwork] = useState<{ url: string; file: File } | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [contextImages, setContextImages] = useState<(string | 'error')[]>([]);
  const [isTagLoading, setIsTagLoading] = useState(false);
  const [isContextLoading, setIsContextLoading] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContextualImages = useCallback(async (base64Data: string, mimeType: string) => {
    setIsContextLoading(true);
    setContextImages([]);
    try {
      const promises = CONTEXT_PROMPTS.map(prompt => 
        editImageWithPrompt(base64Data, mimeType, prompt).catch(err => {
          console.error("Failed to generate context image:", err);
          return 'error';
        })
      );
      const results = await Promise.all(promises);
      const newImageUrls = results.map(result => 
        result === 'error' ? 'error' : `data:${mimeType};base64,${result}`
      );
      setContextImages(newImageUrls);
    } catch (e) {
      console.error("Error generating context images batch", e);
      setContextImages(Array(CONTEXT_PROMPTS.length).fill('error'));
    } finally {
      setIsContextLoading(false);
    }
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const url = reader.result as string;
      const uploadedArtwork = { url, file };
      setArtwork(uploadedArtwork);
      setOriginalArtwork(uploadedArtwork);
      setTags([]);
      setContextImages([]);
      setError(null);
      
      const base64Data = url.split(',')[1];

      // Generate tags
      setIsTagLoading(true);
      try {
        const generatedTags = await generateTagsForImage(base64Data);
        setTags(generatedTags);
      } catch (e) {
        setError('Could not generate tags for the image. Please try again.');
        console.error(e);
      } finally {
        setIsTagLoading(false);
      }

      // Generate context images
      await generateContextualImages(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  }, [generateContextualImages]);

  const handleImageEdit = useCallback(async (prompt: string) => {
    if (!artwork) return;
    setIsEditingLoading(true);
    setError(null);
    try {
      const base64Data = artwork.url.split(',')[1];
      const newBase64Data = await editImageWithPrompt(base64Data, artwork.file.type, prompt);
      
      const newMimeType = artwork.file.type;
      const newUrl = `data:${newMimeType};base64,${newBase64Data}`;
      
      const res = await fetch(newUrl);
      const blob = await res.blob();
      const newFile = new File([blob], artwork.file.name, { type: newMimeType });
      
      setArtwork({ url: newUrl, file: newFile });
      
      setIsTagLoading(true);
      const generatedTags = await generateTagsForImage(newBase64Data);
      setTags(generatedTags);
      await generateContextualImages(newBase64Data, artwork.file.type);

    } catch (e) {
      setError('Could not edit the image. Please try again.');
      console.error(e);
    } finally {
      setIsEditingLoading(false);
      setIsTagLoading(false);
    }
  }, [artwork, generateContextualImages]);

  const handleRevertImage = useCallback(async () => {
    if (!originalArtwork) return;
    setArtwork(originalArtwork);
    setIsTagLoading(true);
    setError(null);
    try {
      const base64Data = originalArtwork.url.split(',')[1];
      const generatedTags = await generateTagsForImage(base64Data);
      setTags(generatedTags);
      await generateContextualImages(base64Data, originalArtwork.file.type);
    } catch (e) {
      setError('Could not generate tags for the original image. Please try again.');
      console.error(e);
    } finally {
      setIsTagLoading(false);
    }
  }, [originalArtwork, generateContextualImages]);

  const handleSelectTool = useCallback(async (tool: Tool) => {
    setSelectedTool(tool);
    setIsContentLoading(true);
    setGeneratedContent('');
    setError(null);
    try {
      const content = await generateTextForTool(tool, tags, artwork?.file);
      setGeneratedContent(content);
    } catch (e) {
      setError(`Failed to generate content for ${tool.title}. Please try again.`);
      console.error(e);
    } finally {
      setIsContentLoading(false);
    }
  }, [tags, artwork]);

  const closeModal = () => {
    setSelectedTool(null);
    setGeneratedContent('');
    setError(null);
  };
  
  const resetApp = () => {
    setArtwork(null);
    setOriginalArtwork(null);
    setTags([]);
    setContextImages([]);
    setSelectedTool(null);
    setGeneratedContent('');
    setError(null);
  };

  const isRevertable = !!artwork && !!originalArtwork && artwork.url !== originalArtwork.url;

  return (
    <div className="min-h-screen bg-brand-light font-sans text-gray-800">
      {!artwork ? (
        <ImageUploader onImageUpload={handleImageUpload} />
      ) : (
        <main className="flex flex-col lg:flex-row h-screen overflow-hidden">
          <div className="w-full lg:w-1/2 bg-brand-dark overflow-y-auto p-4 sm:p-8">
            <ArtworkPreview 
              imageUrl={artwork.url}
              imageName={artwork.file.name} 
              tags={tags} 
              isLoading={isTagLoading}
              onReset={resetApp}
              onImageEdit={handleImageEdit}
              onRevertImage={handleRevertImage}
              isEditing={isEditingLoading}
              isRevertable={isRevertable}
              editError={error}
              contextImages={contextImages}
              isContextLoading={isContextLoading}
            />
          </div>
          <div className="w-full lg:w-1/2 bg-brand-light overflow-y-auto p-4 sm:p-8">
            <ToolsPanel onSelectTool={handleSelectTool} />
          </div>
        </main>
      )}
      {selectedTool && (
        <GeneratedContentModal
          tool={selectedTool}
          content={generatedContent}
          isLoading={isContentLoading}
          error={error}
          onClose={closeModal}
        />
      )}
    </div>
  );
}