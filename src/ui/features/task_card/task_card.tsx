import React, { useState, useRef, useEffect } from 'react';
import { Clock, Flag, GripVertical } from 'lucide-react';
import { Task } from '@/types';
import { TaskModal } from '@/ui/features/task_modal/task_modal';

type TaskCardProps = {
  task: Task;
  onStatusChange: (status: Task['status']) => void;
  onEdit: (task: Task) => void;
  columnTasks?: Task[];
  onReorder?: (draggedTaskId: string, targetTaskId: string) => void;
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
  columnTasks,
  onReorder,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [touchDragging, setTouchDragging] = useState(false);
  const [scrollInterval, setScrollInterval] = useState<number | null>(null);

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

  // Clean up auto-scroll on unmount
  useEffect(() => {
    return () => {
      if (scrollInterval) {
        window.clearInterval(scrollInterval);
      }
    };
  }, [scrollInterval]);

  // Handle auto-scrolling during drag
  const handleAutoScroll = (e: React.DragEvent | React.TouchEvent | MouseEvent) => {
    if (scrollInterval) {
      window.clearInterval(scrollInterval);
      setScrollInterval(null);
    }

    let clientY: number;
    if ('touches' in e && e.touches[0]) {
      clientY = e.touches[0].clientY;
    } else if ('clientY' in e) {
      clientY = e.clientY;
    } else {
      return;
    }

    const windowHeight = window.innerHeight;
    const scrollThreshold = 100;
    const scrollSpeed = 10;

    if (clientY < scrollThreshold) {
      // Scroll up
      const interval = window.setInterval(() => {
        window.scrollBy(0, -scrollSpeed);
      }, 20);
      setScrollInterval(interval);
    } else if (clientY > windowHeight - scrollThreshold) {
      // Scroll down
      const interval = window.setInterval(() => {
        window.scrollBy(0, scrollSpeed);
      }, 20);
      setScrollInterval(interval);
    }
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

    // Clear any auto-scroll that might be happening
    if (scrollInterval) {
      window.clearInterval(scrollInterval);
      setScrollInterval(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    handleAutoScroll(e);
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle touch events for mobile drag and drop
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable dragging when using the grip handle
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setTouchDragging(true);
      // Add any custom touch drag initialization here
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchDragging) {
      handleAutoScroll(e);
      // Implement custom touch dragging behavior here
    }
  };

  const handleTouchEnd = () => {
    setTouchDragging(false);
    if (scrollInterval) {
      window.clearInterval(scrollInterval);
      setScrollInterval(null);
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => onEdit(task)}
      data-task-id={task.id}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 truncate mr-2">{task.title}</h3>
        <div className="flex items-center">
          <span className={`text-xs rounded-full px-2 py-1 font-medium ${priorityColors[task.priority]} mr-2`}>
            {task.priority}
          </span>
          <div className="drag-handle touch-manipulation cursor-grab md:hidden">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </div>
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

      {/* Placeholder element - this will be positioned absolutely and shown during drag operations */}
      {isDragging && (
        <div
          className="absolute pointer-events-none border-2 border-blue-500 rounded-lg bg-blue-50 opacity-50"
          style={{
            width: cardRef.current?.offsetWidth || 'auto',
            height: cardRef.current?.offsetHeight || 'auto',
          }}
        />
      )}
    </div>
  );
};
