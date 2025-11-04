
import React, { useEffect, useState } from 'react';
import { Tool } from '../types';
import { ClipboardCheckIcon, ClipboardIcon, XIcon } from './icons';

interface GeneratedContentModalProps {
  tool: Tool;
  content: string;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-brand-accent animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="w-4 h-4 rounded-full bg-brand-accent animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="w-4 h-4 rounded-full bg-brand-accent animate-bounce" style={{animationDelay: '0.4s'}}></div>
    </div>
);

const GeneratedContentModal: React.FC<GeneratedContentModalProps> = ({ tool, content, isLoading, error, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  const Icon = tool.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
        <header className="p-5 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
                <Icon className="w-6 h-6 text-gray-700"/>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{tool.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="p-6 flex-grow overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">Generating content, please wait...</p>
            </div>
          )}
          {error && <div className="text-red-600 bg-red-50 p-4 rounded-md">{error}</div>}
          {!isLoading && !error && (
            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap text-gray-700 font-mono text-sm leading-relaxed">
              {content}
            </div>
          )}
        </main>
        
        <footer className="p-5 border-t flex justify-end items-center gap-3">
            <button
                onClick={handleCopy}
                disabled={isLoading || !!error || !content}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-accent rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
                {copied ? <ClipboardCheckIcon className="w-5 h-5"/> : <ClipboardIcon className="w-5 h-5"/>}
                {copied ? 'Copied!' : 'Copy Text'}
            </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default GeneratedContentModal;
