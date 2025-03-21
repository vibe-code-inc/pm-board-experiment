# Project Board Component Specification

## Overview
The ProjectBoard component is the main UI component for displaying and managing tasks in a kanban-style board. It organizes tasks into columns based on their status and provides drag-and-drop functionality for task management.

## Technical Requirements
- Implement responsive layout for all screen sizes
- Support drag and drop functionality between status columns
- Maintain local state for tasks during drag operations
- Provide visual feedback during drag operations
- Implement touch support for mobile devices
- Use column components to organize tasks by status
- Handle empty states gracefully
- Update parent component when task status changes
- Cache computations for better performance

## Behavioral Expectations
- Allow users to drag tasks between status columns
- Show visual indicators during drag operations
- Update task status immediately after successful drop
- Provide mobile-friendly interactions
- Show guide for mobile users on first visit
- Support keyboard navigation and accessibility
- Maintain task organization during viewport changes
- Support automatic scrolling when dragging near viewport edges

## Component Structure
```
<ProjectBoard>
  <Column status="todo">
    <TaskCard />
    <TaskCard />
    ...
  </Column>
  <Column status="in-progress">
    <TaskCard />
    <TaskCard />
    ...
  </Column>
  <Column status="done">
    <TaskCard />
    <TaskCard />
    ...
  </Column>
</ProjectBoard>
```

## Interfaces
```typescript
interface ProjectBoardProps {
  project: Project;
  onTaskUpdate: (taskId: string, status: Task['status']) => void;
  onTaskEdit: (task: Task) => void;
}
```

## Related Files
- project_board.tsx - Main component implementation
- ../features.spec.md - Project board feature specification

## Implementation Notes
- Uses the useMemo hook to optimize column task calculations
- Implements custom drag and drop handling with HTML5 Drag and Drop API
- Stores drag state locally to prevent UI jumps during operations
- Uses window.matchMedia to detect mobile devices
- Implements smooth scrolling during drag operations near viewport edges
