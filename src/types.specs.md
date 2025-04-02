# Types Specification

## Overview
The types.ts file contains core type definitions used throughout the application. It defines the fundamental data structures that represent the domain model of the PM Board application.

## Product Requirements
- Provide consistent data structure definitions for the application
- Support typed operations across the application
- Enable compile-time type checking for domain operations
- Define clear boundaries for data structure properties

## Technical Requirements
- Define the Task type with required and optional properties
- Define the Project type
- Use string literal types for enum-like values (TaskStatus, TaskPriority)
- Ensure type safety with precise definitions
- Export all types for use in other modules
- Document types with JSDoc comments
- Follow TypeScript best practices
- Use types instead of interfaces as per project conventions
- Keep types focused on data structures without behavioral implementations

## Behavioral Expectations
- Types should be usable across the application without circular dependencies
- Type definitions should prevent inconsistent data structures
- Optional properties should be clearly marked with optional operators
- Types should focus on the minimal interface needed (follow Interface Segregation Principle)
- Types should support extension through composition rather than inheritance

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
export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Represents a project containing multiple tasks
 */
export type Project = {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
};
```

## Related Specifications
- [App Component](./app.specs.md)
- [Project Board Feature](./features/project_board/project_board.package_specs.md)
- [Task Management Feature](./features/task_management/task_management.package_specs.md)
