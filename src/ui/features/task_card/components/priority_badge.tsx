import React from 'react';
import { Flag } from 'lucide-react';
import { Task } from '@/types';

interface PriorityBadgeProps {
  priority: Task['priority'];
}

// Priority color mapping
const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[priority]}`}>
      <Flag className="w-3 h-3 inline mr-1" />
      {priority}
    </span>
  );
};
