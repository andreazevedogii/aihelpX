
import React from 'react';
import ToolCard from './ToolCard';
import { TOOLS } from '../constants';
import { Tool } from '../types';
import { SparklesIcon } from './icons';

interface ToolsPanelProps {
  onSelectTool: (tool: Tool) => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({ onSelectTool }) => {
  return (
    <div className="h-full flex flex-col">
      <header className="mb-6">
        <div className="flex items-center space-x-2">
            <SparklesIcon className="w-8 h-8 text-brand-accent" />
            <h1 className="text-3xl font-bold text-gray-900">Sparks</h1>
        </div>
        <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">3 / 15</p>
            <div className="w-full mx-4 bg-gray-200 rounded-full h-1.5">
                <div className="bg-brand-accent h-1.5 rounded-full" style={{ width: '20%' }}></div>
            </div>
             <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">View By:</span>
                <select className="text-sm font-semibold border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option>Default</option>
                    <option>Popular</option>
                    <option>Newest</option>
                </select>
            </div>
        </div>
      </header>
      <div className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {TOOLS.map(tool => (
            <ToolCard key={tool.id} tool={tool} onSelect={() => onSelectTool(tool)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPanel;
