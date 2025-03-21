# Column Component Specification

## Overview
The Column component displays a collection of tasks with the same status. It acts as a drop target for task cards and visually represents one of the three status categories (todo, in-progress, done).

## Technical Requirements
- Serve as a drop target for drag and drop operations
- Visually indicate when being dragged over
- Display a list of TaskCard components
- Support vertical scrolling when content exceeds available height
- Show task count in the column header
- Maintain consistent width across different screen sizes
- Automatically adjust height based on available viewport
- Use correct ARIA attributes for accessibility

## Behavioral Expectations
- Highlight column when a task is dragged over it
- Accept dropped tasks and update their status
- Display appropriate "empty state" when no tasks are present
- Show the number of tasks in the column header
- Maintain scroll position during drag operations
- Support keyboard navigation between tasks
- Collapse to appropriate width on smaller screens
- Grow to use available space on larger screens

## Component Structure
```
<Column>
  <ColumnHeader />
  <div className="column-content">
    <TaskCard />
    <TaskCard />
    ...
    <EmptyState /> <!-- Shown when no tasks exist -->
  </div>
</Column>
```

## Interfaces
```typescript
interface ColumnProps {
  status: Task['status'];
  tasks: Task[];
  onTaskDrop: (taskId: string, newStatus: Task['status']) => void;
  onTaskEdit: (taskId: string) => void;
}

interface ColumnHeaderProps {
  title: string;
  count: number;
}
```

## Related Files
- column.tsx - Main column component (may be embedded in project_board.tsx)
- column_header.tsx - Header component for the column
- ../project_board.tsx - Parent component

## Implementation Notes
- Uses CSS Grid or Flexbox for layout
- Implements HTML5 drop zone functionality
- Uses CSS transitions for smooth hover effects
- Maintains fixed width with responsive adjustments
- Uses scrolling container for overflow content
