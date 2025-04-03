import React from 'react';
import { Task, TaskPriority } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onDragStart?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  'data-task-id'?: string;
}

export function TaskCard({ task, onDragStart, onEdit, 'data-task-id': dataTaskId }: TaskCardProps) {
  // Priority badge styles
  const priorityStyles: Record<TaskPriority, string> = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  // Handle drag start event
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('taskStatus', task.status);

    // Add a ghost image if needed
    // const ghostEl = document.createElement('div');
    // ghostEl.classList.add('bg-blue-100', 'p-2', 'rounded');
    // ghostEl.textContent = task.title;
    // document.body.appendChild(ghostEl);
    // e.dataTransfer.setDragImage(ghostEl, 0, 0);
    // setTimeout(() => document.body.removeChild(ghostEl), 0);

    // Call the provided onDragStart callback
    if (onDragStart) {
      onDragStart(task.id);
    }
  };

  // Handle task edit
  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-md p-3 shadow-sm hover:shadow transition-shadow cursor-pointer flex flex-col"
      draggable="true"
      onDragStart={handleDragStart}
      onClick={handleEdit}
      data-task-id={dataTaskId || task.id}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-900 truncate">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
        {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
        <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
