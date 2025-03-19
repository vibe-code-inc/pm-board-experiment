import React from 'react';
import { Task, Project } from '@/types_ts';
import { TaskCard } from '@/ui/features/task_card/task_card';

interface ProjectBoardProps {
  project: Project;
  onTaskUpdate: (taskId: string, status: Task['status']) => void;
  onTaskEdit: (task: Task) => void;
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({ project, onTaskUpdate, onTaskEdit }) => {
  const columns: { title: string; status: Task['status'] }[] = [
    { title: 'To Do', status: 'todo' },
    { title: 'In Progress', status: 'in-progress' },
    { title: 'Done', status: 'done' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onTaskUpdate(taskId, status);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        <p className="text-gray-600">{project.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.status}
            className="bg-gray-50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            <h2 className="font-semibold text-gray-700 mb-4">{column.title}</h2>
            <div className="space-y-3 min-h-[200px]">
              {project.tasks
                .filter((task) => task.status === column.status)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={(status) => onTaskUpdate(task.id, status)}
                    onEdit={() => onTaskEdit(task)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
