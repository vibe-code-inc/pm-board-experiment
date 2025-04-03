# Drag and Drop Manager Specification

## Overview
The DragAndDropManager provides functionality for handling complex drag-and-drop operations across the application, with a primary focus on task management interfaces. It abstracts the logic for calculating drop positions, managing drag states, and coordinating visual feedback during drag operations.

## Product Requirements
- Support drag-and-drop operations between different containers (e.g., columns)
- Support reordering items within the same container
- Calculate precise drop positions between items
- Ensure dropped items are placed between the closest items where the cursor/touch is positioned
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
- Implement precise position calculation algorithms for determining drop positions

## Behavioral Expectations
- Accurately track which item is being dragged
- Determine the closest items to a drag point
- Calculate whether an item should be placed before or after a target item based on the cursor/touch position
- Handle all cases for positioning - not just beginning/end of lists but precise middle positions
- Provide exact positional information to ensure items are placed exactly where they are dropped
- Track which container is currently being hovered
- Handle the transition of items between containers
- Support item reordering within the same container
- Provide position data for rendering placeholders with the same dimensions as the dragged item
- Work seamlessly on mobile devices with touch support

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
  // Reference to the dragged element (for dimension matching)
  draggedElement: HTMLElement | null;

  // Handlers for drag events
  handleDragStart: (itemId: string, containerId: string, element: HTMLElement) => void;
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
1. **handleDragStart**:
   - Sets the currently dragged item and its source container
   - Stores reference to the dragged DOM element for dimension matching
   - Captures initial dimensions of the dragged element

2. **handleDragEnd**: Resets all drag state

3. **handleContainerDragOver**:
   - Updates the currently dragged-over container
   - Calculates drop position based on cursor location
   - Determines if item should be placed before or after a target
   - Identifies the exact two items between which the dragged item should be placed

4. **handleContainerDragLeave**: Clears the dragged-over container state

5. **handleContainerDrop**:
   - Extracts the dragged item ID from event data
   - Provides precise position information for the drop target
   - Returns data needed for the actual move/reorder operation with exact position information
   - Resets drag state

6. **findClosestItem**:
   - Calculates distances to each item's boundaries
   - Determines the closest item based on cursor Y position
   - Computes the exact position (before or after) for precise placement
   - Returns null for empty containers

### Precise Positioning Algorithm
The manager implements a precise positioning algorithm that:
1. Calculates the Y-position of the cursor/touch point
2. Maps all droppable items in the container with their positions and dimensions
3. Calculates the distance from the cursor to each item
4. Finds the item(s) closest to the cursor position
5. Determines if the dragged item should go before or after the closest item
6. Handles special cases like:
   - Empty containers
   - Dropping at the beginning or end of a list
   - Dropping between two specific items in the middle of a list

### Usage Example
```typescript
// In a component that manages drag and drop
function BoardComponent() {
  const {
    draggedItemId,
    draggedOverContainerId,
    dropPlaceholderPosition,
    draggedElement,
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
    // Implementation that ensures the item is placed at the exact position specified
    // This means inserting it precisely between the two items closest to where it was dropped
    setItems(prevItems => {
      const newItems = {...prevItems};

      // Remove item from source container
      const item = prevItems[sourceContainerId].find(item => item.id === itemId);
      newItems[sourceContainerId] = prevItems[sourceContainerId].filter(item => item.id !== itemId);

      if (!item) return prevItems;

      // Insert item at the correct position in target container
      if (targetId === null) {
        // Add to end of container if no target
        newItems[targetContainerId] = [...newItems[targetContainerId], item];
      } else {
        // Insert before or after the target, at the exact position
        const targetIndex = newItems[targetContainerId].findIndex(item => item.id === targetId);
        const insertIndex = position === 'after' ? targetIndex + 1 : targetIndex;

        newItems[targetContainerId] = [
          ...newItems[targetContainerId].slice(0, insertIndex),
          item,
          ...newItems[targetContainerId].slice(insertIndex)
        ];
      }

      return newItems;
    });
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
          draggedElement={draggedElement}
          onDragOver={(e) => {
            const containerElement = e.currentTarget;
            const itemElements = Array.from(
              containerElement.querySelectorAll('[data-item-id]')
            );
            handleContainerDragOver(e, containerId, itemElements);
          }}
          onDragLeave={handleContainerDragLeave}
          onDrop={(e) => onContainerDrop(e, containerId)}
          onItemDragStart={(itemId, element) => handleDragStart(itemId, containerId, element)}
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
