import React, { useState, useRef } from 'react';
import { Clock, Flag } from 'lucide-react';
import { Task } from '@/types';
import { TaskModal } from '@/ui/features/task_modal/task_modal';

type TaskCardProps = {
  task: Task;
  onStatusChange: (status: Task['status']) => void;
  onEdit: (task: Task) => void;
};

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
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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
    e.dataTransfer.setData('taskStatus', task.status);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);

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
    setIsDragging(false);
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('dragging');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Determine the color class for the due date
  const getDueDateColorClass = () => {
    if (isPastDue(task.dueDate)) return 'text-red-600';
    if (isDueSoon(task.dueDate)) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-lg shadow-sm p-3 mb-2 border-l-4 ${
        statusColors[task.status]
      } cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onClick={() => onEdit(task)}
      data-task-id={task.id}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{task.description}</p>

      <div className="flex justify-between text-xs mt-2">
        <div className="flex items-center">
          {task.assignee && (
            <span className="text-gray-500 mr-2">
              {task.assignee}
            </span>
          )}
        </div>

        <div className="flex items-center">
          {task.dueDate && (
            <span className={`flex items-center ${getDueDateColorClass()}`}>
              <Clock className="h-3 w-3 mr-1" />
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
