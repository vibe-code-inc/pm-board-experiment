import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Task } from '@/types';
import { TaskList } from './task_list';
import { TaskFilter } from './task_filter';
import { TaskModal } from '@/ui/features/task_modal/task_modal';

type TaskFilters = {
  status?: Task['status'];
  priority?: Task['priority'];
  assignee?: string;
}

type TaskManagerProps = {
  initialTasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  initialTasks,
  onTasksChange,
}) => {
  // State for tasks, filters, selected task, modal state
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState<TaskFilters>({
    status: undefined,
    priority: undefined,
    assignee: undefined,
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Reference for create button (to return focus after modal closes)
  const createButtonRef = useRef<HTMLButtonElement>(null);

  // Get unique assignees for filter dropdown
  const availableAssignees = useMemo(() => {
    return Array.from(new Set(tasks.map(task => task.assignee).filter(Boolean))) as string[];
  }, [tasks]);

  // Filter implementation
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Status filter
      if (filters.status && task.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // Assignee filter
      if (filters.assignee && task.assignee !== filters.assignee) {
        return false;
      }

      return true;
    });
  }, [tasks, filters]);

  // Show status message temporarily
  const showStatusMessage = useCallback((message: string) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(null), 3000);
  }, []);

  // Task operation handlers
  const handleCreateTask = useCallback(() => {
    try {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: 'New Task',
        description: 'Task description',
        status: 'todo',
        priority: 'medium',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      setSelectedTask(newTask);
      setIsModalOpen(true);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Failed to create new task. Please try again.');
    }
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    try {
      setSelectedTask(task);
      setIsModalOpen(true);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Failed to edit task. Please try again.');
    }
  }, []);

  const handleDeleteRequest = useCallback((taskId: string) => {
    setTaskToDelete(taskId);
    setIsConfirmDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    try {
      if (!taskToDelete) return;

      const updatedTasks = tasks.filter(task => task.id !== taskToDelete);
      setTasks(updatedTasks);
      onTasksChange(updatedTasks);
      setIsConfirmDeleteOpen(false);
      setTaskToDelete(null);
      setErrorMessage(null);
      showStatusMessage('Task deleted successfully');
    } catch (error) {
      setErrorMessage('Failed to delete task. Please try again.');
    }
  }, [taskToDelete, tasks, onTasksChange, showStatusMessage]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmDeleteOpen(false);
    setTaskToDelete(null);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<TaskFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const handleSaveTask = useCallback((updatedTask: Task) => {
    try {
      let updatedTasks: Task[];

      // Check if it's a new task or an existing one
      const isNewTask = !tasks.some(task => task.id === updatedTask.id);

      if (isNewTask) {
        updatedTasks = [...tasks, updatedTask];
        showStatusMessage('Task created successfully');
      } else {
        updatedTasks = tasks.map(task =>
          task.id === updatedTask.id
            ? { ...updatedTask, updatedAt: new Date().toISOString().split('T')[0] }
            : task
        );
        showStatusMessage('Task updated successfully');
      }

      setTasks(updatedTasks);
      onTasksChange(updatedTasks);
      setIsModalOpen(false);

      // Return focus to create button after modal closes
      setTimeout(() => createButtonRef.current?.focus(), 0);
    } catch (error) {
      setErrorMessage('Failed to save task. Please try again.');
    }
  }, [tasks, onTasksChange, showStatusMessage]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isModalOpen) {
        setIsModalOpen(false);
      }
      if (isConfirmDeleteOpen) {
        setIsConfirmDeleteOpen(false);
        setTaskToDelete(null);
      }
    }
  }, [isModalOpen, isConfirmDeleteOpen]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    // Return focus to create button after modal closes
    setTimeout(() => createButtonRef.current?.focus(), 0);
  }, []);

  return (
    <div
      className="flex flex-col space-y-4"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Task management"
    >
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p>{errorMessage}</p>
          <button
            className="ml-2 text-red-700 underline"
            onClick={() => setErrorMessage(null)}
            aria-label="Dismiss error message"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Task Management</h2>
        <button
          ref={createButtonRef}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={handleCreateTask}
          aria-label="Create new task"
        >
          New Task
        </button>
      </div>

      <TaskFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        availableAssignees={availableAssignees}
      />

      {filteredTasks.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
          <p className="text-gray-500">No tasks match your current filters.</p>
          {Object.values(filters).some(value => value !== undefined) && (
            <button
              className="mt-2 text-blue-500 underline"
              onClick={() => handleFilterChange({
                status: undefined,
                priority: undefined,
                assignee: undefined
              })}
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteRequest}
        />
      )}

      {statusMessage && (
        <div
          className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md"
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </div>
      )}

      {selectedTask && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          task={selectedTask}
          onSave={handleSaveTask}
          onDelete={handleDeleteRequest}
        />
      )}

      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
