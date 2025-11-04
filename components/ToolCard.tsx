
import React from 'react';
import { Tool } from '../types';
import { HeartIcon } from './icons';

interface ToolCardProps {
  tool: Tool;
  onSelect: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const Icon = tool.icon;
  return (
    <div 
      className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-lg hover:border-brand-accent transition-all duration-200 cursor-pointer flex flex-col"
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="bg-gray-100 p-2 rounded-full">
            <Icon className="w-6 h-6 text-gray-600" />
        </div>
        <button className="text-gray-400 hover:text-red-500 transition-colors">
            <HeartIcon className="w-6 h-6" />
        </button>
      </div>
      <h3 className="font-bold text-gray-800">{tool.title}</h3>
      <p className="text-gray-500 text-sm mt-1 flex-grow">{tool.description}</p>
    </div>
  );
};

export default ToolCard;
