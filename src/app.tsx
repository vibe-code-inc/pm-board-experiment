import { useState } from 'react';
import { Project, Task } from '@/types';
import { ProjectBoard } from '@/features/project_board/project_board';
import { Layout } from 'lucide-react';

const initialProject: Project = {
  id: '1',
  name: 'Website Redesign',
  description: 'Complete overhaul of the company website with modern design and improved UX',
  tasks: [
    {
      id: '1',
      title: 'Design System',
      description: 'Create a comprehensive design system including colors, typography, and components',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Sarah Chen',
      dueDate: '2024-04-15',
    },
    {
      id: '2',
      title: 'User Research',
      description: 'Conduct user interviews and analyze current website analytics',
      status: 'done',
      priority: 'medium',
      assignee: 'Mike Johnson',
      dueDate: '2024-03-30',
    },
    {
      id: '3',
      title: 'Homepage Prototype',
      description: 'Create interactive prototype for the new homepage design',
      status: 'todo',
      priority: 'high',
      assignee: 'Alex Wong',
      dueDate: '2024-04-20',
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
