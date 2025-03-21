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

// CSS classes for drag and drop operations
export const dropTargetStyles = {
  highlightColumn: 'drop-target-highlight',
  insertAbove: 'insert-above',
  insertBelow: 'insert-below',
  placeholder: 'task-card-placeholder',
  dragging: 'dragging',
  touchDragging: 'touch-dragging',
};

// Add these styles to your global CSS or index.css:
/*
.drop-target-highlight {
  background-color: rgba(59, 130, 246, 0.1);
  box-shadow: inset 0 0 0 2px rgb(59, 130, 246);
}

.task-card.insert-above {
  border-top: 2px solid rgb(59, 130, 246);
  margin-top: -2px;
}

.task-card.insert-below {
  border-bottom: 2px solid rgb(59, 130, 246);
  margin-bottom: -2px;
}

.task-card-placeholder {
  border: 2px dashed #9ca3af;
  border-radius: 8px;
  background-color: #f3f4f6;
  transition: all 0.2s ease;
}
*/
