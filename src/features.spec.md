# PM Board Project Specification

## Overview
PM Board is a task management application that allows users to organize and track tasks across different projects. It provides features for managing tasks with different statuses, priorities, and assignments.

## Product Requirements
- Users should be able to view and manage projects
- Users should be able to view and manage tasks within projects
- Tasks should be organized by status (todo, in-progress, done)
- Tasks should display relevant information such as title, description, priority, assignee, and due date
- Users should be able to create, edit, and update task status
- Users should be able to drag and drop tasks between status columns
- The interface should be intuitive and provide a modern, responsive design

## Technical Requirements
- Built with React and TypeScript
- Uses a component-based architecture
- Follows the project's established coding conventions and directory structure
- Provides type safety with well-defined interfaces
- Uses Tailwind CSS for styling
- Implements responsive design for different screen sizes
- Uses custom hooks for state management and logic reuse
- Implements drag-and-drop functionality for task management

## Behavioral Expectations
- The application should be responsive and work on different screen sizes
- Task status changes should be reflected immediately in the UI
- Task editing should be done through a modal interface
- The application should provide visual cues for task priority and status
- Drag and drop operations should provide visual feedback
- Empty states should be handled gracefully with appropriate UI elements

## Core Data Structures
```typescript
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}
```

## Related Specifications
- [Features - Project Board](./features/project_board/features.spec.md)
- [Features - Task Management](./features/task_management/features.spec.md)
- [UI - Base Components](./ui/base/features.spec.md)
- [UI - Feature Components](./ui/features/features.spec.md)
- [UI - Task Card](./ui/features/task_card/features.spec.md)
- [UI - Task Modal](./ui/features/task_modal/features.spec.md)
- [Lib - Utilities](./lib/features.spec.md)
