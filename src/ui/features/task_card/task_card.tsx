import React, { useState } from 'react';
import { Clock, Flag, Edit2 } from 'lucide-react';
import { Task } from '@/types_ts';
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
  task: initialTask,
  onStatusChange,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(initialTask);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
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
        className={`p-4 rounded-lg shadow-sm ${statusColors[task.status]} transition-all hover:shadow-md cursor-move group`}
        draggable="true"
        onDragStart={handleDragStart}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800">{task.title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(e.target.value as Task['status'])}
              className="text-sm rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>
            <Flag className="w-3 h-3 inline mr-1" />
            {task.priority}
          </span>
          {task.dueDate && (
            <span className="text-xs text-gray-600 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          {task.assignee && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
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
