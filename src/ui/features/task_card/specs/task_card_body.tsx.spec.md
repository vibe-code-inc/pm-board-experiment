# Task Card Body Component Specification

## Overview
The TaskCardBody component displays the description of a task in a truncated format. It represents the middle section of the TaskCard component and provides a preview of the task's content.

## Technical Requirements
- Display task description with appropriate truncation
- Support multi-line text with readable formatting
- Maintain consistent height constraints
- Handle empty descriptions gracefully
- Optimize rendering performance
- Support proper text scaling
- Maintain consistent spacing

## Behavioral Expectations
- Truncate descriptions that exceed the maximum height
- Display "No description" or similar text for empty descriptions
- Adjust font size for better readability on different devices
- Preserve paragraph breaks if present in the description
- Maintain proper spacing with other card elements
- Render plain text with appropriate line breaking

## Component Structure
```
<div className="task-card-body">
  {description ? (
    <p className="task-description">{description}</p>
  ) : (
    <p className="task-description-empty">No description provided</p>
  )}
</div>
```

## Interfaces
```typescript
interface TaskCardBodyProps {
  description: string;
  maxLines?: number;
  className?: string;
}
```

## Related Files
- task_card_body.tsx - Main component implementation
- ../task_card.tsx - Parent component
- ../../task_card/features.spec.md - Task card feature specification

## Implementation Notes
- Uses CSS line-clamp for text truncation
- Implements subtle styling for empty state
- Uses appropriate line height for readability
- Maintains fixed or minimum height for consistent card appearance
- Uses semantic paragraph elements
- Applies subtle text color for better visual hierarchy
