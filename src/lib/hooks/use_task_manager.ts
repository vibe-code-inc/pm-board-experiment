import { useState, useCallback, useMemo, useEffect } from 'react';
import { Task } from '@/types';
import {
  createTask as createTaskUtil,
  updateTask as updateTaskUtil,
  deleteTask as deleteTaskUtil,
  filterTasks,
  sortTasks,
  TaskFilters,
  SortDirection
} from '@/features/task_management/task_actions';

/**
 * Hook for managing tasks with filtering, sorting, and CRUD operations
 * @param initialTasks The initial array of tasks
 * @returns Object containing tasks, operations, filtering and sorting utilities
 */
export function useTaskManager(initialTasks: Task[]) {
  // State for tasks
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // State for filters and sorting
  const [filters, setFilters] = useState<Partial<TaskFilters>>({});
  const [sortField, setSortField] = useState<keyof Task>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // CRUD operations
  const createTask = useCallback((taskData: Partial<Task>) => {
    const newTask = createTaskUtil(taskData);
    setTasks(prevTasks => [...prevTasks, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? updateTaskUtil(task, updates) : task
      )
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => deleteTaskUtil(prevTasks, taskId));
  }, []);

  // Batch operations
  const deleteTasks = useCallback((predicate: (task: Task) => boolean) => {
    setTasks(prevTasks =>
      prevTasks.filter(task => !predicate(task))
    );
  }, []);

  const updateTasks = useCallback((predicate: (task: Task) => boolean, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        predicate(task) ? updateTaskUtil(task, updates) : task
      )
    );
  }, []);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    // First filter
    const filtered = filterTasks(tasks, filters);
    // Then sort
    return sortTasks(filtered, sortField, sortDirection);
  }, [tasks, filters, sortField, sortDirection]);

  // Set sorting
  const setSorting = useCallback((field: keyof Task, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  }, []);

  // Sync with initialTasks if they change (e.g., from a parent component)
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  return {
    // Task data
    tasks,
    filteredTasks,

    // Filter and sort state
    filters,
    sortField,
    sortDirection,

    // CRUD operations
    createTask,
    updateTask,
    deleteTask,
    deleteTasks,
    updateTasks,

    // Filter and sort operations
    setFilters,
    setSorting
  };
}
