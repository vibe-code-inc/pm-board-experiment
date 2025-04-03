import { useState } from 'react';

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

interface ClosestItemType {
  itemId: string;
  distance: number;
  position: 'before' | 'after';
}

interface ClosestItemResult {
  itemId: string;
  position: 'before' | 'after';
}

/**
 * Custom hook to manage drag and drop operations
 */
export function useDragAndDropManager({
  initialDraggedItem = null,
  initialDraggedOverContainer = null,
  initialDropPosition = null,
}: DragAndDropManagerProps = {}): DragAndDropManager {
  // State for tracking drag operations
  const [draggedItemId, setDraggedItemId] = useState<string | null>(initialDraggedItem);
  const [sourceContainerId, setSourceContainerId] = useState<string | null>(null);
  const [draggedOverContainerId, setDraggedOverContainerId] = useState<string | null>(
    initialDraggedOverContainer
  );
  const [dropPlaceholderPosition, setDropPlaceholderPosition] = useState<DropPlaceholderPosition | null>(
    initialDropPosition
  );

  /**
   * Start dragging an item
   */
  const handleDragStart = (itemId: string, containerId: string) => {
    setDraggedItemId(itemId);
    setSourceContainerId(containerId);
  };

  /**
   * End a drag operation and reset state
   */
  const handleDragEnd = () => {
    resetDragState();
  };

  /**
   * Reset all drag state
   */
  const resetDragState = () => {
    setDraggedItemId(null);
    setSourceContainerId(null);
    setDraggedOverContainerId(null);
    setDropPlaceholderPosition(null);
  };

  /**
   * Find the closest item to the cursor position
   */
  const findClosestItem = (
    clientY: number,
    itemElements: Element[],
    excludeItemId?: string
  ): ClosestItemResult | null => {
    if (itemElements.length === 0) return null;

    let closestItem: ClosestItemType | null = null;

    itemElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const taskId = element.getAttribute('data-task-id');

      if (!taskId || (excludeItemId && taskId === excludeItemId)) return;

      // Check distance to top edge (for 'before' position)
      const distanceToTop = Math.abs(clientY - rect.top);
      // Check distance to bottom edge (for 'after' position)
      const distanceToBottom = Math.abs(clientY - rect.bottom);

      if (closestItem === null || distanceToTop < closestItem.distance) {
        closestItem = { itemId: taskId, distance: distanceToTop, position: 'before' };
      }

      if (closestItem !== null && distanceToBottom < closestItem.distance) {
        closestItem = { itemId: taskId, distance: distanceToBottom, position: 'after' };
      }
    });

    if (!closestItem) return null;

    // Return a clean result without the distance property
    return {
      itemId: closestItem.itemId,
      position: closestItem.position
    };
  };

  /**
   * Handle dragging over a container
   */
  const handleContainerDragOver = (
    e: React.DragEvent<HTMLElement>,
    containerId: string,
    itemElements: Element[]
  ) => {
    e.preventDefault();
    setDraggedOverContainerId(containerId);
    e.dataTransfer.dropEffect = 'move';

    // Calculate drop position for the placeholder
    if (itemElements.length === 0) {
      // Empty container - place at top
      setDropPlaceholderPosition({
        containerId,
        targetId: null,
        position: 'before'
      });
      return;
    }

    // Find closest item
    const closestItem = findClosestItem(e.clientY, itemElements, draggedItemId ?? undefined);
    if (closestItem) {
      setDropPlaceholderPosition({
        containerId,
        targetId: closestItem.itemId,
        position: closestItem.position
      });
    }
  };

  /**
   * Handle leaving a container during drag
   */
  const handleContainerDragLeave = () => {
    setDraggedOverContainerId(null);
  };

  /**
   * Handle dropping an item into a container
   */
  const handleContainerDrop = (
    e: React.DragEvent<HTMLElement>,
    containerId: string
  ) => {
    e.preventDefault();

    if (!dropPlaceholderPosition) return null;

    // Get the dragged item ID from the data transfer
    const dataTransferItemId = e.dataTransfer.getData('taskId');
    const itemId = dataTransferItemId || draggedItemId;

    if (!itemId || !sourceContainerId) {
      resetDragState();
      return null;
    }

    // Prepare the return value
    const result = {
      itemId,
      sourceContainerId,
      targetId: dropPlaceholderPosition.targetId,
      position: dropPlaceholderPosition.position
    };

    // Reset drag state
    resetDragState();

    return result;
  };

  return {
    draggedItemId,
    draggedOverContainerId,
    dropPlaceholderPosition,
    handleDragStart,
    handleDragEnd,
    handleContainerDragOver,
    handleContainerDragLeave,
    handleContainerDrop,
    findClosestItem,
    resetDragState
  };
}
