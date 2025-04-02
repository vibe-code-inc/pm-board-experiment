# Task List Component Specification

## Overview
The TaskList component displays a list of tasks with options for interaction. It renders task items with essential information and provides controls for editing and deletion.

## Product Requirements
- Display a list of tasks with essential information
- Show task title, priority, status, and assignee
- Support task selection for editing
- Enable task deletion with confirmation
- Handle empty state with appropriate messaging
- Support different view modes (list, grid)
- Provide visual indicators for task priority
- Support sorting and ordering
- Ensure task list is accessible to all users including screen readers

## Technical Requirements
- Implement with React and TypeScript
- Optimize rendering performance for large lists
- Create responsive list layout
- Properly handle different screen sizes
- Implement virtualized rendering for performance
- Use proper keyboard accessibility with appropriate ARIA attributes
- Support touch interactions
- Use types instead of interfaces according to project conventions
- Follow single responsibility principle for rendering logic
- Implement proper component composition
- Optimize re-renders with React.memo where appropriate
- Use proper TypeScript typing for all props and handlers
- Apply proper error boundaries for component failure states

## Behavioral Expectations
- Tasks should be displayed in the specified order
- Empty state should show a message indicating no tasks
- Clicking a task should select it for detailed view/edit
- Delete button should trigger confirmation before removing
- List should update immediately when tasks are modified
- Visual indicators should reflect task priorities
- Touch actions should work on mobile devices
- Keyboard navigation should work for all interactive elements
- Screen readers should announce task properties and available actions
- Long task lists should remain performant with virtualized rendering

## Component Structure
```typescript
type TaskListProps = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  viewMode?: 'list' | 'grid';
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  viewMode = 'list',
}) => {
  // Rendering logic and event handlers

  const handleEdit = (task: Task) => {
    onEdit(task);
  };

  const handleDelete = (taskId: string) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(taskId);
    }
  };

  // Empty state handling
  if (tasks.length === 0) {
    return (
      <div
        className="text-center p-6 bg-gray-50 rounded-lg"
        role="status"
        aria-live="polite"
      >
        <p className="text-gray-500">No tasks found</p>
      </div>
    );
  }

  return (
    <div
      className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}
      role="list"
      aria-label="Task list"
    >
      {tasks.map(task => (
        <div
          key={task.id}
          className="bg-white p-4 rounded-lg shadow"
          role="listitem"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{task.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(task)}
                className="text-blue-500 hover:text-blue-700"
                aria-label={`Edit task: ${task.title}`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-red-500 hover:text-red-700"
                aria-label={`Delete task: ${task.title}`}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">{task.description}</div>
          <div className="mt-4 flex justify-between items-center text-xs">
            <span
              className={`px-2 py-1 rounded ${priorityColors[task.priority]}`}
              aria-label={`Priority: ${task.priority}`}
            >
              {task.priority}
            </span>
            <span aria-label={`Assignee: ${task.assignee || 'Unassigned'}`}>
              {task.assignee || 'Unassigned'}
            </span>
            <span aria-label={`Status: ${task.status}`}>
              {task.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper styles
const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};
```

## Related Specifications
- [Task Management Features](./task_management.package_specs.md)
- [Task Card Component](../../ui/features/task_card/task_card.specs.md)
- [Task Modal Component](../../ui/features/task_modal/task_modal.specs.md)
