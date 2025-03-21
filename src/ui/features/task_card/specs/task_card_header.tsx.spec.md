# Task Card Header Component Specification

## Overview
The TaskCardHeader component displays the title of a task and provides visual indicators for the task's status. It represents the top section of the TaskCard component.

## Technical Requirements
- Display the task title prominently
- Provide visual indication of task status
- Support text truncation for long titles
- Maintain consistent height across all instances
- Handle text overflow gracefully
- Render as a semantic heading element
- Support optional drag handle for reordering

## Behavioral Expectations
- Truncate long titles with ellipsis
- Scale appropriately on different device sizes
- Provide sufficient contrast for readability
- Maintain proper spacing with other card elements
- Show status indicator appropriate to the task's status
- Support focus states for keyboard navigation

## Component Structure
```
<div className="task-card-header">
  <h3 className="task-title">{title}</h3>
  <div className="status-indicator" data-status={status}></div>
  {showDragHandle && (
    <div className="drag-handle">
      <GripVertical size={16} />
    </div>
  )}
</div>
```

## Interfaces
```typescript
interface TaskCardHeaderProps {
  title: string;
  status: Task['status'];
  showDragHandle?: boolean;
  className?: string;
}
```

## Related Files
- task_card_header.tsx - Main component implementation
- ../task_card.tsx - Parent component
- ../../task_card/features.spec.md - Task card feature specification

## Implementation Notes
- Uses Tailwind CSS for styling
- Limits title to 1-2 lines with text-overflow: ellipsis
- Uses subtle visual indicators for status representation
- Implements clean, minimal design to maintain focus on content
- Uses semantic HTML for better accessibility
