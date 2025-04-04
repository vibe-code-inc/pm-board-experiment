# Task Card Component Specification

## Overview
The Task Card component displays a visual representation of a task within the application. It shows the task's key information in a compact, scannable format and supports interactions such as viewing details, editing, and being a draggable element.

## Product Requirements
- Display task title prominently
- Show task description (truncated if too long)
- Indicate task priority with visual cues (color coding)
- Show task status through visual indication
- Display assignee information when available
- Show due date with appropriate formatting and color indicators for approaching/past dates
- Support clicking to view/edit task details
- Provide a dedicated edit button/icon for quick edit access
- Support being dragged between columns and within columns
- Provide visual feedback for interactive states (hover, drag)
- Show appropriate truncation for overly long content
- Support touch-based drag and drop on mobile devices
- Provide a vertical grip handle for dragging on mobile
- Indicate itself when being dragged with semi-transparency
- Be removed from source list when picked up during drag operations
- Support drag preview that follows cursor/touch point during dragging
- Maintain exact dimensions in drag preview as the original card

## Technical Requirements
- Build with React and TypeScript
- Use Tailwind CSS for styling
- Implement type safety with proper type definitions (not interfaces)
- Support responsive design for different screen sizes
- Implement proper keyboard accessibility
- Support drag-and-drop functionality with appropriate event handlers
- Optimize rendering performance with appropriate React hooks
- Implement auto-scrolling during drag operations
- Support touchscreen-based drag and drop with dedicated touch handlers
- Handle both mouse and touch events appropriately with pointer events
- Create a reusable component that follows single responsibility principle
- Use refs for DOM manipulation during drag operations
- Maintain accessibility during all interaction states
- Properly communicate drag events to parent components
- Implement drag preview that exactly matches the card's appearance
- Support removal from source list during drag operations
- Integrate with the drag and drop manager for coordinated drag behavior
- Support mobile interactions using pointer events API

## Behavioral Expectations
- Card should be draggable between status columns
- Card should be draggable within the same column for reordering
- Clicking the card should open the task detail modal
- Clicking the edit button/icon should log "Edit {taskId} {taskTitle}" to the console
- Visual indicators should reflect the task's priority
- Due date should be formatted appropriately
- Due date should be highlighted in yellow if approaching (within 3 days)
- Due date should be highlighted in red if past due
- Card should provide visual feedback during drag operations
- When being dragged, the card should appear semi-transparent
- Long text fields should be properly truncated with ellipsis
- Empty fields (like missing assignee) should be handled gracefully
- Auto-scrolling should activate when dragging near screen edges
- Touch-based dragging should only activate when using the grip handle
- Screen should auto-scroll during dragging operations
- Card should be removed from its original position when dragging starts
- Drag preview should be created that matches the card's appearance exactly
- Drag preview should follow the cursor/touch point during dragging
- Drag preview should be removed when dragging ends
- Card should be added to the exact position where it was dropped
- All drag interactions should work on mobile devices with pointer events

## Component Structure
```typescript
type TaskCardProps = {
  task: Task;
  onStatusChange: (status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDragStart?: (taskId: string, status: Task['status'], element: HTMLElement) => void;
  onDragEnd?: () => void;
  // Flag to indicate the card is being dragged
  isDragging?: boolean;
};

// Color maps for visual styling
const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusColors = {
  'todo': 'bg-gray-100',
  'in-progress': 'bg-purple-100',
  'done': 'bg-green-100',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onEdit,
  onDragStart,
  onDragEnd,
  isDragging = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [touchDragging, setTouchDragging] = useState(false);
  const [scrollInterval, setScrollInterval] = useState<number | null>(null);

  // Helper functions for date formatting and status checking
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    // Set task ID and status in the drag data
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('taskStatus', task.status);

    // Notify parent component if callback exists
    if (onDragStart && cardRef.current) {
      onDragStart(task.id, task.status, cardRef.current);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Notify parent component if callback exists
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleAutoScroll = (e: React.DragEvent | React.TouchEvent | MouseEvent) => {
    // Auto-scroll implementation when dragging near screen edges
  };

  // Pointer event handlers for mobile
  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    // Only start drag if user is touching the grip handle
    if (!e.target || !(e.target as HTMLElement).closest('.drag-handle')) return;

    // Capture the pointer to track movement
    e.currentTarget.setPointerCapture(e.pointerId);
    setTouchDragging(true);

    // Notify parent component of drag start
    if (onDragStart && cardRef.current) {
      onDragStart(task.id, task.status, cardRef.current);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!touchDragging) return;

    // Get drag position for the drag preview
    const position = {
      x: e.clientX,
      y: e.clientY
    };

    // This is handled by the drag and drop manager
    // which updates the drag preview position
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!touchDragging) return;

    // Release pointer capture
    e.currentTarget.releasePointerCapture(e.pointerId);
    setTouchDragging(false);

    // Notify parent component of drag end
    if (onDragEnd) {
      onDragEnd();
    }
  };

  // Handle edit button click
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal
    console.log(`Edit ${task.id} ${task.title}`);
  };

  // If this card is being dragged, it should be visually hidden
  // as the drag preview is showing instead
  if (isDragging) {
    return null;
  }

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-lg shadow-sm p-3 mb-2 border-l-4 ${
        statusColors[task.status]
      } cursor-pointer hover:shadow-md transition-shadow`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={() => onEdit(task)}
      data-task-id={task.id}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
        <div className="flex items-center">
          <div className="drag-handle mr-2 touch-manipulation cursor-grab p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="6" r="2" />
              <circle cx="8" cy="12" r="2" />
              <circle cx="8" cy="18" r="2" />
              <circle cx="16" cy="6" r="2" />
              <circle cx="16" cy="12" r="2" />
              <circle cx="16" cy="18" r="2" />
            </svg>
          </div>
          <button
            onClick={handleEditClick}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Card content */}
    </div>
  );
};
```

## Related Specifications
- [Feature UI Components](../features.package_specs.md)
- [Task Modal Component](../task_modal/task_modal.specs.md)
- [Project Board Feature](../../../features/project_board/project_board.package_specs.md)
- [Drag and Drop Manager](../../../lib/drag_drop/drag_drop_manager.specs.md)
- [Drop Placeholder Component](../../../ui/features/project_board/drop_placeholder.specs.md)
