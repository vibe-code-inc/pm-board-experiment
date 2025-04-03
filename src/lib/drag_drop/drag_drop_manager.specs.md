# Drag and Drop Manager Specification

## Overview
The DragAndDropManager provides functionality for handling complex drag-and-drop operations across the application, with a primary focus on task management interfaces. It abstracts the logic for calculating drop positions, managing drag states, and coordinating visual feedback during drag operations.

## Product Requirements
- Support drag-and-drop operations between different containers (e.g., columns)
- Support reordering items within the same container
- Calculate precise drop positions between items
- Track the currently dragged item
- Track which container is being dragged over
- Determine the exact insertion position within containers
- Provide necessary information for rendering visual feedback

## Technical Requirements
- Implement using TypeScript with strong type safety
- Use a functional, hooks-based approach for React integration
- Follow single responsibility principle by focusing only on drag-and-drop logic
- Decouple from specific UI components to ensure reusability
- Provide a clean API for components to consume
- Optimize calculations for performance
- Support both mouse and touch interactions
- Handle edge cases like empty containers
- Support accessibility requirements
- Maintain stateless design where possible

## Behavioral Expectations
- Accurately track which item is being dragged
- Determine the closest items to a drag point
- Calculate whether an item should be placed before or after a target item
- Track which container is currently being hovered
- Handle the transition of items between containers
- Support item reordering within the same container
- Provide position data for rendering placeholders

## Interface
```typescript
type DragItem = {
  id: string;
  containerId: string;
  [key: string]: any;
};

type DropPlaceholderPosition = {
  containerId: string;
  targetId: string | null;
  position: 'before' | 'after';
};

type DragAndDropManagerProps = {
  // Optional initial state
  initialDraggedItem?: string | null;
  initialDraggedOverContainer?: string | null;
  initialDropPosition?: DropPlaceholderPosition | null;
};

type DragAndDropManager = {
  // Current drag state
  draggedItemId: string | null;
  draggedOverContainerId: string | null;
  dropPlaceholderPosition: DropPlaceholderPosition | null;

  // Handlers for drag events
  handleDragStart: (itemId: string, containerId: string) => void;
  handleDragEnd: () => void;
  handleContainerDragOver: (
    e: React.DragEvent<HTMLElement>,
    containerId: string,
    itemElements: Element[]
  ) => void;
  handleContainerDragLeave: () => void;
  handleContainerDrop: (
    e: React.DragEvent<HTMLElement>,
    containerId: string
  ) => {
    itemId: string,
    sourceContainerId: string,
    targetId: string | null,
    position: 'before' | 'after' | null
  } | null;

  // Helper methods
  findClosestItem: (
    clientY: number,
    itemElements: Element[],
    excludeItemId?: string
  ) => { itemId: string; position: 'before' | 'after' } | null;

  // Reset methods
  resetDragState: () => void;
};

// The hook to use the manager
export function useDragAndDropManager({
  initialDraggedItem = null,
  initialDraggedOverContainer = null,
  initialDropPosition = null,
}: DragAndDropManagerProps = {}): DragAndDropManager;
```

## Implementation Details

### Core Functions
1. **handleDragStart**: Sets the currently dragged item and its source container
2. **handleDragEnd**: Resets all drag state
3. **handleContainerDragOver**:
   - Updates the currently dragged-over container
   - Calculates drop position based on cursor location
   - Determines if item should be placed before or after a target
4. **handleContainerDragLeave**: Clears the dragged-over container state
5. **handleContainerDrop**:
   - Extracts the dragged item ID from event data
   - Returns data needed for the actual move/reorder operation
   - Resets drag state
6. **findClosestItem**:
   - Calculates distances to each item's boundaries
   - Determines the closest item and whether to place before or after it
   - Returns null for empty containers

### Usage Example
```typescript
// In a component that manages drag and drop
function BoardComponent() {
  const {
    draggedItemId,
    draggedOverContainerId,
    dropPlaceholderPosition,
    handleDragStart,
    handleDragEnd,
    handleContainerDragOver,
    handleContainerDragLeave,
    handleContainerDrop
  } = useDragAndDropManager();

  // Component-specific state and handlers
  const [items, setItems] = useState<ItemsByContainer>({
    'container1': [/* items */],
    'container2': [/* items */],
  });

  const handleItemMoved = (
    itemId: string,
    sourceContainerId: string,
    targetContainerId: string,
    targetId: string | null,
    position: 'before' | 'after' | null
  ) => {
    // Update state to move the item in the appropriate position
  };

  const onContainerDrop = (e: React.DragEvent<HTMLElement>, containerId: string) => {
    const result = handleContainerDrop(e, containerId);
    if (result) {
      const { itemId, sourceContainerId, targetId, position } = result;
      handleItemMoved(itemId, sourceContainerId, containerId, targetId, position);
    }
  };

  return (
    <div className="board">
      {Object.entries(items).map(([containerId, containerItems]) => (
        <Container
          key={containerId}
          id={containerId}
          items={containerItems}
          isDraggedOver={draggedOverContainerId === containerId}
          dropPlaceholderPosition={dropPlaceholderPosition}
          onDragOver={(e) => {
            const containerElement = e.currentTarget;
            const itemElements = Array.from(
              containerElement.querySelectorAll('[data-item-id]')
            );
            handleContainerDragOver(e, containerId, itemElements);
          }}
          onDragLeave={handleContainerDragLeave}
          onDrop={(e) => onContainerDrop(e, containerId)}
          onItemDragStart={(itemId) => handleDragStart(itemId, containerId)}
          onItemDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
}
```

## Related Specifications
- [Project Board Component](../../features/project_board/project_board.specs.md)
- [Task Column Component](../../features/project_board/task_column.specs.md)
- [Task Card Component](../../ui/features/task_card/task_card.specs.md)
