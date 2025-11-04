
import React from 'react';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  prompt: string;
}
