import { useState } from 'react';
import { Project, Task } from '@/types';
import { ProjectBoard } from '@/features/project_board/project_board';

const initialProject: Project = {
  id: '1',
  name: 'Website Redesign',
  description: 'Complete overhaul of the company website with modern design and improved UX',
  createdAt: '2024-03-15',
  updatedAt: '2024-03-30',
  tasks: [
    // To Do Column
    {
      id: '1',
      title: 'Homepage Prototype',
      description: 'Create interactive prototype for the new homepage design',
      status: 'todo',
      priority: 'high',
      assignee: 'Alex Wong',
      dueDate: '2024-04-20',
      createdAt: '2024-03-15',
      updatedAt: '2024-03-15',
    },
    {
      id: '2',
      title: 'Mobile Navigation',
      description: 'Design and implement responsive mobile navigation menu',
      status: 'todo',
      priority: 'medium',
      assignee: 'Jenna Liu',
      dueDate: '2024-04-25',
      createdAt: '2024-03-16',
      updatedAt: '2024-03-16',
    },
    {
      id: '3',
      title: 'Contact Form',
      description: 'Create form validation and submission handling for contact page',
      status: 'todo',
      priority: 'medium',
      assignee: 'Marcus Green',
      dueDate: '2024-04-22',
      createdAt: '2024-03-16',
      updatedAt: '2024-03-16',
    },
    {
      id: '4',
      title: 'SEO Optimization',
      description: 'Implement meta tags, structured data, and optimize page load speed',
      status: 'todo',
      priority: 'high',
      assignee: 'Emily Chen',
      dueDate: '2024-04-28',
      createdAt: '2024-03-17',
      updatedAt: '2024-03-17',
    },
    {
      id: '5',
      title: 'Blog Templates',
      description: 'Design and implement templates for blog posts and category pages',
      status: 'todo',
      priority: 'low',
      assignee: 'Kevin Smith',
      dueDate: '2024-05-05',
      createdAt: '2024-03-18',
      updatedAt: '2024-03-18',
    },

    // In Progress Column
    {
      id: '6',
      title: 'Design System',
      description: 'Create a comprehensive design system including colors, typography, and components',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Sarah Chen',
      dueDate: '2024-04-15',
      createdAt: '2024-03-19',
      updatedAt: '2024-03-25',
    },
    {
      id: '7',
      title: 'Authentication Flow',
      description: 'Implement login, signup, and password reset flows with proper security',
      status: 'in-progress',
      priority: 'high',
      assignee: 'David Kumar',
      dueDate: '2024-04-18',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-26',
    },
    {
      id: '8',
      title: 'Product Catalog',
      description: 'Create responsive grid layout for product catalog with filtering options',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Rachel Park',
      dueDate: '2024-04-19',
      createdAt: '2024-03-21',
      updatedAt: '2024-03-26',
    },
    {
      id: '9',
      title: 'Accessibility Audit',
      description: 'Test and improve website accessibility to meet WCAG 2.1 AA standards',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Thomas Moore',
      dueDate: '2024-04-21',
      createdAt: '2024-03-22',
      updatedAt: '2024-03-27',
    },
    {
      id: '10',
      title: 'Dark Mode Support',
      description: 'Implement color scheme toggle and dark mode styling across all pages',
      status: 'in-progress',
      priority: 'low',
      assignee: 'Olivia Johnson',
      dueDate: '2024-04-26',
      createdAt: '2024-03-23',
      updatedAt: '2024-03-28',
    },

    // Done Column
    {
      id: '11',
      title: 'User Research',
      description: 'Conduct user interviews and analyze current website analytics',
      status: 'done',
      priority: 'medium',
      assignee: 'Mike Johnson',
      dueDate: '2024-03-30',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-30',
    },
    {
      id: '12',
      title: 'Competitor Analysis',
      description: 'Research and document features and UX patterns from competitor websites',
      status: 'done',
      priority: 'low',
      assignee: 'Jennifer Wu',
      dueDate: '2024-03-25',
      createdAt: '2024-03-02',
      updatedAt: '2024-03-25',
    },
    {
      id: '13',
      title: 'Wireframes',
      description: 'Create low-fidelity wireframes for all main website pages',
      status: 'done',
      priority: 'high',
      assignee: 'Alex Wong',
      dueDate: '2024-04-02',
      createdAt: '2024-03-10',
      updatedAt: '2024-04-02',
    },
    {
      id: '14',
      title: 'Project Setup',
      description: 'Initialize repository and setup basic project structure with build tools',
      status: 'done',
      priority: 'medium',
      assignee: 'Chris Taylor',
      dueDate: '2024-03-18',
      createdAt: '2024-03-05',
      updatedAt: '2024-03-18',
    },
    {
      id: '15',
      title: 'Brand Guidelines',
      description: 'Document updated brand guidelines and design principles for the redesign',
      status: 'done',
      priority: 'medium',
      assignee: 'Maya Patel',
      dueDate: '2024-03-29',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-29',
    },
  ],
};

// App component implements the main application shell
export const App: React.FC = () => {
  const [project, setProject] = useState<Project>(initialProject);

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? {
          ...task,
          ...updates,
          updatedAt: new Date().toISOString().split('T')[0]
        } : task
      ),
    }));
  };

  const handleTaskEdit = (updatedTask: Task) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === updatedTask.id ? { ...updatedTask, updatedAt: new Date().toISOString().split('T')[0] } : task
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">PM Board</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <ProjectBoard
          project={project}
          onTaskUpdate={handleTaskUpdate}
          onTaskEdit={handleTaskEdit}
        />
      </main>
    </div>
  );
};
