import React, { useState, useRef, useEffect } from 'react';
import { Clock, Flag, Edit2, GripVertical } from 'lucide-react';
import { Task } from '@/types';
import { TaskModal } from '@/ui/features/task_modal/task_modal';

interface TaskCardProps {
  task: Task;
  onStatusChange: (status: Task['status']) => void;
  onEdit: (task: Task) => void;
  columnTasks?: Task[]; // Tasks in the current column for reordering
  onReorder?: (draggedTaskId: string, targetTaskId: string) => void; // Callback for reordering
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
  task: initialTask,
  onStatusChange,
  onEdit,
  columnTasks = [],
  onReorder,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(initialTask);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  // Detect if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // For traditional drag events
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    setIsDragging(true);

    // Add some visual feedback
    if (e.dataTransfer.setDragImage && cardRef.current) {
      e.dataTransfer.setDragImage(cardRef.current, 20, 20);
    }

    // Add a status text
    if (cardRef.current) {
      cardRef.current.setAttribute('aria-grabbed', 'true');
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    if (cardRef.current) {
      cardRef.current.setAttribute('aria-grabbed', 'false');
    }
  };

  // For touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only handle touch on the drag handle for mobile
    if (!dragHandleRef.current?.contains(e.target as Node)) {
      return;
    }

    // Store original position for calculation
    if (cardRef.current) {
      const touch = e.touches[0];
      cardRef.current.dataset.touchStartX = touch.clientX.toString();
      cardRef.current.dataset.touchStartY = touch.clientY.toString();

      // Add feedback
      cardRef.current.classList.add('touch-dragging');
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // If we weren't dragging from the handle, ignore touch move
    if (!cardRef.current?.classList.contains('touch-dragging')) {
      return;
    }

    // Prevent scrolling while dragging
    if (cardRef.current && cardRef.current.dataset.touchStartX) {
      e.preventDefault();
      setIsDragging(true);

      // Get the card element and touch data
      const card = cardRef.current;
      const touch = e.touches[0];

      // Calculate movement
      const startX = parseInt(card.dataset.touchStartX || '0');
      const startY = parseInt(card.dataset.touchStartY || '0');
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // Move the element (purely visual, will snap back on release)
      card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      card.style.opacity = '0.8';
      card.style.zIndex = '100';

      // Create highlight effect for potential drop targets
      const elementsAtTouch = document.elementsFromPoint(touch.clientX, touch.clientY);

      // Look for both columns and other tasks
      const dropColumn = elementsAtTouch.find(el =>
        el.classList.contains('drop-column')
      ) as HTMLElement;

      const targetTaskCard = elementsAtTouch.find(el =>
        el.classList.contains('task-card') &&
        el !== card &&
        !el.contains(card) &&
        !card.contains(el)
      ) as HTMLElement;

      // Remove all highlights
      document.querySelectorAll('.drop-column, .task-card').forEach(el => {
        el.classList.remove('drop-target-highlight', 'insert-above', 'insert-below');
      });

      // Add highlight to the column we're over
      if (dropColumn) {
        dropColumn.classList.add('drop-target-highlight');
      }

      // If we're over another task card, highlight it for reordering
      if (targetTaskCard && onReorder) {
        targetTaskCard.classList.add('drop-target-highlight');

        // Determine if we're in the top or bottom half of the target card
        const rect = targetTaskCard.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;

        if (touch.clientY < midY) {
          targetTaskCard.classList.add('insert-above');
        } else {
          targetTaskCard.classList.add('insert-below');
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (cardRef.current) {
      const card = cardRef.current;
      setIsDragging(false);

      // Reset styles
      card.style.transform = '';
      card.style.opacity = '';
      card.style.zIndex = '';
      card.classList.remove('touch-dragging');

      // Find the element we're over
      const touch = e.changedTouches[0];
      const elementsAtTouch = document.elementsFromPoint(touch.clientX, touch.clientY);

      // Check if we're over another task card first (for reordering)
      const targetTaskCard = elementsAtTouch.find(el =>
        el.classList.contains('task-card') &&
        el !== card &&
        !el.contains(card) &&
        !card.contains(el)
      ) as HTMLElement;

      // If we're over another task card and have a reorder callback
      if (targetTaskCard && onReorder && targetTaskCard.dataset.taskId) {
        onReorder(task.id, targetTaskCard.dataset.taskId);
      } else {
        // Otherwise check for column drops
        const dropColumn = elementsAtTouch.find(el =>
          el.classList.contains('drop-column')
        ) as HTMLElement;

        if (dropColumn && dropColumn.dataset.status) {
          // We found a valid drop target
          onStatusChange(dropColumn.dataset.status as Task['status']);
        }
      }

      // Remove all highlights
      document.querySelectorAll('.drop-column, .task-card').forEach(el => {
        el.classList.remove('drop-target-highlight', 'insert-above', 'insert-below');
      });

      // Clean up
      delete card.dataset.touchStartX;
      delete card.dataset.touchStartY;
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTask(updatedTask);
  };

  const handleSave = (updatedTask: Task) => {
    setTask(updatedTask);
    onEdit(updatedTask);
    setIsEditing(false);
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`task-card p-3 md:p-4 rounded-lg shadow-sm ${statusColors[task.status]} transition-all hover:shadow-md cursor-move group ${isDragging ? 'opacity-60' : ''}`}
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-grabbed="false"
        data-task-id={task.id}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
          <div className="flex items-start gap-2">
            {isMobile && (
              <div
                ref={dragHandleRef}
                className="touch-drag-handle mt-1 text-gray-400 transition-colors hover:text-gray-600 active:text-blue-500"
                aria-label="Drag handle"
              >
                <GripVertical className="w-4 h-4" />
              </div>
            )}
            <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2">{task.title}</h3>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsEditing(true)}
              className="opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(e.target.value as Task['status'])}
              className="text-xs sm:text-sm rounded border-gray-300 focus:ring-2 focus:ring-blue-500 py-0.5"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 md:line-clamp-3">
          {task.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
            <Flag className="w-3 h-3 inline mr-1" />
            {task.priority}
          </span>
          {task.dueDate && (
            <span className="text-xs text-gray-600 flex items-center truncate max-w-[120px]">
              <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{new Date(task.dueDate).toLocaleDateString()}</span>
            </span>
          )}
          {task.assignee && (
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded truncate max-w-[120px]">
              {task.assignee}
            </span>
          )}
        </div>
      </div>

      {isEditing && (
        <TaskModal
          task={task}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          onChange={handleTaskUpdate}
        />
      )}
    </>
  );
};
