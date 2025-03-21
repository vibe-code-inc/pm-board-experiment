# Task Card Component Specification

## Overview
The Task Card component displays a task's information in a card format. It is used in the Project Board to represent tasks within status columns and provides a concise visual representation of task details.

## Product Requirements
- Display task title prominently
- Show task description (truncated if necessary)
- Indicate task priority with visual cues
- Display assignee information
- Show due date with appropriate formatting
- Support interaction states (hover, focus, active)
- Enable click to view/edit task details
- Support drag-and-drop functionality for changing task status

## Technical Requirements
- Build with React and TypeScript
- Use base components from the design kit
- Implement responsive layout
- Support drag-and-drop operations
- Ensure accessibility for keyboard users and screen readers
- Optimize rendering performance for boards with many tasks

## Behavioral Expectations
- Cards should expand to reveal more details on click
- Drag operations should provide clear visual feedback
- Priority indicators should use consistent color coding
- Due dates should be formatted in a user-friendly way
- Due dates approaching or past should be highlighted
- Long titles and descriptions should be truncated with ellipsis
- Task cards should maintain a consistent height when possible

## Interfaces
```typescript
interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}
```

## Related Files
- task_card.tsx - Main component implementation
- task_card_styles.ts - Styling utilities for the task card
- priority_badge.tsx - Component for displaying task priority

## Color Coding
Task priorities should use the following color schemes:
- High: bg-red-100 text-red-800
- Medium: bg-yellow-100 text-yellow-800
- Low: bg-blue-100 text-blue-800
