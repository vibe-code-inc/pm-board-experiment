# Task Actions Utility Specification

## Overview
The Task Actions utility provides a set of functions for common task operations such as creating, updating, and deleting tasks. It centralizes task manipulation logic for consistent handling across the application.

## Technical Requirements
- Implement utility functions for task CRUD operations
- Create helper functions for task validation
- Provide functions for task filtering and sorting
- Use TypeScript for full type safety
- Include proper error handling
- Support batch operations on multiple tasks
- Export functions individually for tree-shaking optimization
- Document functions with JSDoc comments

## Functional Requirements
- Create function to generate a new task with default values
- Create function to validate task data
- Implement function to update task properties
- Provide function to delete tasks
- Create function to filter tasks by various criteria
- Implement sorting functions for different task attributes
- Support batch operations for updating multiple tasks

## Implementation Details
```typescript
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
export const validateTask = (task: Task): Record<string, string> | null => {
  const errors: Record<string, string> = {};

  if (!task.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!['todo', 'in-progress', 'done'].includes(task.status)) {
    errors.status = 'Invalid status value';
  }

  if (!['low', 'medium', 'high'].includes(task.priority)) {
    errors.priority = 'Invalid priority value';
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
    updatedAt: new Date().toISOString(),
  };
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
  direction: 'asc' | 'desc' = 'desc'
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

## Related Specifications
- [Task Management Features](./task_management.package_specs.md)
- [Task Manager Component](./task_manager.specs.md)
