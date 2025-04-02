# Task Manager Component Specification

## Overview
The TaskManager component serves as the central orchestrator for task management functionality. It coordinates between task listing, filtering, and editing operations.

## Product Requirements
- Provide a central interface for task management
- Display the list of tasks with filtering options
- Support creating new tasks
- Allow editing existing tasks
- Enable task deletion with confirmation
- Integrate with task filters for refined task views
- Support batch operations on multiple tasks
- Show operation status feedback to users
- Ensure the interface is accessible to all users

## Technical Requirements
- Implement with React and TypeScript
- Manage task state efficiently using immutable updates
- Coordinate between child components (TaskList, TaskFilter)
- Handle task CRUD operations with proper error handling
- Implement proper error handling with user feedback
- Use custom hooks for complex logic
- Ensure responsive design across all device sizes
- Implement keyboard accessibility and screen reader support
- Use types instead of interfaces as per project conventions
- Implement proper state management with React hooks
- Follow single responsibility principle for component methods
- Use proper event typing for all handlers
- Implement proper ARIA attributes for accessibility
- Optimize rendering with proper memoization techniques

## Behavioral Expectations
- Changes to tasks should be reflected immediately in the UI
- Filtering should update the task list in real time
- New task creation should add to the list with proper positioning
- Task editing should maintain list order unless sort criteria change
- Deletion should remove tasks with a confirmation step
- Error conditions should be handled gracefully with user feedback
- Empty states should be managed appropriately
- Screen readers should announce status changes
- Keyboard users should be able to navigate all controls
- Operations (create, update, delete) should provide visual and screen reader feedback
- Focus should be properly managed after modal dialogs close

## Component Structure
```typescript
type TaskManagerProps = {
  initialTasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
};

export const TaskManager: React.FC<TaskManagerProps> = ({
  initialTasks,
  onTasksChange,
}) => {
  // State for tasks, filters, selected task, modal state
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState<TaskFilters>({
    status: undefined,
    priority: undefined,
    assignee: undefined,
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Reference for create button (to return focus after modal closes)
  const createButtonRef = useRef<HTMLButtonElement>(null);

  // Extract available assignees for filter dropdown
  const availableAssignees = useMemo(() => {
    return Array.from(new Set(tasks.map(task => task.assignee).filter(Boolean) as string[]));
  }, [tasks]);

  // Filter and sort implementation
  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, filters);
  }, [tasks, filters]);

  // Update parent component when tasks change
  useEffect(() => {
    onTasksChange(tasks);
  }, [tasks, onTasksChange]);

  // Show status message temporarily
  const showStatusMessage = (message: string) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Task operation handlers
  const handleCreateTask = () => {
    const newTask = createTask();
    setSelectedTask(newTask);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask({...task});
    setIsModalOpen(true);
  };

  const handleSaveTask = (updatedTask: Task) => {
    // Check if this is a new or existing task
    const isNewTask = !tasks.some(task => task.id === updatedTask.id);

    if (isNewTask) {
      setTasks(prevTasks => [...prevTasks, updatedTask]);
      showStatusMessage('Task created successfully');
    } else {
      setTasks(prevTasks =>
        prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
      );
      showStatusMessage('Task updated successfully');
    }

    setIsModalOpen(false);
    // Return focus to create button after modal closes
    setTimeout(() => createButtonRef.current?.focus(), 0);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      showStatusMessage('Task deleted successfully');
    }
  };

  const handleFilterChange = (newFilters: Partial<TaskFilters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Return focus to create button after modal closes
    setTimeout(() => createButtonRef.current?.focus(), 0);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Task Management</h2>
        <button
          ref={createButtonRef}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleCreateTask}
          aria-label="Create new task"
        >
          New Task
        </button>
      </div>

      <TaskFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        availableAssignees={availableAssignees}
      />

      <TaskList
        tasks={filteredTasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      {statusMessage && (
        <div
          className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md"
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </div>
      )}

      {selectedTask && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          task={selectedTask}
          onSave={handleSaveTask}
          onDelete={selectedTask.id !== crypto.randomUUID() ? handleDeleteTask : undefined}
        />
      )}
    </div>
  );
};
```

## Related Specifications
- [Task Management Features](./task_management.package_specs.md)
- [Task List Component](./task_list.specs.md)
- [Task Filter Component](./task_filter.specs.md)
- [Task Actions Utility](./task_actions.specs.md)
- [Task Modal Component](../../ui/features/task_modal/task_modal.specs.md)
