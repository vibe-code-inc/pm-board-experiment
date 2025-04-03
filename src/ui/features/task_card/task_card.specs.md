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
- Support being dragged between columns and within columns
- Provide visual feedback for interactive states (hover, drag)
- Show appropriate truncation for overly long content
- Support touch-based drag and drop on mobile devices
- Provide a vertical grip handle for dragging on mobile
- Indicate itself when being dragged with semi-transparency

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
- Handle both mouse and touch events appropriately
- Create a reusable component that follows single responsibility principle
- Use refs for DOM manipulation during drag operations
- Maintain accessibility during all interaction states
- Properly communicate drag events to parent components

## Behavioral Expectations
- Card should be draggable between status columns
- Card should be draggable within the same column for reordering
- Clicking the card should open the task detail modal
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

## Component Structure
```typescript
type TaskCardProps = {
  task: Task;
  onStatusChange: (status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDragStart?: (taskId: string, status: Task['status']) => void;
  onDragEnd?: () => void;
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
  onDragEnd
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
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
    setIsDragging(true);

    // Notify parent component if callback exists
    if (onDragStart) {
      onDragStart(task.id, task.status);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Clean up drag state
    setIsDragging(false);

    // Notify parent component if callback exists
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleAutoScroll = (e: React.DragEvent | React.TouchEvent | MouseEvent) => {
    // Auto-scroll implementation when dragging near screen edges
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Touch start implementation
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Touch move implementation
  };

  const handleTouchEnd = () => {
    // Touch end implementation
  };

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-lg shadow-sm p-3 mb-2 border-l-4 ${
        statusColors[task.status]
      } cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => onEdit(task)}
      data-task-id={task.id}
    >
      {/* Card content */}
    </div>
  );
};
```

## Related Specifications
- [Feature UI Components](../features.package_specs.md)
- [Task Modal Component](../task_modal/task_modal.specs.md)
- [Project Board Feature](../../../features/project_board/project_board.package_specs.md)
