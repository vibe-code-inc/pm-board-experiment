import { Task, TaskStatus, TaskPriority } from '@/types';

/**
 * Type for task filters
 */
export type TaskFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  search?: string;
};

/**
 * Type for validation errors
 */
export type ValidationErrors = Record<string, string> | null;

/**
 * Type for sorting direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Creates a new task with default values and the provided overrides
 * @param taskData Partial task data to override defaults
 * @returns A new task object
 */
export const createTask = (taskData: Partial<Task> = {}): Task => {
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    createdAt: now,
    updatedAt: now,
    ...taskData,
  };
};

/**
 * Validates task data and returns any validation errors
 * @param task Task to validate
 * @returns Object with validation errors or null if valid
 */
export const validateTask = (task: Task): ValidationErrors => {
  const errors: Record<string, string> = {};

  if (!task.title.trim()) {
    errors.title = 'Title is required';
  } else if (task.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  if (!task.description.trim()) {
    errors.description = 'Description is required';
  }

  if (!['todo', 'in-progress', 'done'].includes(task.status)) {
    errors.status = 'Invalid status value';
  }

  if (!['low', 'medium', 'high'].includes(task.priority)) {
    errors.priority = 'Invalid priority value';
  }

  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.dueDate = 'Invalid date format';
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * Updates a task with new values
 * @param task Original task
 * @param updates Partial updates to apply
 * @returns New task object with updates applied
 */
export const updateTask = (task: Task, updates: Partial<Task>): Task => {
  return {
    ...task,
    ...updates,
    // Ensure updatedAt is always refreshed
    updatedAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
  };
};

/**
 * Updates multiple tasks that match a predicate function
 * @param tasks Array of original tasks
 * @param predicate Function to determine which tasks to update
 * @param updates Partial updates to apply
 * @returns New array with updated tasks
 */
export const updateTasks = (
  tasks: Task[],
  predicate: (task: Task) => boolean,
  updates: Partial<Task>
): Task[] => {
  return tasks.map(task =>
    predicate(task) ? updateTask(task, updates) : task
  );
};

/**
 * Deletes a task from an array of tasks
 * @param tasks Array of tasks
 * @param taskId ID of task to delete
 * @returns New array with the task removed
 */
export const deleteTask = (tasks: Task[], taskId: string): Task[] => {
  return tasks.filter(task => task.id !== taskId);
};

/**
 * Deletes multiple tasks that match a predicate function
 * @param tasks Array of tasks
 * @param predicate Function to determine which tasks to delete
 * @returns New array with matching tasks removed
 */
export const deleteTasks = (
  tasks: Task[],
  predicate: (task: Task) => boolean
): Task[] => {
  return tasks.filter(task => !predicate(task));
};

/**
 * Filters tasks based on provided criteria
 * @param tasks Array of tasks to filter
 * @param filters Filter criteria
 * @returns Filtered array of tasks
 */
export const filterTasks = (tasks: Task[], filters: Partial<TaskFilters>): Task[] => {
  return tasks.filter(task => {
    // Filter by status
    if (filters.status && task.status !== filters.status) {
      return false;
    }

    // Filter by priority
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Filter by assignee
    if (filters.assignee && task.assignee !== filters.assignee) {
      return false;
    }

    // Filter by search term (checks title and description)
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });
};

/**
 * Sorts tasks by the specified field and direction
 * @param tasks Array of tasks to sort
 * @param field Field to sort by
 * @param direction Sort direction (asc or desc)
 * @returns Sorted array of tasks
 */
export const sortTasks = (
  tasks: Task[],
  field: keyof Task = 'updatedAt',
  direction: SortDirection = 'desc'
): Task[] => {
  return [...tasks].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];

    // Handle undefined values
    if (valueA === undefined && valueB === undefined) return 0;
    if (valueA === undefined) return direction === 'asc' ? -1 : 1;
    if (valueB === undefined) return direction === 'asc' ? 1 : -1;

    // Handle date fields
    if (field === 'createdAt' || field === 'updatedAt' || field === 'dueDate') {
      const dateA = valueA ? new Date(valueA as string).getTime() : 0;
      const dateB = valueB ? new Date(valueB as string).getTime() : 0;

      if (dateA === dateB) return 0;
      const comparison = dateA < dateB ? -1 : 1;
      return direction === 'asc' ? comparison : -comparison;
    }

    // Handle string fields
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      const comparison = valueA.localeCompare(valueB);
      return direction === 'asc' ? comparison : -comparison;
    }

    // Handle other fields
    if (valueA === valueB) return 0;
    const comparison = valueA < valueB ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
};
