---
description: Task Column Component Specification
type: component
---

<specification>
  <meta>
    <title>Task Column Component Specification</title>
    <description>The TaskColumn component represents a single status column in the ProjectBoard. It displays tasks of a specific status and handles the column-specific aspects of drag-and-drop interactions.</description>
    <created-at utc-timestamp="1712678400">April 9, 2024, 10:00 AM EDT</created-at>
    <applies-to>
      <file-matcher glob="src/features/project_board/task_column.tsx">Task Column Component</file-matcher>
    </applies-to>
  </meta>

  <overview>
    <description>The TaskColumn component represents a single status column in the ProjectBoard. It displays tasks of a specific status and handles the column-specific aspects of drag-and-drop interactions, while delegating board-level coordination to the parent ProjectBoard component.</description>
    <responsibility>Display and manage tasks of a specific status in a vertical column</responsibility>
  </overview>

  <requirements>
    <functional-requirements>
      <requirement priority="high">
        <description>Display tasks of a specific status in a vertical column</description>
      </requirement>
      <requirement priority="high">
        <description>Show column header with status name and task count</description>
      </requirement>
      <requirement priority="medium">
        <description>Provide empty state messaging when there are no tasks</description>
      </requirement>
      <requirement priority="high">
        <description>Support receiving dropped tasks from other columns</description>
      </requirement>
      <requirement priority="medium">
        <description>Support receiving dropped tasks for reordering within the column</description>
      </requirement>
      <requirement priority="high">
        <description>Provide visual feedback when a task is being dragged over the column</description>
      </requirement>
      <requirement priority="high">
        <description>Display drop placeholders in the appropriate position between tasks</description>
      </requirement>
      <requirement priority="medium">
        <description>Support scrolling independently when containing many tasks</description>
      </requirement>
      <requirement priority="medium">
        <description>Handle touch events for mobile device support</description>
      </requirement>
      <requirement priority="high">
        <description>Hide task cards that are currently being dragged</description>
      </requirement>
      <requirement priority="medium">
        <description>Provide space between remaining cards for the drop placeholder at precise positions</description>
      </requirement>
    </functional-requirements>

    <technical-requirements>
      <requirement priority="high">
        <description>Implement component using React and TypeScript</description>
      </requirement>
      <requirement priority="high">
        <description>Use Tailwind CSS for styling</description>
      </requirement>
      <requirement priority="high">
        <description>Support drag-and-drop event handling (dragOver, drop, dragLeave)</description>
      </requirement>
      <requirement priority="medium">
        <description>Support pointer events for mobile touch interaction</description>
      </requirement>
      <requirement priority="medium">
        <description>Maintain column-specific state</description>
      </requirement>
      <requirement priority="high">
        <description>Follow single responsibility principle by handling only column concerns</description>
      </requirement>
      <requirement priority="high">
        <description>Implement type safety with TaskStatus type</description>
      </requirement>
      <requirement priority="medium">
        <description>Optimize rendering performance for large task lists</description>
      </requirement>
      <requirement priority="high">
        <description>Provide visual feedback for drag targets using conditional styling</description>
      </requirement>
      <requirement priority="high">
        <description>Receive drop placeholder positioning data from parent component</description>
      </requirement>
      <requirement priority="medium">
        <description>Display tasks with proper ordering</description>
      </requirement>
      <requirement priority="medium">
        <description>Support keyboard accessibility</description>
      </requirement>
      <requirement priority="high">
        <description>Implement precise positioning of cards based on drag location</description>
      </requirement>
    </technical-requirements>

    <behavioral-expectations>
      <expectation priority="high">
        <description>Column should highlight with a vivid blue border when a card is dragged over it</description>
      </expectation>
      <expectation priority="high">
        <description>Column should display tasks in the specified order</description>
      </expectation>
      <expectation priority="high">
        <description>Column should show a drop placeholder at the calculated position when a task is dragged over</description>
      </expectation>
      <expectation priority="medium">
        <description>Column should display a message when empty</description>
      </expectation>
      <expectation priority="medium">
        <description>Column should scroll independently when it contains many tasks</description>
      </expectation>
      <expectation priority="medium">
        <description>Column should support keyboard navigation</description>
      </expectation>
      <expectation priority="high">
        <description>Column should render TaskCard components for each task in the column</description>
      </expectation>
      <expectation priority="high">
        <description>Column should not manage global drag-and-drop state (delegated to parent ProjectBoard)</description>
      </expectation>
      <expectation priority="medium">
        <description>Column should present task cards with appropriate edit button functionality</description>
      </expectation>
      <expectation priority="high">
        <description>Column should ensure placeholders match the dimensions of dragged cards</description>
      </expectation>
      <expectation priority="high">
        <description>Column should hide task cards that are currently being dragged</description>
      </expectation>
      <expectation priority="medium">
        <description>Column should support both mouse and touch/pointer interactions</description>
      </expectation>
    </behavioral-expectations>
  </requirements>

  <interfaces>
    <interface type="props">
      <definition><![CDATA[type TaskColumnProps = {
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
};]]></definition>
    </interface>
  </interfaces>

  <implementation>
    <files>
      <file path="src/features/project_board/task_column.tsx" action="create">
        <changes>Create the TaskColumn component implementation</changes>
        <example><![CDATA[export const TaskColumn: React.FC<TaskColumnProps> = ({
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
};]]></example>
      </file>
    </files>

    <dependencies>
      <dependency type="external">react for UI components</dependency>
      <dependency type="internal">TaskCard component from src/ui/features/task_card/task_card</dependency>
      <dependency type="internal">Task and TaskStatus types from @/types</dependency>
    </dependencies>
  </implementation>

  <references>
    <reference href="./project_board.package_specs.md">Project Board Feature Package</reference>
    <reference href="./project_board.specs.md">Project Board Component</reference>
    <reference href="../../ui/features/task_card/task_card.specs.md">Task Card Component</reference>
    <reference href="../../lib/drag_drop/drag_drop_manager.specs.md">Drag and Drop Manager</reference>
  </references>
</specification>
