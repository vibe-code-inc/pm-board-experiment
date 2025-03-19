import React from 'react';
import { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div key={task.id} className="p-3 border rounded-md">
          <h3 className="font-medium">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
      ))}
    </div>
  );
};
