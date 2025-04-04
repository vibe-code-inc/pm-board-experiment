export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'deleted';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  assignee?: string;
}
