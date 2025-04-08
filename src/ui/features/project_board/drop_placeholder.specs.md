---
description: Drop Placeholder Component Specification
type: component
---

<specification>
  <meta>
    <title>Drop Placeholder Component</title>
    <description>Provides a visual indicator for where a dragged item will be placed when dropped during drag-and-drop operations</description>
    <created-at utc-timestamp="1712678400">April 9, 2024, 10:00 AM EDT</created-at>
    <applies-to>
      <file-matcher glob="src/ui/features/project_board/drop_placeholder.tsx">Drop Placeholder Component</file-matcher>
    </applies-to>
  </meta>

  <overview>
    <description>The DropPlaceholder component provides a visual indicator for where a dragged item will be placed when dropped. It renders a placeholder element with appropriate styling to show the insertion point during drag-and-drop operations.</description>
    <responsibility>Provide visual feedback about drop targets during drag-and-drop operations</responsibility>
  </overview>

  <requirements>
    <functional-requirements>
      <requirement priority="high">
        <description>Provide clear visual feedback about where a dragged item will be placed</description>
      </requirement>
      <requirement priority="medium">
        <description>Maintain consistent appearance with the overall design system</description>
      </requirement>
      <requirement priority="high">
        <description>Support appropriate sizing to match exactly the dimensions of the dragged card</description>
      </requirement>
      <requirement priority="medium">
        <description>Ensure sufficient visual contrast to be easily noticed during drag operations</description>
      </requirement>
      <requirement priority="medium">
        <description>Support accessibility by providing screen reader context</description>
      </requirement>
      <requirement priority="high">
        <description>Display with exactly the same width and height as the dragged item</description>
      </requirement>
      <requirement priority="high">
        <description>Show the placeholder between cards, moving them apart to create enough space</description>
      </requirement>
      <requirement priority="high">
        <description>Match the exact dimensions of the dragged card including all padding and margins</description>
      </requirement>
      <requirement priority="high">
        <description>Provide visual indication of the exact insertion point between existing cards</description>
      </requirement>
    </functional-requirements>

    <technical-requirements>
      <requirement priority="high">
        <description>Implement using React and TypeScript</description>
      </requirement>
      <requirement priority="high">
        <description>Use Tailwind CSS for styling consistent with the application</description>
      </requirement>
      <requirement priority="high">
        <description>Support customization through props to match dragged item dimensions</description>
      </requirement>
      <requirement priority="high">
        <description>Support obtaining dimensions from the dragged element</description>
      </requirement>
      <requirement priority="medium">
        <description>Optimize rendering performance</description>
      </requirement>
      <requirement priority="high">
        <description>Follow single responsibility principle by focusing only on placeholder visualization</description>
      </requirement>
      <requirement priority="medium">
        <description>Support accessibility with appropriate ARIA attributes and screen reader text</description>
      </requirement>
      <requirement priority="medium">
        <description>Keep the component lightweight and focused</description>
      </requirement>
      <requirement priority="high">
        <description>Calculate and apply exact dimensions of the dragged element including margins</description>
      </requirement>
      <requirement priority="high">
        <description>Support dynamic positioning between existing cards</description>
      </requirement>
      <requirement priority="high">
        <description>Use identical spacing to ensure consistent layout when item is dropped</description>
      </requirement>
      <requirement priority="medium">
        <description>Ensure proper display in both horizontal and vertical layouts</description>
      </requirement>
    </technical-requirements>

    <behavioral-expectations>
      <expectation priority="high">
        <description>Display a visual placeholder with dimensions matching the dragged card</description>
      </expectation>
      <expectation priority="medium">
        <description>Adapt to different container widths and contexts</description>
      </expectation>
      <expectation priority="medium">
        <description>Maintain consistent appearance across the application</description>
      </expectation>
      <expectation priority="medium">
        <description>Support animation properties for enhanced visual feedback</description>
      </expectation>
      <expectation priority="medium">
        <description>Provide screen reader text describing the purpose of the element</description>
      </expectation>
      <expectation priority="high">
        <description>Match width of the dragged element</description>
      </expectation>
      <expectation priority="high">
        <description>Match height of the dragged element</description>
      </expectation>
      <expectation priority="high">
        <description>Appear exactly at the position where the card would be inserted</description>
      </expectation>
      <expectation priority="high">
        <description>Move existing cards apart to create space for placeholder</description>
      </expectation>
      <expectation priority="high">
        <description>Maintain exact spacing that would occur when item is actually dropped</description>
      </expectation>
      <expectation priority="high">
        <description>Be positioned precisely between the closest items to the drag position</description>
      </expectation>
      <expectation priority="high">
        <description>Update position dynamically as dragged item moves over different drop targets</description>
      </expectation>
      <expectation priority="high">
        <description>Maintain exact visual representation of what will happen on drop</description>
      </expectation>
      <expectation priority="high">
        <description>Have identical dimensions to the dragged card including all spacing</description>
      </expectation>
    </behavioral-expectations>
  </requirements>

  <interfaces>
    <interface type="props">
      <definition><![CDATA[type DropPlaceholderProps = {
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
};]]></definition>
    </interface>
  </interfaces>

  <implementation>
    <files>
      <file path="src/ui/features/project_board/drop_placeholder.tsx" action="create">
        <changes>Create DropPlaceholder component implementation following the specification</changes>
        <example><![CDATA[export const DropPlaceholder: React.FC<DropPlaceholderProps> = ({
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
};]]></example>
      </file>
    </files>

    <dependencies>
      <dependency type="external">react for UI components</dependency>
      <dependency type="internal">cn utility from @/lib/utils</dependency>
    </dependencies>
  </implementation>

  <references>
    <reference href="../../../features/project_board/project_board.specs.md">Project Board Component</reference>
    <reference href="../../../features/project_board/task_column.specs.md">Task Column Component</reference>
    <reference href="../../features/task_card/task_card.specs.md">Task Card Component</reference>
    <reference href="../../../lib/drag_drop/drag_drop_manager.specs.md">Drag and Drop Manager</reference>
  </references>
</specification>
