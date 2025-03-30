# Task Card Component Specification

## Overview
The Task Card component displays a visual representation of a task within the application. It shows the task's key information in a compact, scannable format and supports interactions such as viewing details, editing, and drag-and-drop for status changes.

## Product Requirements
- Display task title prominently
- Show task description (truncated if too long)
- Indicate task priority with visual cues (color, icon)
- Show task status
- Display assignee information
- Show due date with appropriate formatting
- Support clicking to view/edit task details
- Support drag-and-drop for task status changes
- Provide visual feedback for interactive states
- Show appropriate truncation for overly long content
- Support touch-based drag and drop on mobile devices
- Provide a vertical grip handle for dragging on mobile

## Technical Requirements
- Build with React and TypeScript
- Use Tailwind CSS for styling
- Support responsive design for different screen sizes
- Implement proper keyboard accessibility
- Support drag-and-drop functionality
- Optimize rendering performance
- Ensure full type safety
- Implement auto-scrolling during drag operations
- Detect safe areas for notched mobile devices
- Support touchscreen-based drag and drop
- Handle both mouse and touch events appropriately
- Implement throttling for performance-critical operations

## Behavioral Expectations
- Card should be draggable between status columns
- Clicking the card should open the task detail modal
- Visual indicators should reflect the task's priority
- Due date should be formatted appropriately
- Due date should be highlighted if near or past
- Card should provide visual feedback during drag operations
- When being dragged, a placeholder with the same dimensions as the card and a blue border must appear at potential drop positions
- Long text fields should be properly truncated with ellipsis
- Empty fields should be handled gracefully
- Auto-scrolling should activate when dragging near screen edges
- Touch-based dragging should only activate when using the grip handle
- Screen should auto-scroll during dragging operations

## Component Structure
The Task Card is implemented as a single component with sections for:
- Header area (title, status indicator)
- Body area (description)
- Footer area (metadata - assignee, due date, priority)
- Modal for editing task details
- Drag handle for mobile interaction

## Interfaces
```typescript
interface TaskCardProps {
  task: Task;
  onStatusChange: (status: Task['status']) => void;
  onEdit: (task: Task) => void;
  columnTasks?: Task[]; // Tasks in the current column for reordering
  onReorder?: (draggedTaskId: string, targetTaskId: string) => void; // Callback for reordering
}

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
```

## Related Specifications
- [Feature UI Components](../features.package_specs.md)
- [Task Modal Component](../task_modal/task_modal.specs.md)
- [Project Board Feature](../../../features/project_board/project_board.package_specs.md)
