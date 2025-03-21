# Task Card Footer Component Specification

## Overview
The TaskCardFooter component displays metadata about a task, including priority, assignee, and due date. It represents the bottom section of the TaskCard component and provides additional context about the task.

## Technical Requirements
- Display task priority with appropriate visual indicator
- Show assignee information if available
- Format and display due date if available
- Handle cases where metadata is missing
- Support responsive layout for different screen sizes
- Maintain consistent height
- Use appropriate icons for visual reinforcement

## Behavioral Expectations
- Show priority with color-coded badge
- Display assignee name with appropriate truncation
- Format due date in a user-friendly way
- Highlight due dates that are past or approaching
- Omit sections for missing data without disrupting layout
- Maintain proper spacing with other card elements
- Represent information in a compact, scannable format

## Component Structure
```
<div className="task-card-footer">
  <div className="priority-badge" data-priority={priority}>
    <Flag size={14} />
    <span>{priority}</span>
  </div>

  {assignee && (
    <div className="assignee">
      <span className="assignee-name">{assignee}</span>
    </div>
  )}

  {dueDate && (
    <div className="due-date" data-status={getDueDateStatus(dueDate)}>
      <Clock size={14} />
      <span>{formatDate(dueDate)}</span>
    </div>
  )}
</div>
```

## Interfaces
```typescript
interface TaskCardFooterProps {
  priority: Task['priority'];
  assignee?: string;
  dueDate?: string;
  className?: string;
}
```

## Related Files
- task_card_footer.tsx - Main component implementation
- ../task_card.tsx - Parent component
- ../../task_card/features.spec.md - Task card feature specification

## Implementation Notes
- Uses color coding based on priority level
- Implements date formatting for better readability
- Uses Lucide icons for visual indicators
- Implements responsive layout with flexbox
- Calculates due date status (overdue, upcoming, etc.)
- Uses subtle separators between metadata items
- Ensures sufficient contrast for all text elements
