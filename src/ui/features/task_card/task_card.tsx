import React, { useState } from 'react';
import { Clock, Flag } from 'lucide-react';
import { Task } from '@/types';
import { TaskModal } from '@/ui/features/task_modal/task_modal';

interface TaskCardProps {
  task: Task;
  onStatusChange: (status: Task['status']) => void;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusColors = {
  'todo': 'bg-gray-100',
  'in-progress': 'bg-purple-100',
  'done': 'bg-green-100',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onEdit,
}) => {
  // Format the due date for display
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Check if a due date is approaching or past
  const isDueSoon = (dateString?: string) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff <= 3 && daysDiff >= 0;
  };

  const isPastDue = (dateString?: string) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    return dueDate < today;
  };

  // Handle drag start to initiate drag-and-drop
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';

    // Add dragging class to the element for visual feedback
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add('dragging');
    }

    // Create a custom drag image if needed
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.width = `${e.currentTarget.clientWidth}px`;
    dragImage.style.opacity = '0.7';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 20, 20);

    // Clean up the drag image after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  // Clear dragging state when drag ends
  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('dragging');
    }
  };

  // Determine the color class for the due date
  const getDueDateColorClass = () => {
    if (isPastDue(task.dueDate)) return 'text-red-600';
    if (isDueSoon(task.dueDate)) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-3 mb-2 border-l-4 ${
        statusColors[task.status]
      } cursor-pointer hover:shadow-md transition-shadow`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onEdit(task)}
      data-task-id={task.id}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 truncate mr-2">{task.title}</h3>
        <span className={`text-xs rounded-full px-2 py-1 font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

      <div className="flex justify-between text-xs">
        {task.assignee && (
          <div className="text-gray-600 truncate flex-1">
            {task.assignee}
          </div>
        )}

        {task.dueDate && (
          <div className={`flex items-center ${getDueDateColorClass()}`}>
            <Clock className="w-3 h-3 mr-1" />
            <span>{formatDueDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
