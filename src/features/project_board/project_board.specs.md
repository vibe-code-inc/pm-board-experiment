# Project Board Component Specification

## Overview
The ProjectBoard component implements a kanban-style board for visualizing and managing tasks across different status categories. It provides a user interface for viewing, filtering, and updating tasks through drag-and-drop interactions.

## Product Requirements
- Display tasks organized into columns by status (todo, in-progress, done)
- Show column headers with status names and task counts
- Allow dragging tasks between columns to update status
- Support clicking on tasks to view/edit details
- Implement responsive design for various screen sizes
- Support keyboard navigation for accessibility
- Provide empty state messaging for columns with no tasks
- Display task cards with key information

## Technical Requirements
- Implement component using React and TypeScript
- Use drag-and-drop functionality with proper event handling
- Create responsive layout using Tailwind CSS
- Optimize rendering performance for large task lists
- Implement proper keyboard event handling
- Ensure proper state management for task updates
- Implement accessible UI elements with proper ARIA attributes

## Behavioral Expectations
- Tasks should be rendered as cards in the appropriate status column
- Dragging a task to a new column should update its status
- Columns should scroll independently when they contain many tasks
- Clicking a task should open the task modal for detailed view/edit
- Empty columns should display a message indicating no tasks
- Task count should be displayed in each column header
- Drag operations should provide visual feedback

## Component Structure
```typescript
interface ProjectBoardProps {
  project: Project;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({
  project,
  onTaskUpdate,
}) => {
  // State management for tasks, drag operations, and modals
  const [tasks, setTasks] = useState<Task[]>(project.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Implementation of drag handlers, task filtering, and UI rendering

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {/* Todo Column */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Todo ({todoTasks.length})</h2>
        <div className="flex-1 overflow-y-auto">
          {todoTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={handleEditTask}
            />
          ))}
          {todoTasks.length === 0 && (
            <div className="text-gray-400 text-center p-4">No tasks</div>
          )}
        </div>
      </div>

      {/* In Progress Column */}
      {/* Done Column */}

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};
```

## Related Specifications
- [Project Board Feature](./project_board.package_specs.md)
- [Task Card Component](../../ui/features/task_card/task_card.specs.md)
- [Task Modal Component](../../ui/features/task_modal/task_modal.specs.md)
