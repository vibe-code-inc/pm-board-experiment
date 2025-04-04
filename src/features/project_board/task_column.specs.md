# Task Column Component Specification

## Overview
The TaskColumn component represents a single status column in the ProjectBoard. It displays tasks of a specific status and handles the column-specific aspects of drag-and-drop interactions, while delegating board-level coordination to the parent ProjectBoard component.

## Product Requirements
- Display tasks of a specific status in a vertical column
- Show column header with status name and task count
- Provide empty state messaging when there are no tasks
- Support receiving dropped tasks from other columns
- Support receiving dropped tasks for reordering within the column
- Provide visual feedback when a task is being dragged over the column (vivid blue border)
- Display drop placeholders in the appropriate position between tasks with dimensions matching the dragged card
- Support scrolling independently when containing many tasks
- Handle touch events for mobile device support with pointer events
- Hide task cards that are currently being dragged (as they appear in the drag preview)
- Provide space between remaining cards for the drop placeholder at precise positions
- Support exact positioning of drop placeholders based on cursor/touch proximity

## Technical Requirements
- Implement component using React and TypeScript
- Use Tailwind CSS for styling
- Support drag-and-drop event handling (dragOver, drop, dragLeave)
- Support pointer events for mobile touch interaction
- Maintain column-specific state
- Follow single responsibility principle by handling only column concerns
- Implement type safety with TaskStatus type
- Optimize rendering performance for large task lists
- Provide visual feedback for drag targets using conditional styling
- Receive drop placeholder positioning data from parent component
- Display tasks with proper ordering
- Support keyboard accessibility
- Implement precise positioning of cards based on drag location
- Handle the temporary removal of task cards during drag operations
- Coordinate with DragAndDropManager for proper placeholder positioning
- Ensure accurate spacing between items during drag operations

## Behavioral Expectations
- Column should highlight with a vivid blue border when a card is dragged over it
- Column should display tasks in the specified order
- Column should show a drop placeholder at the calculated position when a task is dragged over
- Column should display a message when empty
- Column should scroll independently when it contains many tasks
- Column should support keyboard navigation
- Column should render TaskCard components for each task in the column
- Column should not manage global drag-and-drop state (delegated to parent ProjectBoard)
- Column should present task cards with appropriate edit button functionality
- Column should ensure placeholders match the dimensions of dragged cards
- Column should support exact positioning of cards between other cards
- Column should hide task cards that are currently being dragged
- Column should create space between cards where the placeholder will be displayed
- Column should support both mouse and touch/pointer interactions
- Column should ensure placeholder appears exactly between the appropriate cards
- Column should adjust spacing dynamically based on drag position
- Column should integrate with the drag preview system to avoid visual duplication

## Component Structure
```typescript
type TaskColumnProps = {
  // Column status identifier
  status: TaskStatus;
  // Display name for the column
  title: string;
  // Tasks belonging to this column
  tasks: Task[];
  // Whether a task is currently being dragged over this column
  isDraggedOver: boolean;
  // Information about where to render the drop placeholder, if any
  dropPlaceholderPosition: {
    containerId: string;
    targetId: string | null;
    position: 'before' | 'after';
  } | null;
  // Placeholder component to render between tasks
  placeholderComponent: React.ReactNode;
  // ID of the task currently being dragged, if any
  draggedTaskId: string | null;
  // Callbacks
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onTaskStatusChange: (taskId: string, status: TaskStatus) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDragStart: (taskId: string, element: HTMLElement) => void;
  onTaskDragEnd: () => void;
  // Pointer event handlers for mobile support
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLDivElement>) => void;
};

export const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  title,
  tasks,
  isDraggedOver,
  dropPlaceholderPosition,
  placeholderComponent,
  draggedTaskId,
  onDragOver,
  onDrop,
  onDragLeave,
  onTaskStatusChange,
  onTaskEdit,
  onTaskDragStart,
  onTaskDragEnd,
  onPointerDown,
  onPointerMove,
  onPointerUp
}) => {
  // Column ref for DOM manipulation if needed
  const columnRef = useRef<HTMLDivElement>(null);

  // Helper to render tasks with placeholders
  const renderTasksWithPlaceholder = () => {
    if (tasks.length === 0) {
      if (dropPlaceholderPosition?.containerId === status) {
        return placeholderComponent;
      }
      return <div className="text-gray-400 text-center p-4">No tasks</div>;
    }

    return (
      <>
        {tasks.map(task => {
          // Don't render task if it's currently being dragged
          // It will be shown as part of the drag preview instead
          if (task.id === draggedTaskId) {
            return null;
          }

          // Check if placeholder should be rendered before this task
          const renderPlaceholderBefore =
            dropPlaceholderPosition?.containerId === status &&
            dropPlaceholderPosition.targetId === task.id &&
            dropPlaceholderPosition.position === 'before';

          // Check if placeholder should be rendered after this task
          const renderPlaceholderAfter =
            dropPlaceholderPosition?.containerId === status &&
            dropPlaceholderPosition.targetId === task.id &&
            dropPlaceholderPosition.position === 'after';

          return (
            <React.Fragment key={task.id}>
              {renderPlaceholderBefore && placeholderComponent}
              <TaskCard
                task={task}
                onStatusChange={(newStatus) => onTaskStatusChange(task.id, newStatus)}
                onEdit={() => onTaskEdit(task)}
                onDragStart={(taskId, status, element) => {
                  onTaskDragStart(taskId, element);
                }}
                onDragEnd={onTaskDragEnd}
                isDragging={task.id === draggedTaskId}
              />
              {renderPlaceholderAfter && placeholderComponent}
            </React.Fragment>
          );
        })}

        {/* If placeholder should be at the bottom with no target task */}
        {dropPlaceholderPosition?.containerId === status &&
         dropPlaceholderPosition.targetId === null &&
          placeholderComponent}
      </>
    );
  };

  // Column class with conditional styling based on drag state
  const columnClass = `bg-white rounded-lg shadow p-4 flex flex-col ${
    isDraggedOver ? 'ring-2 ring-blue-500 ring-opacity-70' : ''
  }`;

  return (
    <div
      ref={columnRef}
      className={columnClass}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      data-column={status}
    >
      <h2 className="text-lg font-semibold mb-4">{title} ({tasks.length})</h2>
      <div className="flex-1 overflow-y-auto">
        {renderTasksWithPlaceholder()}
      </div>
    </div>
  );
};
```

## Related Specifications
- [Project Board Feature](./project_board.package_specs.md)
- [Project Board Component](./project_board.specs.md)
- [Task Card Component](../../ui/features/task_card/task_card.specs.md)
- [Drag and Drop Manager](../../lib/drag_drop/drag_drop_manager.specs.md)
- [Drop Placeholder Component](../../ui/features/project_board/drop_placeholder.specs.md)
