import React from 'react';
import { Clock } from 'lucide-react';

interface DueDateProps {
  date: string;
}

export const DueDate: React.FC<DueDateProps> = ({ date }) => {
  if (!date) return null;

  return (
    <span className="text-xs text-gray-600 flex items-center truncate max-w-[120px]">
      <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
      <span className="truncate">{new Date(date).toLocaleDateString()}</span>
    </span>
  );
};
