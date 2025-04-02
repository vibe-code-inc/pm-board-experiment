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
- Provide visual feedback during drag operations

## Technical Requirements
- Implement component using React and TypeScript
- Use drag-and-drop functionality with proper event handling (dragOver, drop, dragLeave)
- Create responsive layout using Tailwind CSS
- Optimize rendering performance for large task lists
- Implement proper keyboard event handling
- Ensure proper state management for task updates
- Implement accessible UI elements with proper ARIA attributes
- Use React refs for column references
- Follow single responsibility principle for state and event handlers
- Implement type safety with TaskStatus type for column identification
- Provide visual feedback for drag targets using conditional styling
- Properly handle state updates for local and parent component state

## Behavioral Expectations
- Tasks should be rendered as cards in the appropriate status column
- Dragging a task to a new column should update its status
- Columns should scroll independently when they contain many tasks
- Clicking a task should open the task modal for detailed view/edit
- Empty columns should display a message indicating no tasks
- Task count should be displayed in each column header
- Drag operations should provide visual feedback with highlighted drop zones
- Only update task status when dropped in a different column
- Task updates should be propagated to the parent component
- Task edits should update both local state and parent component state

## Component Structure
```typescript
type ProjectBoardProps = {
  project: Project;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskEdit: (task: Task) => void;
};

export const ProjectBoard: React.FC<ProjectBoardProps> = ({
  project,
  onTaskUpdate,
  onTaskEdit
}) => {
  // State management for tasks, drag operations, and modals
  const [tasks, setTasks] = useState<Task[]>(project.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(null);

  // Refs for drop targets (columns)
  const todoColumnRef = useRef<HTMLDivElement>(null);
  const inProgressColumnRef = useRef<HTMLDivElement>(null);
  const doneColumnRef = useRef<HTMLDivElement>(null);

  // Task filtering by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  // Handle status change (drag-and-drop)
  const handleStatusChange = (taskId: string, status: Task['status']) => {
    onTaskUpdate(taskId, { status });
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status, updatedAt: new Date().toISOString().split('T')[0] }
          : task
      )
    );
  };

  // Handle task editing
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Handle task save
  const handleSaveTask = (updatedTask: Task) => {
    onTaskEdit(updatedTask);
    setTasks(prev =>
      prev.map(task =>
        task.id === updatedTask.id
          ? { ...updatedTask, updatedAt: new Date().toISOString().split('T')[0] }
          : task
      )
    );
    setIsModalOpen(false);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    setDraggedOverColumn(status);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);

    const taskId = e.dataTransfer.getData('taskId');
    const sourceStatus = e.dataTransfer.getData('taskStatus') as TaskStatus;

    // Only update if the status actually changed
    if (sourceStatus !== targetStatus) {
      handleStatusChange(taskId, targetStatus);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  // Helper to get column class based on drag state
  const getColumnClass = (status: TaskStatus) => {
    return `bg-white rounded-lg shadow p-4 flex flex-col ${
      draggedOverColumn === status
        ? 'ring-2 ring-blue-500 ring-opacity-70'
        : ''
    }`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {/* Todo Column */}
      <div
        ref={todoColumnRef}
        className={getColumnClass('todo')}
        onDragOver={(e) => handleDragOver(e, 'todo')}
        onDrop={(e) => handleDrop(e, 'todo')}
        onDragLeave={handleDragLeave}
        data-column="todo"
      >
        <h2 className="text-lg font-semibold mb-4">Todo ({todoTasks.length})</h2>
        <div className="flex-1 overflow-y-auto">
          {todoTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={(status) => handleStatusChange(task.id, status)}
              onEdit={() => handleEditTask(task)}
            />
          ))}
          {todoTasks.length === 0 && (
            <div className="text-gray-400 text-center p-4">No tasks</div>
          )}
        </div>
      </div>

      {/* In Progress Column */}
      <div
        ref={inProgressColumnRef}
        className={getColumnClass('in-progress')}
        onDragOver={(e) => handleDragOver(e, 'in-progress')}
        onDrop={(e) => handleDrop(e, 'in-progress')}
        onDragLeave={handleDragLeave}
        data-column="in-progress"
      >
        {/* Column content */}
      </div>

      {/* Done Column */}
      <div
        ref={doneColumnRef}
        className={getColumnClass('done')}
        onDragOver={(e) => handleDragOver(e, 'done')}
        onDrop={(e) => handleDrop(e, 'done')}
        onDragLeave={handleDragLeave}
        data-column="done"
      >
        {/* Column content */}
      </div>

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
