# Project Board Component Specification

## Overview
The ProjectBoard component implements a kanban-style board for visualizing and managing tasks across different status categories. It coordinates task management operations and delegates specific responsibilities to specialized components, following SOLID principles.

## Product Requirements
- Display tasks organized into columns by status (todo, in-progress, done)
- Show column headers with status names and task counts
- Allow dragging tasks between columns to update status
- Allow reordering tasks within the same column by dragging
- Support clicking on tasks to view/edit details
- Support clicking edit button/icon to quickly log task details to console
- Implement responsive design for various screen sizes
- Support keyboard navigation for accessibility
- Provide comprehensive visual feedback during drag operations
- Remove dragged task from source list during drag operations
- Create and manage drag preview that follows cursor/touch during dragging
- Provide placeholder at the precise position where the task would be dropped
- Support exact positioning between cards when dragging
- Support touch-based drag and drop on mobile devices using pointer events
- Ensure drag preview maintains exact dimensions of original card

## Technical Requirements
- Implement component using React and TypeScript
- Follow single responsibility principle by delegating specific concerns:
  - Column rendering to TaskColumn component
  - Drag and drop logic to DragAndDropManager
  - Placeholder visualization to DropPlaceholder component
  - Drag preview rendering to DragAndDropManager
- Create responsive layout using Tailwind CSS
- Optimize rendering performance for large task lists
- Implement proper keyboard event handling
- Ensure proper state management for task updates
- Implement accessible UI elements with proper ARIA attributes
- Coordinate communication between delegated components
- Maintain type safety throughout implementation
- Support touch interactions for mobile devices with pointer events
- Implement drag preview mechanism that follows cursor/touch
- Handle temporary removal of dragged tasks from source list
- Implement exact positioning of placeholders between task cards
- Ensure placeholders have exact dimensions matching dragged cards
- Clean up drag preview and restore state when drag operation ends

## Behavioral Expectations
- Coordinate the overall task management interface
- Delegate column rendering to TaskColumn components
- Delegate drag-and-drop logic to DragAndDropManager
- Delegate drop placeholder rendering to DropPlaceholder component
- Manage the overall task data state
- Update task status when moved between columns
- Update task order when reordered within the same column
- Open task detail modal when a task is clicked
- Log task details to console when edit button/icon is clicked
- Propagate task updates to parent components
- Maintain consistent task state across the board
- Remove task card from source list when it's being dragged
- Create drag preview that follows cursor/touch and has same dimensions as original card
- Position drop placeholder precisely between cards based on cursor/touch position
- Support pointer events for cross-device compatibility
- Clean up drag preview when drag operation completes
- Add tasks to exact position where dropped between other cards
- Ensure placeholders accurately represent where cards will be placed
- Handle pointer event-based interactions for mobile devices

