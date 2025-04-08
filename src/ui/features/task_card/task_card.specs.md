---
description: Task Card Component Specification
type: component
---

<specification>
  <meta>
    <title>Task Card Component</title>
    <description>Displays a visual representation of a task within the application with drag-and-drop support</description>
    <created-at utc-timestamp="1712678400">April 9, 2024, 10:00 AM EDT</created-at>
    <applies-to>
      <file-matcher glob="src/ui/features/task_card/task_card.tsx">Task Card Component</file-matcher>
    </applies-to>
  </meta>

  <overview>
    <description>The Task Card component displays a visual representation of a task within the application. It shows the task's key information in a compact, scannable format and supports interactions such as viewing details, editing, and being a draggable element.</description>
    <responsibility>Display task information and provide drag-and-drop functionality for task movement</responsibility>
  </overview>

  <requirements>
    <functional-requirements>
      <requirement priority="high">
        <description>Display task title prominently</description>
      </requirement>
      <requirement priority="high">
        <description>Show task description (truncated if too long)</description>
      </requirement>
      <requirement priority="high">
        <description>Indicate task priority with visual cues (color coding)</description>
      </requirement>
      <requirement priority="high">
        <description>Show task status through visual indication</description>
      </requirement>
      <requirement priority="medium">
        <description>Display assignee information when available</description>
      </requirement>
      <requirement priority="high">
        <description>Show due date with appropriate formatting and color indicators for approaching/past dates</description>
      </requirement>
      <requirement priority="high">
        <description>Support clicking to view/edit task details</description>
      </requirement>
      <requirement priority="medium">
        <description>Provide a dedicated edit button/icon for quick edit access</description>
      </requirement>
      <requirement priority="high">
        <description>Support being dragged between columns and within columns</description>
      </requirement>
      <requirement priority="high">
        <description>Provide visual feedback for interactive states (hover, drag)</description>
      </requirement>
      <requirement priority="medium">
        <description>Show appropriate truncation for overly long content</description>
      </requirement>
      <requirement priority="medium">
        <description>Support touch-based drag and drop on mobile devices</description>
      </requirement>
      <requirement priority="medium">
        <description>Provide a vertical grip handle for dragging on mobile</description>
      </requirement>
      <requirement priority="high">
        <description>Indicate itself when being dragged with semi-transparency</description>
      </requirement>
      <requirement priority="high">
        <description>Be removed from source list when picked up during drag operations</description>
      </requirement>
      <requirement priority="high">
        <description>Support drag preview that follows cursor/touch point during dragging</description>
      </requirement>
      <requirement priority="high">
        <description>Maintain exact dimensions in drag preview as the original card</description>
      </requirement>
    </functional-requirements>

    <technical-requirements>
      <requirement priority="high">
        <description>Build with React and TypeScript</description>
      </requirement>
      <requirement priority="high">
        <description>Use Tailwind CSS for styling</description>
      </requirement>
      <requirement priority="high">
        <description>Implement type safety with proper type definitions (not interfaces)</description>
      </requirement>
      <requirement priority="medium">
        <description>Support responsive design for different screen sizes</description>
      </requirement>
      <requirement priority="medium">
        <description>Implement proper keyboard accessibility</description>
      </requirement>
      <requirement priority="high">
        <description>Support drag-and-drop functionality with appropriate event handlers</description>
      </requirement>
      <requirement priority="medium">
        <description>Optimize rendering performance with appropriate React hooks</description>
      </requirement>
      <requirement priority="medium">
        <description>Implement auto-scrolling during drag operations</description>
      </requirement>
      <requirement priority="medium">
        <description>Support touchscreen-based drag and drop with dedicated touch handlers</description>
      </requirement>
      <requirement priority="medium">
        <description>Handle both mouse and touch events appropriately with pointer events</description>
      </requirement>
      <requirement priority="high">
        <description>Create a reusable component that follows single responsibility principle</description>
      </requirement>
      <requirement priority="medium">
        <description>Use refs for DOM manipulation during drag operations</description>
      </requirement>
      <requirement priority="medium">
        <description>Maintain accessibility during all interaction states</description>
      </requirement>
      <requirement priority="high">
        <description>Properly communicate drag events to parent components</description>
      </requirement>
      <requirement priority="high">
        <description>Implement drag preview that exactly matches the card's appearance</description>
      </requirement>
      <requirement priority="high">
        <description>Support removal from source list during drag operations</description>
      </requirement>
      <requirement priority="high">
        <description>Integrate with the drag and drop manager for coordinated drag behavior</description>
      </requirement>
      <requirement priority="medium">
        <description>Support mobile interactions using pointer events API</description>
      </requirement>
    </technical-requirements>

    <behavioral-expectations>
      <expectation priority="high">
        <description>Card should be draggable between status columns</description>
      </expectation>
      <expectation priority="high">
        <description>Card should be draggable within the same column for reordering</description>
      </expectation>
      <expectation priority="high">
        <description>Clicking the card should open the task detail modal</description>
      </expectation>
      <expectation priority="medium">
        <description>Clicking the edit button/icon should log "Edit {taskId} {taskTitle}" to the console</description>
      </expectation>
      <expectation priority="high">
        <description>Visual indicators should reflect the task's priority</description>
      </expectation>
      <expectation priority="medium">
        <description>Due date should be formatted appropriately</description>
      </expectation>
      <expectation priority="medium">
        <description>Due date should be highlighted in yellow if approaching (within 3 days)</description>
      </expectation>
      <expectation priority="medium">
        <description>Due date should be highlighted in red if past due</description>
      </expectation>
      <expectation priority="high">
        <description>Card should provide visual feedback during drag operations</description>
      </expectation>
      <expectation priority="high">
        <description>When being dragged, the card should appear semi-transparent</description>
      </expectation>
      <expectation priority="medium">
        <description>Long text fields should be properly truncated with ellipsis</description>
      </expectation>
      <expectation priority="medium">
        <description>Empty fields (like missing assignee) should be handled gracefully</description>
      </expectation>
      <expectation priority="medium">
        <description>Auto-scrolling should activate when dragging near screen edges</description>
      </expectation>
      <expectation priority="medium">
        <description>Touch-based dragging should only activate when using the grip handle</description>
      </expectation>
      <expectation priority="medium">
        <description>Screen should auto-scroll during dragging operations</description>
      </expectation>
      <expectation priority="high">
        <description>Card should be removed from its original position when dragging starts</description>
      </expectation>
      <expectation priority="high">
        <description>Drag preview should be created that matches the card's appearance exactly</description>
      </expectation>
      <expectation priority="high">
        <description>Drag preview should follow the cursor/touch point during dragging</description>
      </expectation>
      <expectation priority="high">
        <description>Drag preview should be removed when dragging ends</description>
      </expectation>
      <expectation priority="high">
        <description>Card should be added to the exact position where it was dropped</description>
      </expectation>
      <expectation priority="medium">
        <description>All drag interactions should work on mobile devices with pointer events</description>
      </expectation>
    </behavioral-expectations>
  </requirements>

  <interfaces>
    <interface type="props">
      <definition><![CDATA[type TaskCardProps = {
  task: Task;
  onStatusChange: (status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDragStart?: (taskId: string, status: Task['status'], element: HTMLElement) => void;
  onDragEnd?: () => void;
  // Flag to indicate the card is being dragged
  isDragging?: boolean;
};]]></definition>
    </interface>
    <interface type="helpers">
      <definition><![CDATA[// Color maps for visual styling
const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusColors = {
  'todo': 'bg-gray-100',
  'in-progress': 'bg-purple-100',
  'done': 'bg-green-100',
};]]></definition>
    </interface>
  </interfaces>

  <implementation>
    <files>
      <file path="src/ui/features/task_card/task_card.tsx" action="create">
        <changes>Create TaskCard component implementation following the specification</changes>
        <example><![CDATA[export const TaskCard: React.FC<TaskCardProps> = ({
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

  // Additional handlers omitted for brevity...

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
      {/* Card content implementation */}
    </div>
  );
};]]></example>
      </file>
    </files>

    <dependencies>
      <dependency type="external">react for UI components</dependency>
      <dependency type="external">react hooks for state and refs</dependency>
      <dependency type="internal">Task type from @/types</dependency>
    </dependencies>
  </implementation>

  <references>
    <reference href="../features.package_specs.md">Feature UI Components</reference>
    <reference href="../task_modal/task_modal.specs.md">Task Modal Component</reference>
    <reference href="../../../features/project_board/project_board.package_specs.md">Project Board Feature</reference>
    <reference href="../../../lib/drag_drop/drag_drop_manager.specs.md">Drag and Drop Manager</reference>
    <reference href="../../../ui/features/project_board/drop_placeholder.specs.md">Drop Placeholder Component</reference>
  </references>
</specification>
