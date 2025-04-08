---
description: Task Manager Component Specification
type: component
---

<specification>
  <meta>
    <title>Task Manager Component</title>
    <description>The central orchestrating component for task management, coordinating task listing, filtering, and editing functionality.</description>
    <created-at utc-timestamp="1712678400">April 9, 2024, 10:00 AM EDT</created-at>
    <last-updated utc-timestamp="1712764800">April 10, 2024, 10:00 AM EDT</last-updated>
    <applies-to>
      <file-matcher glob="src/features/task_management/task_manager.tsx">Task Manager Component Implementation</file-matcher>
    </applies-to>
  </meta>

  <overview>
    <description>The TaskManager component serves as the central orchestrator for the task management feature. It coordinates the interaction between task listing, filtering, and task editing capabilities.</description>
    <responsibility>Provide a unified interface for managing tasks within the application</responsibility>
  </overview>

  <requirements>
    <functional-requirements>
      <requirement priority="high">
        <description>Provide a central interface for task management</description>
      </requirement>
      <requirement priority="high">
        <description>Display tasks with filtering options</description>
      </requirement>
      <requirement priority="high">
        <description>Support task creation</description>
      </requirement>
      <requirement priority="high">
        <description>Support task editing</description>
      </requirement>
      <requirement priority="high">
        <description>Support task deletion</description>
      </requirement>
      <requirement priority="medium">
        <description>Handle task status changes</description>
      </requirement>
      <requirement priority="medium">
        <description>Provide sorting capabilities</description>
      </requirement>
      <requirement priority="medium">
        <description>Include task detail view</description>
      </requirement>
      <requirement priority="high">
        <description>Implement task filtering by multiple criteria</description>
      </requirement>
      <requirement priority="high">
        <description>Ensure full accessibility of all task management features</description>
      </requirement>
    </functional-requirements>

    <technical-requirements>
      <requirement priority="high">
        <description>Implement with React and TypeScript</description>
      </requirement>
      <requirement priority="high">
        <description>Use proper TypeScript typing for all data structures</description>
      </requirement>
      <requirement priority="high">
        <description>Implement responsive layout supporting desktop and mobile views</description>
      </requirement>
      <requirement priority="high">
        <description>Implement efficient state management for tasks</description>
      </requirement>
      <requirement priority="high">
        <description>Handle API integration for task data</description>
      </requirement>
      <requirement priority="high">
        <description>Implement proper error handling for API operations</description>
      </requirement>
      <requirement priority="high">
        <description>Ensure strong accessibility support for all task interactions</description>
      </requirement>
      <requirement priority="medium">
        <description>Optimize rendering performance for large task lists</description>
      </requirement>
      <requirement priority="high">
        <description>Use React hooks for state management</description>
      </requirement>
      <requirement priority="high">
        <description>Use context API for sharing task state if needed</description>
      </requirement>
      <requirement priority="high">
        <description>Implement comprehensive keyboard navigation</description>
      </requirement>
      <requirement priority="high">
        <description>Use Tailwind CSS for styling</description>
      </requirement>
    </technical-requirements>

    <behavioral-expectations>
      <expectation priority="high">
        <description>Task changes should immediately update the UI</description>
      </expectation>
      <expectation priority="high">
        <description>Task filtering should instantly filter the task list</description>
      </expectation>
      <expectation priority="high">
        <description>Error states should be clearly communicated to users</description>
      </expectation>
      <expectation priority="high">
        <description>Loading states should be indicated with appropriate spinners or skeletons</description>
      </expectation>
      <expectation priority="high">
        <description>Creating a task should show confirmation and add it to the list</description>
      </expectation>
      <expectation priority="high">
        <description>Editing a task should update it in the list immediately</description>
      </expectation>
      <expectation priority="high">
        <description>Deleting a task should prompt for confirmation</description>
      </expectation>
      <expectation priority="high">
        <description>Task operations should provide appropriate feedback</description>
      </expectation>
      <expectation priority="high">
        <description>Keyboard users should be able to access all task management functions</description>
      </expectation>
      <expectation priority="high">
        <description>Screen readers should announce all task changes appropriately</description>
      </expectation>
    </behavioral-expectations>
  </requirements>

  <interfaces>
    <interface type="props">
      <definition><![CDATA[type TaskManagerProps = {
  initialTasks?: Task[];
  onTaskCreate?: (task: Omit<Task, 'id'>) => Promise<Task>;
  onTaskUpdate?: (task: Task) => Promise<Task>;
  onTaskDelete?: (taskId: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
};]]></definition>
    </interface>
    <interface type="state">
      <definition><![CDATA[type TaskFilters = {
  status?: Task['status'];
  priority?: Task['priority'];
  assignee?: string;
};

type TaskManagerState = {
  tasks: Task[];
  filteredTasks: Task[];
  filters: TaskFilters;
  activeTaskId: string | null;
  isCreating: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  pendingChanges: boolean;
};]]></definition>
    </interface>
  </interfaces>

  <implementation>
    <files>
      <file path="src/features/task_management/task_manager.tsx" action="create">
        <changes>Create the TaskManager component implementation</changes>
        <example><![CDATA[import React, { useState, useEffect, useCallback } from 'react';
import { TaskList } from './task_list';
import { TaskFilter } from './task_filter';
import { TaskActions } from './task_actions';
import { TaskEditor } from './task_editor';
import type { Task } from '../../types';

export type TaskManagerProps = {
  initialTasks?: Task[];
  onTaskCreate?: (task: Omit<Task, 'id'>) => Promise<Task>;
  onTaskUpdate?: (task: Task) => Promise<Task>;
  onTaskDelete?: (taskId: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
};

export const TaskManager: React.FC<TaskManagerProps> = ({
  initialTasks = [],
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  isLoading = false,
  error,
}) => {
  // State management
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState({
    status: undefined,
    priority: undefined,
    assignee: undefined,
  });
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [operationSuccess, setOperationSuccess] = useState<string | null>(null);

  // Update tasks when initialTasks prop changes
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  // Filter tasks based on current filters
  const filteredTasks = useCallback(() => {
    return tasks.filter(task => {
      // Filter by status if set
      if (filters.status && task.status !== filters.status) {
        return false;
      }

      // Filter by priority if set
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // Filter by assignee if set
      if (filters.assignee && task.assignee !== filters.assignee) {
        return false;
      }

      return true;
    });
  }, [tasks, filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Handle task selection
  const handleTaskSelect = (taskId) => {
    setActiveTaskId(prev => prev === taskId ? null : taskId);
  };

  // Create new task
  const handleCreateTask = async (taskData) => {
    if (!onTaskCreate) return;

    try {
      setOperationError(null);
      const newTask = await onTaskCreate(taskData);
      setTasks(prev => [...prev, newTask]);
      setIsCreating(false);
      setOperationSuccess('Task created successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setOperationSuccess(null), 3000);
    } catch (err) {
      setOperationError(`Failed to create task: ${err.message || 'Unknown error'}`);
    }
  };

  // Update existing task
  const handleUpdateTask = async (taskData) => {
    if (!onTaskUpdate) return;

    try {
      setOperationError(null);
      const updatedTask = await onTaskUpdate(taskData);
      setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
      setIsEditing(false);
      setActiveTaskId(null);
      setOperationSuccess('Task updated successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setOperationSuccess(null), 3000);
    } catch (err) {
      setOperationError(`Failed to update task: ${err.message || 'Unknown error'}`);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (!onTaskDelete) return;

    try {
      setOperationError(null);
      await onTaskDelete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setActiveTaskId(null);
      setOperationSuccess('Task deleted successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setOperationSuccess(null), 3000);
    } catch (err) {
      setOperationError(`Failed to delete task: ${err.message || 'Unknown error'}`);
    }
  };

  // Compute available assignees for filtering
  const availableAssignees = [...new Set(tasks.map(task => task.assignee).filter(Boolean))];

  return (
    <div className="p-4 bg-white rounded-lg shadow" role="region" aria-label="Task management">
      {/* Error display */}
      {(error || operationError) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md" role="alert">
          {error || operationError}
        </div>
      )}

      {/* Success message */}
      {operationSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md" role="status">
          {operationSuccess}
        </div>
      )}

      {/* Task filter section */}
      <div className="mb-4">
        <TaskFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          availableAssignees={availableAssignees}
        />
      </div>

      {/* Task actions */}
      <div className="mb-4">
        <TaskActions
          onCreateTask={() => setIsCreating(true)}
          onEditTask={() => activeTaskId && setIsEditing(true)}
          onDeleteTask={() => activeTaskId && handleDeleteTask(activeTaskId)}
          isTaskSelected={Boolean(activeTaskId)}
        />
      </div>

      {/* Task list */}
      <div className="mb-4">
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Reference for create button (to return focus after modal closes)
  const createButtonRef = useRef<HTMLButtonElement>(null);

  // Extract available assignees for filter dropdown
  const availableAssignees = useMemo(() => {
    return Array.from(new Set(tasks.map(task => task.assignee).filter(Boolean) as string[]));
  }, [tasks]);

  // Filter and sort implementation
  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, filters);
  }, [tasks, filters]);

  // Update parent component when tasks change
  useEffect(() => {
    onTasksChange(tasks);
  }, [tasks, onTasksChange]);

  // Show status message temporarily
  const showStatusMessage = (message: string) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Task operation handlers
  const handleCreateTask = () => {
    const newTask = createTask();
    setSelectedTask(newTask);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask({...task});
    setIsModalOpen(true);
  };

  const handleSaveTask = (updatedTask: Task) => {
    // Check if this is a new or existing task
    const isNewTask = !tasks.some(task => task.id === updatedTask.id);

    if (isNewTask) {
      setTasks(prevTasks => [...prevTasks, updatedTask]);
      showStatusMessage('Task created successfully');
    } else {
      setTasks(prevTasks =>
        prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
      );
      showStatusMessage('Task updated successfully');
    }

    setIsModalOpen(false);
    // Return focus to create button after modal closes
    setTimeout(() => createButtonRef.current?.focus(), 0);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      showStatusMessage('Task deleted successfully');
    }
  };

  const handleFilterChange = (newFilters: Partial<TaskFilters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Return focus to create button after modal closes
    setTimeout(() => createButtonRef.current?.focus(), 0);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Task Management</h2>
        <button
          ref={createButtonRef}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

      <TaskList
        tasks={filteredTasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

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
          onDelete={selectedTask.id !== crypto.randomUUID() ? handleDeleteTask : undefined}
        />
      )}
    </div>
  );
};]]></example>
      </file>
    </files>

    <dependencies>
      <dependency type="external">react for UI components</dependency>
      <dependency type="internal">Task and related types from @/types</dependency>
      <dependency type="internal">TaskList component from ./task_list</dependency>
      <dependency type="internal">TaskFilter component from ./task_filter</dependency>
      <dependency type="internal">TaskModal component from @/ui/features/task_modal/task_modal</dependency>
      <dependency type="internal">Task action utilities from ./task_actions</dependency>
    </dependencies>
  </implementation>

  <references>
    <reference href="./task_management.package_specs.md">Task Management Features</reference>
    <reference href="./task_list.specs.md">Task List Component</reference>
    <reference href="./task_filter.specs.md">Task Filter Component</reference>
    <reference href="./task_actions.specs.md">Task Actions Utility</reference>
    <reference href="../../ui/features/task_modal/task_modal.specs.md">Task Modal Component</reference>
  </references>
</specification>
