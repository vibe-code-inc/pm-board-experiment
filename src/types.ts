/**
 * Task status options
 */
export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'deleted';

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
