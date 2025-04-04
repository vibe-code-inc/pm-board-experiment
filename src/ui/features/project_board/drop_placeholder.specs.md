# Drop Placeholder Component Specification

## Overview
The DropPlaceholder component provides a visual indicator for where a dragged item will be placed when dropped. It renders a placeholder element with appropriate styling to show the insertion point during drag-and-drop operations.

## Product Requirements
- Provide clear visual feedback about where a dragged item will be placed
- Maintain consistent appearance with the overall design system
- Support appropriate sizing to match exactly the dimensions of the dragged card
- Ensure sufficient visual contrast to be easily noticed during drag operations
- Support accessibility by providing screen reader context
- Display with exactly the same width and height as the dragged item
- Show the placeholder between cards, moving them apart to create enough space
- Match the exact dimensions of the dragged card including all padding and margins
- Provide visual indication of the exact insertion point between existing cards

## Technical Requirements
- Implement using React and TypeScript
- Use Tailwind CSS for styling consistent with the application
- Support customization through props to match dragged item dimensions
- Support obtaining dimensions from the dragged element
- Optimize rendering performance
- Follow single responsibility principle by focusing only on placeholder visualization
- Support accessibility with appropriate ARIA attributes and screen reader text
- Keep the component lightweight and focused
- Calculate and apply exact dimensions of the dragged element including margins
- Support dynamic positioning between existing cards
- Use identical spacing to ensure consistent layout when item is dropped
- Ensure proper display in both horizontal and vertical layouts

## Behavioral Expectations
- Display a visual placeholder with dimensions matching the dragged card
- Adapt to different container widths and contexts
- Maintain consistent appearance across the application
- Support animation properties for enhanced visual feedback
- Provide screen reader text describing the purpose of the element
- Match width of the dragged element
- Match height of the dragged element
- Appear exactly at the position where the card would be inserted
- Move existing cards apart to create space for placeholder
- Maintain exact spacing that would occur when item is actually dropped
- Be positioned precisely between the closest items to the drag position
- Update position dynamically as dragged item moves over different drop targets
- Maintain exact visual representation of what will happen on drop
- Have identical dimensions to the dragged card including all spacing

## Component Structure
```typescript
type DropPlaceholderProps = {
  // The width of the placeholder (should match the dragged item)
  width?: string | number;
  // The height of the placeholder (should match the dragged item)
  height?: string | number;
  // Optional custom styling classes (extends default styling)
  className?: string;
  // Optional accessible label (for screen readers)
  label?: string;
  // Whether the placeholder is currently active/visible
  isActive?: boolean;
  // Optional animation properties
  animate?: boolean;
  // Optional reference to the dragged element to match dimensions
  draggedElement?: HTMLElement | null;
  // The exact position where the placeholder should be displayed
  position?: 'before' | 'after' | null;
  // The reference to the target element to position relative to
  targetElement?: HTMLElement | null;
};

export const DropPlaceholder: React.FC<DropPlaceholderProps> = ({
  width = 'auto',
  height = '4rem',
  className = '',
  label = 'Drop here',
  isActive = true,
  animate = true,
  draggedElement = null,
  position = null,
  targetElement = null
}) => {
  // Calculate exact dimensions from dragged element
  const getExactDimensions = () => {
    if (!draggedElement) return { width, height };

    // Get computed style to include padding, borders and margins
    const style = window.getComputedStyle(draggedElement);
    const margins = {
      top: parseFloat(style.marginTop),
      bottom: parseFloat(style.marginBottom),
      left: parseFloat(style.marginLeft),
      right: parseFloat(style.marginRight)
    };

    // Include margins in dimensions for exact matching
    return {
      width: `${draggedElement.offsetWidth}px`,
      height: `${draggedElement.offsetHeight}px`,
      marginTop: `${margins.top}px`,
      marginBottom: `${margins.bottom}px`,
      marginLeft: `${margins.left}px`,
      marginRight: `${margins.right}px`
    };
  };

  // Get dimensions for the placeholder
  const dimensions = getExactDimensions();

  // Calculate position relative to target element
  const calculatePosition = () => {
    if (!targetElement || !position) return {};

    if (position === 'before') {
      return { order: targetElement.style.order - 0.5 };
    } else if (position === 'after') {
      return { order: targetElement.style.order + 0.5 };
    }

    return {};
  };

  // Additional positioning styles
  const positionStyles = calculatePosition();

  // Additional class based on animation state
  const animationClass = animate ? 'animate-pulse' : '';

  // Base styling classes for the placeholder
  const baseClasses = 'task-card-placeholder rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 my-2';

  // Combined classes with any custom classes
  const combinedClasses = `${baseClasses} ${animationClass} ${className}`;

  // Don't render if not active
  if (!isActive) return null;

  return (
    <div
      className={combinedClasses}
      style={{ ...dimensions, ...positionStyles }}
      role="status"
      aria-label={label}
      data-testid="drop-placeholder"
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};
```

## Usage Examples
```tsx
// Basic usage
<DropPlaceholder />

// Custom dimensions
<DropPlaceholder width="100%" height="3rem" />

// Using dragged element reference
<DropPlaceholder draggedElement={draggedTaskCardRef.current} />

// With position relative to target
<DropPlaceholder
  draggedElement={draggedTaskCardRef.current}
  position="before"
  targetElement={document.querySelector('[data-task-id="task-2"]')}
/>

// Custom styling
<DropPlaceholder className="border-green-300 bg-green-50" />

// Custom accessible label
<DropPlaceholder label="Drop task here" />

// Without animation
<DropPlaceholder animate={false} />

// Conditionally shown
<DropPlaceholder isActive={showPlaceholder} />
```

## Related Specifications
- [Project Board Component](../../../features/project_board/project_board.specs.md)
- [Task Column Component](../../../features/project_board/task_column.specs.md)
- [Task Card Component](../../features/task_card/task_card.specs.md)
- [Drag and Drop Manager](../../../lib/drag_drop/drag_drop_manager.specs.md)
