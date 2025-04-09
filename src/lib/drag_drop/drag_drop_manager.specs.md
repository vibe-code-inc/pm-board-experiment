---
description: Drag and Drop Manager Specification
type: utility
---

<specification>
  <meta>
    <title>Drag and Drop Manager Specification</title>
    <description>The DragAndDropManager provides functionality for handling complex drag-and-drop operations across the application, with a primary focus on task management interfaces. It abstracts the logic for calculating drop positions, managing drag states, and coordinating visual feedback during drag operations.</description>
    <created-at utc-timestamp="1712678400">April 9, 2024, 10:00 AM EDT</created-at>
    <applies-to>
      <file-matcher glob="src/lib/drag_drop/drag_drop_manager.ts">Drag and Drop Manager</file-matcher>
    </applies-to>
  </meta>

  <overview>
    <description>The DragAndDropManager provides functionality for handling complex drag-and-drop operations across the application, with a primary focus on task management interfaces. It abstracts the logic for calculating drop positions, managing drag states, and coordinating visual feedback during drag operations.</description>
    <responsibility>Provide a reusable system for advanced drag-and-drop operations with precise positioning and visual feedback</responsibility>
  </overview>

  <requirements>
    <functional-requirements>
      <requirement priority="high">
        <description>Support drag-and-drop operations between different containers (e.g., columns)</description>
      </requirement>
      <requirement priority="high">
        <description>Support reordering items within the same container</description>
      </requirement>
      <requirement priority="high">
        <description>Calculate precise drop positions between items</description>
      </requirement>
      <requirement priority="high">
        <description>Ensure dropped items are placed between the closest items where the cursor/touch is positioned</description>
      </requirement>
      <requirement priority="high">
        <description>Track the currently dragged item</description>
      </requirement>
      <requirement priority="high">
        <description>Track which container is being dragged over</description>
      </requirement>
      <requirement priority="high">
        <description>Determine the exact insertion position within containers</description>
      </requirement>
      <requirement priority="high">
        <description>Provide necessary information for rendering visual feedback</description>
      </requirement>
      <requirement priority="medium">
        <description>Create and manage drag preview that follows cursor and has the same dimensions as the dragged item</description>
      </requirement>
      <requirement priority="medium">
        <description>Remove dragged item from source list during drag operation</description>
      </requirement>
      <requirement priority="medium">
        <description>Ensure proper cleanup of drag preview when item is dropped</description>
      </requirement>
      <requirement priority="high">
        <description>Support touch-based interactions using pointer events</description>
      </requirement>
    </functional-requirements>

    <technical-requirements>
      <requirement priority="high">
        <description>Implement using TypeScript with strong type safety</description>
      </requirement>
      <requirement priority="high">
        <description>Use a functional, hooks-based approach for React integration</description>
      </requirement>
      <requirement priority="high">
        <description>Follow single responsibility principle by focusing only on drag-and-drop logic</description>
      </requirement>
      <requirement priority="high">
        <description>Decouple from specific UI components to ensure reusability</description>
      </requirement>
      <requirement priority="high">
        <description>Provide a clean API for components to consume</description>
      </requirement>
      <requirement priority="medium">
        <description>Optimize calculations for performance</description>
      </requirement>
      <requirement priority="high">
        <description>Support both mouse and touch interactions with pointer events</description>
      </requirement>
      <requirement priority="medium">
        <description>Handle edge cases like empty containers</description>
      </requirement>
      <requirement priority="medium">
        <description>Support accessibility requirements</description>
      </requirement>
      <requirement priority="high">
        <description>Maintain stateless design where possible</description>
      </requirement>
      <requirement priority="high">
        <description>Implement precise position calculation algorithms for determining drop positions</description>
      </requirement>
      <requirement priority="medium">
        <description>Create drag preview elements that match the exact dimensions of the dragged item</description>
      </requirement>
      <requirement priority="medium">
        <description>Handle removal of items from source container while being dragged</description>
      </requirement>
      <requirement priority="medium">
        <description>Manage display and positioning of drag preview to follow cursor/touch point</description>
      </requirement>
      <requirement priority="medium">
        <description>Clean up drag preview elements when drag operation completes</description>
      </requirement>
    </technical-requirements>

    <behavioral-expectations>
      <expectation priority="high">
        <description>Accurately track which item is being dragged</description>
      </expectation>
      <expectation priority="high">
        <description>Determine the closest items to a drag point</description>
      </expectation>
      <expectation priority="high">
        <description>Calculate whether an item should be placed before or after a target item based on the cursor/touch position</description>
      </expectation>
      <expectation priority="high">
        <description>Handle all cases for positioning - not just beginning/end of lists but precise middle positions</description>
      </expectation>
      <expectation priority="high">
        <description>Provide exact positional information to ensure items are placed exactly where they are dropped</description>
      </expectation>
      <expectation priority="high">
        <description>Track which container is currently being hovered</description>
      </expectation>
      <expectation priority="high">
        <description>Handle the transition of items between containers</description>
      </expectation>
      <expectation priority="high">
        <description>Support item reordering within the same container</description>
      </expectation>
      <expectation priority="medium">
        <description>Provide position data for rendering placeholders with the same dimensions as the dragged item</description>
      </expectation>
      <expectation priority="high">
        <description>Work seamlessly on mobile devices with touch support using pointer events</description>
      </expectation>
      <expectation priority="medium">
        <description>Display drag preview element that follows cursor/touch point during drag operations</description>
      </expectation>
      <expectation priority="medium">
        <description>Ensure drag preview looks identical to the original dragged item with exact same dimensions</description>
      </expectation>
      <expectation priority="medium">
        <description>Temporarily remove dragged item from its source container during drag operation</description>
      </expectation>
      <expectation priority="high">
        <description>Add the item back to the target location upon drop (exact position between items)</description>
      </expectation>
      <expectation priority="medium">
        <description>Clean up drag preview when drag operation is completed (drop or cancel)</description>
      </expectation>
    </behavioral-expectations>
  </requirements>

  <interfaces>
    <interface type="hook">
      <definition><![CDATA[type DragItem = {
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
  // Reference to the drag preview element
  dragPreviewElement: HTMLElement | null;

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

  // Pointer event handlers for mobile support
  handlePointerDown: (e: React.PointerEvent<HTMLElement>, itemId: string, containerId: string, element: HTMLElement) => void;
  handlePointerMove: (e: React.PointerEvent<HTMLElement>) => void;
  handlePointerUp: (e: React.PointerEvent<HTMLElement>) => void;

  // Drag preview methods
  createDragPreview: (element: HTMLElement) => HTMLElement;
  updateDragPreviewPosition: (clientX: number, clientY: number) => void;
  removeDragPreview: () => void;

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
}: DragAndDropManagerProps = {}): DragAndDropManager;]]></definition>
    </interface>
  </interfaces>

  <implementation>
    <files>
      <file path="src/lib/drag_drop/drag_drop_manager.ts" action="create">
        <changes>Create the DragAndDropManager hook with all required functionality</changes>
        <example><![CDATA[import { useState, useRef, useCallback } from 'react';

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
  initialDraggedItem?: string | null;
  initialDraggedOverContainer?: string | null;
  initialDropPosition?: DropPlaceholderPosition | null;
};

export function useDragAndDropManager({
  initialDraggedItem = null,
  initialDraggedOverContainer = null,
  initialDropPosition = null,
}: DragAndDropManagerProps = {}) {
  // State for tracking drag operations
  const [draggedItemId, setDraggedItemId] = useState<string | null>(initialDraggedItem);
  const [draggedOverContainerId, setDraggedOverContainerId] = useState<string | null>(initialDraggedOverContainer);
  const [dropPlaceholderPosition, setDropPlaceholderPosition] = useState<DropPlaceholderPosition | null>(initialDropPosition);

  // Refs for DOM elements
  const draggedElementRef = useRef<HTMLElement | null>(null);
  const dragPreviewElementRef = useRef<HTMLElement | null>(null);
  const sourceContainerIdRef = useRef<string | null>(null);

  // Helper method to find the closest item to a Y position
  const findClosestItem = useCallback((
    clientY: number,
    itemElements: Element[],
    excludeItemId?: string
  ) => {
    if (itemElements.length === 0) return null;

    // Map elements to their positions and dimensions
    const itemPositions = itemElements.map(element => {
      const rect = element.getBoundingClientRect();
      const id = element.getAttribute('data-item-id');
      if (!id) return null;

      // Skip the dragged item
      if (excludeItemId && id === excludeItemId) return null;

      return {
        id,
        top: rect.top,
        bottom: rect.bottom,
        middle: rect.top + rect.height / 2,
        height: rect.height
      };
    }).filter(Boolean);

    if (itemPositions.length === 0) return null;

    // Find the closest item
    let closestItem = null;
    let closestDistance = Infinity;
    let position: 'before' | 'after' = 'after';

    for (const item of itemPositions) {
      // Distance to the middle point
      const distanceToMiddle = Math.abs(clientY - item.middle);

      if (distanceToMiddle < closestDistance) {
        closestDistance = distanceToMiddle;
        closestItem = item;
        position = clientY < item.middle ? 'before' : 'after';
      }
    }

    if (!closestItem) return null;

    return {
      itemId: closestItem.id,
      position
    };
  }, []);

  // Create drag preview element
  const createDragPreview = useCallback((element: HTMLElement) => {
    // Clone the element for the preview
    const preview = element.cloneNode(true) as HTMLElement;
    const rect = element.getBoundingClientRect();

    // Style the preview
    preview.style.position = 'fixed';
    preview.style.width = `${rect.width}px`;
    preview.style.height = `${rect.height}px`;
    preview.style.left = '0';
    preview.style.top = '0';
    preview.style.opacity = '0.7';
    preview.style.pointerEvents = 'none';
    preview.style.zIndex = '9999';
    preview.style.transform = 'translate(-9999px, -9999px)'; // Hide initially

    // Add to the document
    document.body.appendChild(preview);
    return preview;
  }, []);

  // Update drag preview position
  const updateDragPreviewPosition = useCallback((clientX: number, clientY: number) => {
    if (!dragPreviewElementRef.current) return;

    const preview = dragPreviewElementRef.current;
    const rect = preview.getBoundingClientRect();

    // Center the preview on the cursor
    const offsetX = rect.width / 2;
    const offsetY = rect.height / 2;

    preview.style.transform = `translate(${clientX - offsetX}px, ${clientY - offsetY}px)`;
  }, []);

  // Remove drag preview
  const removeDragPreview = useCallback(() => {
    if (dragPreviewElementRef.current) {
      document.body.removeChild(dragPreviewElementRef.current);
      dragPreviewElementRef.current = null;
    }
  }, []);

  // Reset all drag state
  const resetDragState = useCallback(() => {
    setDraggedItemId(null);
    setDraggedOverContainerId(null);
    setDropPlaceholderPosition(null);
    draggedElementRef.current = null;
    sourceContainerIdRef.current = null;
    removeDragPreview();
  }, [removeDragPreview]);

  // Event handlers
  const handleDragStart = useCallback((itemId: string, containerId: string, element: HTMLElement) => {
    setDraggedItemId(itemId);
    sourceContainerIdRef.current = containerId;
    draggedElementRef.current = element;

    // Create drag preview
    const preview = createDragPreview(element);
    dragPreviewElementRef.current = preview;
  }, [createDragPreview]);

  const handleContainerDragOver = useCallback((
    e: React.DragEvent<HTMLElement>,
    containerId: string,
    itemElements: Element[]
  ) => {
    e.preventDefault();

    setDraggedOverContainerId(containerId);

    // Update preview position
    updateDragPreviewPosition(e.clientX, e.clientY);

    // Find closest item for drop positioning
    const closestItem = findClosestItem(
      e.clientY,
      itemElements,
      draggedItemId
    );

    if (closestItem) {
      setDropPlaceholderPosition({
        containerId,
        targetId: closestItem.itemId,
        position: closestItem.position
      });
    } else {
      // Empty container or only contains the dragged item
      setDropPlaceholderPosition({
        containerId,
        targetId: null,
        position: 'after' // Default to appending
      });
    }
  }, [draggedItemId, findClosestItem, updateDragPreviewPosition]);

  const handleContainerDragLeave = useCallback(() => {
    setDraggedOverContainerId(null);
  }, []);

  const handleContainerDrop = useCallback((
    e: React.DragEvent<HTMLElement>,
    containerId: string
  ) => {
    e.preventDefault();

    if (!draggedItemId || !sourceContainerIdRef.current) {
      resetDragState();
      return null;
    }

    const result = {
      itemId: draggedItemId,
      sourceContainerId: sourceContainerIdRef.current,
      targetId: dropPlaceholderPosition?.targetId || null,
      position: dropPlaceholderPosition?.position || null
    };

    resetDragState();
    return result;
  }, [draggedItemId, dropPlaceholderPosition, resetDragState]);

  const handleDragEnd = useCallback(() => {
    resetDragState();
  }, [resetDragState]);

  // Pointer event handlers for touch support
  const handlePointerDown = useCallback((
    e: React.PointerEvent<HTMLElement>,
    itemId: string,
    containerId: string,
    element: HTMLElement
  ) => {
    // Only handle touch events here, mouse uses standard drag events
    if (e.pointerType !== 'touch') return;

    e.stopPropagation();

    handleDragStart(itemId, containerId, element);
    updateDragPreviewPosition(e.clientX, e.clientY);

    // Capture pointer to track movements outside the element
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [handleDragStart, updateDragPreviewPosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'touch' || !draggedItemId) return;

    e.stopPropagation();
    updateDragPreviewPosition(e.clientX, e.clientY);

    // Would need additional logic here to detect what container is being dragged over
    // and what items are nearby - this would generally be handled by the component
    // using the hook with custom logic
  }, [draggedItemId, updateDragPreviewPosition]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'touch' || !draggedItemId) return;

    e.stopPropagation();

    // Release capture
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    // Custom drop handling would be implemented by the component using the hook
    // For now, just reset the state
    resetDragState();
  }, [draggedItemId, resetDragState]);

  return {
    // Current state
    draggedItemId,
    draggedOverContainerId,
    dropPlaceholderPosition,
    draggedElement: draggedElementRef.current,
    dragPreviewElement: dragPreviewElementRef.current,

    // Event handlers
    handleDragStart,
    handleDragEnd,
    handleContainerDragOver,
    handleContainerDragLeave,
    handleContainerDrop,

    // Pointer events for touch
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,

    // Drag preview methods
    createDragPreview,
    updateDragPreviewPosition,
    removeDragPreview,

    // Helper methods
    findClosestItem,
    resetDragState
  };
}]]></example>
      </file>
    </files>

    <dependencies>
      <dependency type="external">react for hooks and event handling</dependency>
    </dependencies>
  </implementation>

  <references>
    <reference href="../lib.package_specs.md">Library Utilities</reference>
    <reference href="../../features/project_board/project_board.specs.md">Project Board Component</reference>
    <reference href="../../features/task_management/task_list.specs.md">Task List Component</reference>
  </references>
</specification>
