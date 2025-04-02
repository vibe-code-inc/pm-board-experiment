# Task Actions Utility Specification

## Overview
The Task Actions utility provides a set of functions for common task operations such as creating, updating, and deleting tasks. It centralizes task manipulation logic for consistent handling across the application.

## Technical Requirements
- Implement utility functions for task CRUD operations
- Create helper functions for task validation
- Provide functions for task filtering and sorting
- Use TypeScript for full type safety with proper typing
- Include proper error handling with typed error responses
- Support batch operations on multiple tasks
- Export functions individually for tree-shaking optimization
- Document functions with JSDoc comments
- Follow single responsibility principle for each function
- Use immutable data patterns for all operations
- Implement proper error handling with meaningful error messages
- Ensure type safety across all operations

## Functional Requirements
- Create function to generate a new task with default values
- Create function to validate task data
- Implement function to update task properties
- Provide function to delete tasks
- Create function to filter tasks by various criteria
- Implement sorting functions for different task attributes
- Support batch operations for updating multiple tasks
- Ensure all operations are pure functions without side effects
- Provide defensive programming with proper input validation

## Implementation Details
```typescript
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
  const now = new Date().toISOString();
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
    updatedAt: new Date().toISOString(),
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
    if (filters.status && task.status !== filters.status) {
      return false;
    }

    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    if (filters.assignee && task.assignee !== filters.assignee) {
      return false;
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

    if (valueA === valueB) return 0;

    const comparison = valueA < valueB ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
};
```

## Error Handling
- All functions should validate their inputs
- Invalid inputs should result in meaningful error messages
- Errors should be properly typed for consistent handling
- Functions should fail gracefully with clear error messages
- Error messages should be user-friendly and actionable

## Related Specifications
- [Task Management Features](./task_management.package_specs.md)
- [Task Manager Component](./task_manager.specs.md)
- [Task Types](../../types.specs.md)
