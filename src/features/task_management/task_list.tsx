import React from 'react';
import { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  viewMode?: 'list' | 'grid';
}

// Priority color mappings
const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  viewMode = 'list',
}) => {
  const handleEdit = (task: Task) => {
    onEdit(task);
  };

  const handleDelete = (taskId: string) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(taskId);
    }
  };

  // Empty state handling
  if (tasks.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No tasks found</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
      {tasks.map(task => (
        <div
          key={task.id}
          className="bg-white p-4 rounded-lg shadow"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{task.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(task)}
                className="text-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">{task.description}</div>
          <div className="mt-4 flex justify-between items-center text-xs">
            <span className={`px-2 py-1 rounded ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span>{task.assignee || 'Unassigned'}</span>
            <span>{task.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
