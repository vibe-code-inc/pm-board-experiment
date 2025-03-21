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

## Technical Requirements
- Build with React and TypeScript
- Use Tailwind CSS for styling
- Support responsive design for different screen sizes
- Implement proper keyboard accessibility
- Support drag-and-drop functionality
- Optimize rendering performance
- Ensure full type safety
- Use modular subcomponents for maintainability

## Behavioral Expectations
- Card should be draggable between status columns
- Clicking the card should open the task detail modal
- Visual indicators should reflect the task's priority
- Due date should be formatted appropriately
- Due date should be highlighted if near or past
- Card should provide visual feedback during drag operations
- Long text fields should be properly truncated with ellipsis
- Empty fields should be handled gracefully

## Component Structure
The Task Card consists of the following sections:
- Header (title, status indicator)
- Body (description)
- Footer (metadata - assignee, due date, priority)

## Interfaces
```typescript
interface TaskCardProps {
  task: Task;
  onClick?: (taskId: string) => void;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  className?: string;
}

interface TaskCardHeaderProps {
  title: string;
  status: Task['status'];
  className?: string;
}

interface TaskCardBodyProps {
  description: string;
  className?: string;
}

interface TaskCardFooterProps {
  priority: Task['priority'];
  assignee?: string;
  dueDate?: string;
  className?: string;
}
```

## Related Files
- task_card.tsx - Main task card component
- components/task_card_header.tsx - Header subcomponent
- components/task_card_body.tsx - Body subcomponent
- components/task_card_footer.tsx - Footer subcomponent

## Related Specifications
- [Task Card Component](./components/task_card_header.tsx.spec.md)
- [Task Modal Component](../task_modal/features.spec.md)
- [Project Board Feature](../../../features/project_board/features.spec.md)
