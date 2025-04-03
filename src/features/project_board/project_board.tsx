import React, { useState, useRef, useEffect } from 'react';
import { Task, Project, TaskStatus } from '@/types';
import { TaskCard } from '@/ui/features/task_card/task_card';
import { TaskModal } from '@/ui/features/task_modal/task_modal';

type ProjectBoardProps = {
  project: Project;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskEdit: (task: Task) => void;
};

export const ProjectBoard: React.FC<ProjectBoardProps> = ({
  project,
  onTaskUpdate,
  onTaskEdit
}) => {
  // State management for tasks, drag operations, and modals
  const [tasks, setTasks] = useState<Task[]>(project.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(null);

  // Refs for drop targets (columns)
  const todoColumnRef = useRef<HTMLDivElement>(null);
  const inProgressColumnRef = useRef<HTMLDivElement>(null);
  const doneColumnRef = useRef<HTMLDivElement>(null);

  // Task filtering by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  // Filter out any 'deleted' tasks (these shouldn't be rendered)
  useEffect(() => {
    // Remove any tasks with 'deleted' status from the local state
    setTasks(prev => prev.filter(task => task.status !== 'deleted'));
  }, [project.tasks]);

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

  // Handle task delete
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));

    // Pass the deletion to the parent component
    onTaskUpdate(taskId, { status: 'deleted' as TaskStatus });
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

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    setDraggedOverColumn(status);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);

    const taskId = e.dataTransfer.getData('taskId');
    const sourceStatus = e.dataTransfer.getData('taskStatus') as TaskStatus;

    // Only update if the status actually changed
    if (sourceStatus !== targetStatus) {
      handleStatusChange(taskId, targetStatus);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  // Helper to get column class based on drag state
  const getColumnClass = (status: TaskStatus) => {
    return `bg-white rounded-lg shadow p-4 flex flex-col ${
      draggedOverColumn === status
        ? 'ring-2 ring-blue-500 ring-opacity-70'
        : ''
    }`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {/* Todo Column */}
      <div
        ref={todoColumnRef}
        className={getColumnClass('todo')}
        onDragOver={(e) => handleDragOver(e, 'todo')}
        onDrop={(e) => handleDrop(e, 'todo')}
        onDragLeave={handleDragLeave}
        data-column="todo"
      >
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
      <div
        ref={inProgressColumnRef}
        className={getColumnClass('in-progress')}
        onDragOver={(e) => handleDragOver(e, 'in-progress')}
        onDrop={(e) => handleDrop(e, 'in-progress')}
        onDragLeave={handleDragLeave}
        data-column="in-progress"
      >
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
      <div
        ref={doneColumnRef}
        className={getColumnClass('done')}
        onDragOver={(e) => handleDragOver(e, 'done')}
        onDrop={(e) => handleDrop(e, 'done')}
        onDragLeave={handleDragLeave}
        data-column="done"
      >
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
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
};
