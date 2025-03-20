import { Task } from '@/types';

// Status colors for task cards
export const statusColors: Record<Task['status'], string> = {
  'todo': 'bg-gray-100',
  'in-progress': 'bg-purple-100',
  'done': 'bg-green-100',
};

// Priority colors for badges
export const priorityColors: Record<Task['priority'], string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

// Utility function to get task card styles based on status
export function getTaskCardStyle(status: Task['status'], isDragging: boolean = false) {
  return `task-card p-3 md:p-4 rounded-lg shadow-sm ${statusColors[status]} transition-all hover:shadow-md cursor-move group ${isDragging ? 'opacity-60' : ''} select-none`;
}
