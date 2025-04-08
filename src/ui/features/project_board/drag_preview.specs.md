---
description: Drag Preview Component Specification
type: component
---

<specification>
  <meta>
    <title>Drag Preview Component</title>
    <description>Creates a visual representation of an element being dragged during drag-and-drop operations</description>
    <created-at utc-timestamp="1712678400">April 9, 2024, 10:00 AM EDT</created-at>
    <applies-to>
      <file-matcher glob="src/ui/features/project_board/drag_preview.tsx">Drag Preview Component</file-matcher>
    </applies-to>
  </meta>

  <overview>
    <description>The DragPreview component creates a visual representation of an element being dragged during drag-and-drop operations. It clones the appearance of the dragged element and follows the cursor/touch point, providing clear visual feedback about what is being moved and maintaining the exact dimensions of the original element.</description>
    <responsibility>Provide visual feedback during drag operations by creating and positioning a preview element that follows the cursor</responsibility>
  </overview>

  <requirements>
    <functional-requirements>
      <requirement priority="high">
        <description>Create an exact visual duplicate of the dragged element</description>
      </requirement>
      <requirement priority="high">
        <description>Follow cursor or touch point during drag operations</description>
      </requirement>
      <requirement priority="high">
        <description>Maintain same dimensions as the original dragged element</description>
      </requirement>
      <requirement priority="high">
        <description>Provide visual indication that the element is being dragged (semi-transparency)</description>
      </requirement>
      <requirement priority="medium">
        <description>Support both mouse and touch-based drag operations</description>
      </requirement>
      <requirement priority="high">
        <description>Ensure drag preview is visible above all other elements</description>
      </requirement>
      <requirement priority="medium">
        <description>Support pointer events for cross-device compatibility</description>
      </requirement>
      <requirement priority="high">
        <description>Automatically clean up when drag operation ends</description>
      </requirement>
      <requirement priority="medium">
        <description>Ensure smooth movement that precisely follows cursor/touch</description>
      </requirement>
      <requirement priority="high">
        <description>Match exact styling of the original element but with slight transparency</description>
      </requirement>
    </functional-requirements>

    <technical-requirements>
      <requirement priority="high">
        <description>Implement using React and TypeScript</description>
      </requirement>
      <requirement priority="high">
        <description>Use DOM APIs to create and position the drag preview</description>
      </requirement>
      <requirement priority="high">
        <description>Calculate exact dimensions including margins, padding, and borders</description>
      </requirement>
      <requirement priority="high">
        <description>Clone styling from original element</description>
      </requirement>
      <requirement priority="high">
        <description>Position element to follow cursor with appropriate offset</description>
      </requirement>
      <requirement priority="medium">
        <description>Handle z-index to ensure visibility above other elements</description>
      </requirement>
      <requirement priority="medium">
        <description>Support smooth animation during movement</description>
      </requirement>
      <requirement priority="high">
        <description>Clean up DOM elements when dragging ends</description>
      </requirement>
      <requirement priority="high">
        <description>Follow single responsibility principle</description>
      </requirement>
      <requirement priority="medium">
        <description>Support proper accessibility attributes</description>
      </requirement>
      <requirement priority="medium">
        <description>Optimize performance for smooth movement</description>
      </requirement>
      <requirement priority="medium">
        <description>Support all device types through pointer events</description>
      </requirement>
      <requirement priority="high">
        <description>Implement proper clean-up on unmount and drag end</description>
      </requirement>
      <requirement priority="high">
        <description>Calculate precise position based on initial grab coordinates</description>
      </requirement>
    </technical-requirements>

    <behavioral-expectations>
      <expectation priority="high">
        <description>Preview should be created when drag begins</description>
      </expectation>
      <expectation priority="high">
        <description>Preview should follow cursor/touch point with precise positioning</description>
      </expectation>
      <expectation priority="high">
        <description>Preview should maintain exact dimensions of original element</description>
      </expectation>
      <expectation priority="high">
        <description>Preview should be semi-transparent to indicate dragging state</description>
      </expectation>
      <expectation priority="high">
        <description>Preview should appear above all other elements</description>
      </expectation>
      <expectation priority="high">
        <description>Preview should be removed when drag ends or is canceled</description>
      </expectation>
      <expectation priority="medium">
        <description>Preview should move smoothly without lag</description>
      </expectation>
      <expectation priority="high">
        <description>Preview should accurately represent the dragged element's appearance</description>
      </expectation>
      <expectation priority="medium">
        <description>Preview should handle different card sizes and styles</description>
      </expectation>
      <expectation priority="high">
        <description>Preview should match original element but with visual indication it's being dragged</description>
      </expectation>
      <expectation priority="high">
        <description>Preview should have same width, height, and appearance as original</description>
      </expectation>
      <expectation priority="high">
        <description>Preview should be appended to document body to avoid positioning constraints</description>
      </expectation>
      <expectation priority="high">
        <description>Preview should be removed from DOM when no longer needed</description>
      </expectation>
    </behavioral-expectations>
  </requirements>

  <interfaces>
    <interface type="props">
      <definition><![CDATA[type DragPreviewProps = {
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
};]]></definition>
    </interface>
  </interfaces>

  <implementation>
    <files>
      <file path="src/ui/features/project_board/drag_preview.tsx" action="create">
        <changes>Create DragPreview component implementation following the specification</changes>
        <example><![CDATA[export const DragPreview: React.FC<DragPreviewProps> = ({
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
};]]></example>
      </file>
    </files>

    <dependencies>
      <dependency type="external">react for UI components</dependency>
      <dependency type="external">react hooks (useRef, useEffect) for DOM manipulation</dependency>
    </dependencies>
  </implementation>

  <references>
    <reference href="../../../features/project_board/project_board.specs.md">Project Board Component</reference>
    <reference href="../../../features/project_board/task_column.specs.md">Task Column Component</reference>
    <reference href="../../features/task_card/task_card.specs.md">Task Card Component</reference>
    <reference href="../../../lib/drag_drop/drag_drop_manager.specs.md">Drag and Drop Manager</reference>
    <reference href="../drop_placeholder.specs.md">Drop Placeholder Component</reference>
  </references>
</specification>
