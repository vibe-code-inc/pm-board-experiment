# Drag Preview Component Specification

## Overview
The DragPreview component creates a visual representation of an element being dragged during drag-and-drop operations. It clones the appearance of the dragged element and follows the cursor/touch point, providing clear visual feedback about what is being moved and maintaining the exact dimensions of the original element.

## Product Requirements
- Create an exact visual duplicate of the dragged element
- Follow cursor or touch point during drag operations
- Maintain same dimensions as the original dragged element
- Provide visual indication that the element is being dragged (semi-transparency)
- Support both mouse and touch-based drag operations
- Ensure drag preview is visible above all other elements
- Support pointer events for cross-device compatibility
- Automatically clean up when drag operation ends
- Ensure smooth movement that precisely follows cursor/touch
- Match exact styling of the original element but with slight transparency

## Technical Requirements
- Implement using React and TypeScript
- Use DOM APIs to create and position the drag preview
- Calculate exact dimensions including margins, padding, and borders
- Clone styling from original element
- Position element to follow cursor with appropriate offset
- Handle z-index to ensure visibility above other elements
- Support smooth animation during movement
- Clean up DOM elements when dragging ends
- Follow single responsibility principle
- Support proper accessibility attributes
- Optimize performance for smooth movement
- Support all device types through pointer events
- Implement proper clean-up on unmount and drag end
- Calculate precise position based on initial grab coordinates

## Behavioral Expectations
- Preview should be created when drag begins
- Preview should follow cursor/touch point with precise positioning
- Preview should maintain exact dimensions of original element
- Preview should be semi-transparent to indicate dragging state
- Preview should appear above all other elements
- Preview should be removed when drag ends or is canceled
- Preview should move smoothly without lag
- Preview should accurately represent the dragged element's appearance
- Preview should handle different card sizes and styles
- Preview should match original element but with visual indication it's being dragged
- Preview should have same width, height, and appearance as original
- Preview should be appended to document body to avoid positioning constraints
- Preview should be removed from DOM when no longer needed

## Component Structure
```typescript
type DragPreviewProps = {
  // Reference to the element being dragged
  sourceElement: HTMLElement | null;
  // Whether the preview is currently active/visible
  isActive: boolean;
  // Current cursor/pointer position
  position: {
    x: number;
    y: number;
  };
  // Offset from cursor to original grab point
  grabOffset?: {
    x: number;
    y: number;
  };
  // Optional opacity for the preview (default: 0.7)
  opacity?: number;
  // Optional z-index for the preview (default: 1000)
  zIndex?: number;
  // Optional callback when preview is created
  onPreviewCreated?: (previewElement: HTMLElement) => void;
};

export const DragPreview: React.FC<DragPreviewProps> = ({
  sourceElement,
  isActive,
  position,
  grabOffset = { x: 0, y: 0 },
  opacity = 0.7,
  zIndex = 1000,
  onPreviewCreated
}) => {
  // Reference to the preview element
  const previewRef = useRef<HTMLElement | null>(null);

  // Create preview element on mount or when source element changes
  useEffect(() => {
    if (!isActive || !sourceElement) return;

    // Clean up any existing preview
    if (previewRef.current) {
      document.body.removeChild(previewRef.current);
      previewRef.current = null;
    }

    // Clone the source element
    const preview = sourceElement.cloneNode(true) as HTMLElement;

    // Get computed style of the source element
    const sourceStyle = window.getComputedStyle(sourceElement);

    // Apply styles to the preview
    preview.style.position = 'fixed';
    preview.style.pointerEvents = 'none';
    preview.style.zIndex = String(zIndex);
    preview.style.opacity = String(opacity);
    preview.style.margin = '0';
    preview.style.width = `${sourceElement.offsetWidth}px`;
    preview.style.height = `${sourceElement.offsetHeight}px`;
    preview.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
    preview.style.transform = 'rotate(1deg)';

    // Position the preview
    preview.style.left = `${position.x - grabOffset.x}px`;
    preview.style.top = `${position.y - grabOffset.y}px`;

    // Append to body
    document.body.appendChild(preview);
    previewRef.current = preview;

    // Notify parent of preview creation
    if (onPreviewCreated) {
      onPreviewCreated(preview);
    }

    // Clean up on unmount
    return () => {
      if (previewRef.current) {
        document.body.removeChild(previewRef.current);
        previewRef.current = null;
      }
    };
  }, [sourceElement, isActive, opacity, zIndex, onPreviewCreated]);

  // Update position when it changes
  useEffect(() => {
    if (!previewRef.current || !isActive) return;

    previewRef.current.style.left = `${position.x - grabOffset.x}px`;
    previewRef.current.style.top = `${position.y - grabOffset.y}px`;
  }, [position, grabOffset, isActive]);

  // Clean up when preview becomes inactive
  useEffect(() => {
    if (!isActive && previewRef.current) {
      document.body.removeChild(previewRef.current);
      previewRef.current = null;
    }
  }, [isActive]);

  // This component doesn't render anything directly
  // It manipulates the DOM using refs and effects
  return null;
};
```

## Usage Examples
```tsx
// Basic usage with drag and drop manager
const App = () => {
  const {
    draggedElement,
    draggedItemId,
    cursorPosition,
    grabOffset
  } = useDragAndDropManager();

  return (
    <div>
      {/* Other components */}

      <DragPreview
        sourceElement={draggedElement}
        isActive={!!draggedItemId}
        position={cursorPosition}
        grabOffset={grabOffset}
      />
    </div>
  );
};

// With custom z-index and opacity
<DragPreview
  sourceElement={taskCardRef.current}
  isActive={isDragging}
  position={{ x: mouseX, y: mouseY }}
  grabOffset={{ x: offsetX, y: offsetY }}
  opacity={0.8}
  zIndex={2000}
/>

// With callback for preview creation
<DragPreview
  sourceElement={taskCardRef.current}
  isActive={isDragging}
  position={{ x: mouseX, y: mouseY }}
  onPreviewCreated={(previewElement) => {
    // Store reference or perform additional modifications
    customPreviewRef.current = previewElement;
  }}
/>
```

## Related Specifications
- [Project Board Component](../../../features/project_board/project_board.specs.md)
- [Task Column Component](../../../features/project_board/task_column.specs.md)
- [Task Card Component](../../features/task_card/task_card.specs.md)
- [Drag and Drop Manager](../../../lib/drag_drop/drag_drop_manager.specs.md)
- [Drop Placeholder Component](../drop_placeholder.specs.md)
