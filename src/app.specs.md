# App Component Specification

## Overview
The App component serves as the main container for the PM Board application. It provides the application layout and orchestrates the different feature components.

## Product Requirements
- Display the main application header with the PM Board title
- Provide navigation between different views if needed
- Display the primary content area for task and project management
- Support responsive layout for different screen sizes
- Maintain consistent styling with the design system

## Technical Requirements
- Built with React and TypeScript
- Acts as the application's root component
- Imports and composes feature components
- Provides project state management with React's useState
- Implements task update and edit functionality
- Passes project data and callback handlers to child components
- Uses Tailwind CSS for responsive layout
- Follows the project conventions for component structure
- Implements single responsibility principle by separating state management from UI rendering

## Behavioral Expectations
- Render the application layout consistently
- Handle screen size changes gracefully
- Provide smooth transitions between different views
- Maintain performance even with many tasks and projects
- Support keyboard navigation throughout the application
- Properly propagate task updates to child components
- Maintain immutable state updates for task modifications

## Interfaces
```typescript
type AppProps = {
  // App has no props as it's the root component
};

// Internal state types
type AppState = {
  project: Project;
};
```

## Component Implementation
```typescript
// App component implements the main application shell
export const App: React.FC = () => {
  // State management for project data
  const [project, setProject] = useState<Project>(initialProject);

  // Handler for updating task properties
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

  // Handler for complete task edits
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
```

## Related Specifications
- [Main Entry Point](./main.specs.md)
- [Project Board Feature](./features/project_board/project_board.package_specs.md)
- [Types](./types.specs.md)
