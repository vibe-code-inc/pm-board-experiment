# Types Specification

## Overview
The types.ts file contains core type definitions used throughout the application. It defines the fundamental data structures that represent the domain model of the PM Board application.

## Technical Requirements
- Define the Task interface with required and optional properties
- Define the Project interface
- Use string literal types for enum-like values
- Ensure type safety with precise definitions
- Export all types for use in other modules
- Document types with JSDoc comments
- Follow TypeScript best practices

## Type Definitions
```typescript
/**
 * Task status options
 */
export type TaskStatus = 'todo' | 'in-progress' | 'done';

/**
 * Task priority levels
 */
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * Represents a task in the PM Board application
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a project containing multiple tasks
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}
```

## Related Specifications
- [App Component](./app.specs.md)
- [Project Board Feature](./features/project_board/project_board.package_specs.md)
- [Task Management Feature](./features/task_management/task_management.package_specs.md)