## Component Structure
```typescript
type ProjectBoardProps = {
  project: Project;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskEdit: (task: Task) => void;
  onTaskReorder?: (taskId: string, columnId: string, targetTaskId: string, position: 'before' | 'after') => void;
};

export const ProjectBoard: React.FC<ProjectBoardProps> = ({
  project,
  onTaskUpdate,
  onTaskEdit,
  onTaskReorder
}) => {
  // Task state management
  const [tasks, setTasks] = useState<Task[]>(project.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use the drag and drop manager
  const {
    draggedItemId,
    draggedOverContainerId,
    dropPlaceholderPosition,
    draggedElement,
    dragPreviewElement,
    handleDragStart,
    handleDragEnd,
    handleContainerDragOver,
    handleContainerDragLeave,
    handleContainerDrop,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useDragAndDropManager();

  // Task filtering by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  // Task status change handler
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

  // Task reordering handler
  const handleTaskReorder = (draggedTaskId: string, targetTaskId: string, position: 'before' | 'after') => {
    const updatedTasks = [...tasks];
    const draggedTaskIndex = updatedTasks.findIndex(t => t.id === draggedTaskId);
    const targetTaskIndex = updatedTasks.findIndex(t => t.id === targetTaskId);

    if (draggedTaskIndex === -1 || targetTaskIndex === -1) return;

    // Remove the dragged task
    const [draggedTask] = updatedTasks.splice(draggedTaskIndex, 1);

    // Calculate new position
    const insertIndex = position === 'before'
      ? targetTaskIndex > draggedTaskIndex ? targetTaskIndex - 1 : targetTaskIndex
      : targetTaskIndex > draggedTaskIndex ? targetTaskIndex : targetTaskIndex + 1;

    // Insert the task at the new position
    updatedTasks.splice(insertIndex, 0, draggedTask);

    setTasks(updatedTasks);

    // Propagate to parent if callback exists
    if (onTaskReorder) {
      onTaskReorder(draggedTaskId, draggedTask.status, targetTaskId, position);
    }
  };

  // Task editing handler
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Task save handler
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

  // Container drop handler
  const onContainerDrop = (e: React.DragEvent<HTMLDivElement>, columnId: TaskStatus) => {
    const result = handleContainerDrop(e, columnId);
    if (result) {
      const { itemId, sourceContainerId, targetId, position } = result;

      if (sourceContainerId !== columnId) {
        // Moving between columns - update status
        handleStatusChange(itemId, columnId);
      } else if (targetId) {
        // Reordering within same column
        handleTaskReorder(itemId, targetId, position as 'before' | 'after');
      }
    }
  };

  // Handle pointer event interactions for mobile
  const onContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>, columnId: TaskStatus) => {
    // This is delegated to the task card's pointer handlers
  };

  const onContainerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggedItemId) return;

    handlePointerMove(e);

    // Find the column element
    const columnElement = e.currentTarget.closest('[data-column]');
    if (!columnElement) return;

    // Get the column ID
    const columnId = columnElement.getAttribute('data-column') as TaskStatus;
    if (!columnId) return;

    // Get all task elements in this column
    const taskElements = Array.from(columnElement.querySelectorAll('[data-task-id]'));

    // Use the same logic as dragOver to calculate placeholder position
    const point = { clientY: e.clientY };
    // Process pointer move similar to dragOver (implementation details in DragAndDropManager)
  };

  const onContainerPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggedItemId) return;

    handlePointerUp(e);

    // Find the column element
    const columnElement = e.currentTarget.closest('[data-column]');
    if (!columnElement) return;

    // Get the column ID
    const columnId = columnElement.getAttribute('data-column') as TaskStatus;
    if (!columnId) return;

    // Similar logic to onContainerDrop but for pointer events
    // Process pointer up similar to drop (implementation details in DragAndDropManager)
  };

  // Create the drop placeholder element
  const placeholderElement = (
    <DropPlaceholder
      isActive={!!dropPlaceholderPosition}
      draggedElement={draggedElement}
      position={dropPlaceholderPosition?.position || null}
      targetElement={
        dropPlaceholderPosition?.targetId
          ? document.querySelector(`[data-task-id="${dropPlaceholderPosition.targetId}"]`) as HTMLElement
          : null
      }
    />
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {/* Todo Column */}
      <TaskColumn
        status="todo"
        title="Todo"
        tasks={todoTasks}
        isDraggedOver={draggedOverContainerId === 'todo'}
        dropPlaceholderPosition={dropPlaceholderPosition}
        placeholderComponent={placeholderElement}
        draggedTaskId={draggedItemId}
        onDragOver={(e) => {
          const columnElement = e.currentTarget;
          const taskElements = Array.from(columnElement.querySelectorAll('[data-task-id]'));
          handleContainerDragOver(e, 'todo', taskElements);
        }}
        onDrop={(e) => onContainerDrop(e, 'todo')}
        onDragLeave={handleContainerDragLeave}
        onTaskStatusChange={handleStatusChange}
        onTaskEdit={handleEditTask}
        onTaskDragStart={(taskId, element) => handleDragStart(taskId, 'todo', element)}
        onTaskDragEnd={handleDragEnd}
        onPointerDown={(e) => onContainerPointerDown(e, 'todo')}
        onPointerMove={onContainerPointerMove}
        onPointerUp={onContainerPointerUp}
      />

      {/* In Progress Column */}
      <TaskColumn
        status="in-progress"
        title="In Progress"
        tasks={inProgressTasks}
        isDraggedOver={draggedOverContainerId === 'in-progress'}
        dropPlaceholderPosition={dropPlaceholderPosition}
        placeholderComponent={placeholderElement}
        draggedTaskId={draggedItemId}
        onDragOver={(e) => {
          const columnElement = e.currentTarget;
          const taskElements = Array.from(columnElement.querySelectorAll('[data-task-id]'));
          handleContainerDragOver(e, 'in-progress', taskElements);
        }}
        onDrop={(e) => onContainerDrop(e, 'in-progress')}
        onDragLeave={handleContainerDragLeave}
        onTaskStatusChange={handleStatusChange}
        onTaskEdit={handleEditTask}
        onTaskDragStart={(taskId, element) => handleDragStart(taskId, 'in-progress', element)}
        onTaskDragEnd={handleDragEnd}
        onPointerDown={(e) => onContainerPointerDown(e, 'in-progress')}
        onPointerMove={onContainerPointerMove}
        onPointerUp={onContainerPointerUp}
      />

      {/* Done Column */}
      <TaskColumn
        status="done"
        title="Done"
        tasks={doneTasks}
        isDraggedOver={draggedOverContainerId === 'done'}
        dropPlaceholderPosition={dropPlaceholderPosition}
        placeholderComponent={placeholderElement}
        draggedTaskId={draggedItemId}
        onDragOver={(e) => {
          const columnElement = e.currentTarget;
          const taskElements = Array.from(columnElement.querySelectorAll('[data-task-id]'));
          handleContainerDragOver(e, 'done', taskElements);
        }}
        onDrop={(e) => onContainerDrop(e, 'done')}
        onDragLeave={handleContainerDragLeave}
        onTaskStatusChange={handleStatusChange}
        onTaskEdit={handleEditTask}
        onTaskDragStart={(taskId, element) => handleDragStart(taskId, 'done', element)}
        onTaskDragEnd={handleDragEnd}
        onPointerDown={(e) => onContainerPointerDown(e, 'done')}
        onPointerMove={onContainerPointerMove}
        onPointerUp={onContainerPointerUp}
      />

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
- [Task Column Component](./task_column.specs.md)
- [Task Card Component](../../ui/features/task_card/task_card.specs.md)
- [Task Modal Component](../../ui/features/task_modal/task_modal.specs.md)
- [Drag and Drop Manager](../../lib/drag_drop/drag_drop_manager.specs.md)
- [Drop Placeholder Component](../../ui/features/project_board/drop_placeholder.specs.md)
