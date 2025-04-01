import React, { useState } from 'react';
import { Task, Project } from '@/types';
import { TaskCard } from '@/ui/features/task_card/task_card';
import { TaskModal } from '@/ui/features/task_modal/task_modal';

interface ProjectBoardProps {
  project: Project;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskEdit: (task: Task) => void;
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({
  project,
  onTaskUpdate,
  onTaskEdit
}) => {
  // State management for tasks, drag operations, and modals
  const [tasks, setTasks] = useState<Task[]>(project.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Task filtering by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  // Handle status change (drag-and-drop)
  const handleStatusChange = (taskId: string, status: Task['status']) => {
    onTaskUpdate(taskId, { status });
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status, updatedAt: new Date().toISOString().split('T')[0] }
          : task
      )
    );
  };

  // Handle task editing
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Handle task save
  const handleSaveTask = (updatedTask: Task) => {
    onTaskEdit(updatedTask);
    setTasks(prev =>
      prev.map(task =>
        task.id === updatedTask.id
          ? { ...updatedTask, updatedAt: new Date().toISOString().split('T')[0] }
          : task
      )
    );
    setIsModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {/* Todo Column */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Todo ({todoTasks.length})</h2>
        <div className="flex-1 overflow-y-auto">
          {todoTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={(status) => handleStatusChange(task.id, status)}
              onEdit={() => handleEditTask(task)}
            />
          ))}
          {todoTasks.length === 0 && (
            <div className="text-gray-400 text-center p-4">No tasks</div>
          )}
        </div>
      </div>

      {/* In Progress Column */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">In Progress ({inProgressTasks.length})</h2>
        <div className="flex-1 overflow-y-auto">
          {inProgressTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={(status) => handleStatusChange(task.id, status)}
              onEdit={() => handleEditTask(task)}
            />
          ))}
          {inProgressTasks.length === 0 && (
            <div className="text-gray-400 text-center p-4">No tasks</div>
          )}
        </div>
      </div>

      {/* Done Column */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Done ({doneTasks.length})</h2>
        <div className="flex-1 overflow-y-auto">
          {doneTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={(status) => handleStatusChange(task.id, status)}
              onEdit={() => handleEditTask(task)}
            />
          ))}
          {doneTasks.length === 0 && (
            <div className="text-gray-400 text-center p-4">No tasks</div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};
