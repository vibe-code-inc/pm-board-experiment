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
