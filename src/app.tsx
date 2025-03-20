import { useState } from 'react';
import { Project, Task } from '@/types';
import { ProjectBoard } from '@/features/project_board/project_board';
import { Layout } from 'lucide-react';

const initialProject: Project = {
  id: '1',
  name: 'Website Redesign',
  description: 'Complete overhaul of the company website with modern design and improved UX',
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
    },
    {
      id: '2',
      title: 'Mobile Navigation',
      description: 'Design and implement responsive mobile navigation menu',
      status: 'todo',
      priority: 'medium',
      assignee: 'Jenna Liu',
      dueDate: '2024-04-25',
    },
    {
      id: '3',
      title: 'Contact Form',
      description: 'Create form validation and submission handling for contact page',
      status: 'todo',
      priority: 'medium',
      assignee: 'Marcus Green',
      dueDate: '2024-04-22',
    },
    {
      id: '4',
      title: 'SEO Optimization',
      description: 'Implement meta tags, structured data, and optimize page load speed',
      status: 'todo',
      priority: 'high',
      assignee: 'Emily Chen',
      dueDate: '2024-04-28',
    },
    {
      id: '5',
      title: 'Blog Templates',
      description: 'Design and implement templates for blog posts and category pages',
      status: 'todo',
      priority: 'low',
      assignee: 'Kevin Smith',
      dueDate: '2024-05-05',
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
    },
    {
      id: '7',
      title: 'Authentication Flow',
      description: 'Implement login, signup, and password reset flows with proper security',
      status: 'in-progress',
      priority: 'high',
      assignee: 'David Kumar',
      dueDate: '2024-04-18',
    },
    {
      id: '8',
      title: 'Product Catalog',
      description: 'Create responsive grid layout for product catalog with filtering options',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Rachel Park',
      dueDate: '2024-04-19',
    },
    {
      id: '9',
      title: 'Accessibility Audit',
      description: 'Test and improve website accessibility to meet WCAG 2.1 AA standards',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Thomas Moore',
      dueDate: '2024-04-21',
    },
    {
      id: '10',
      title: 'Dark Mode Support',
      description: 'Implement color scheme toggle and dark mode styling across all pages',
      status: 'in-progress',
      priority: 'low',
      assignee: 'Olivia Johnson',
      dueDate: '2024-04-26',
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
    },
    {
      id: '12',
      title: 'Competitor Analysis',
      description: 'Research and document features and UX patterns from competitor websites',
      status: 'done',
      priority: 'low',
      assignee: 'Jennifer Wu',
      dueDate: '2024-03-25',
    },
    {
      id: '13',
      title: 'Wireframes',
      description: 'Create low-fidelity wireframes for all main website pages',
      status: 'done',
      priority: 'high',
      assignee: 'Alex Wong',
      dueDate: '2024-04-02',
    },
    {
      id: '14',
      title: 'Project Setup',
      description: 'Initialize repository and setup basic project structure with build tools',
      status: 'done',
      priority: 'medium',
      assignee: 'Chris Taylor',
      dueDate: '2024-03-18',
    },
    {
      id: '15',
      title: 'Brand Guidelines',
      description: 'Document updated brand guidelines and design principles for the redesign',
      status: 'done',
      priority: 'medium',
      assignee: 'Maya Patel',
      dueDate: '2024-03-29',
    },
  ],
};

function App() {
  const [project, setProject] = useState<Project>(initialProject);

  const handleTaskUpdate = (taskId: string, newStatus: Task['status']) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    }));
  };

  const handleTaskEdit = (updatedTask: Task) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Layout className="w-6 h-6 text-blue-600 mr-2" />
          <h1 className="text-xl font-semibold text-gray-900">Project Hub</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6">
        <ProjectBoard
          project={project}
          onTaskUpdate={handleTaskUpdate}
          onTaskEdit={handleTaskEdit}
        />
      </main>
    </div>
  );
}

export default App;
