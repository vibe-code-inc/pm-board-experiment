import React from 'react';

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
};

export const DropPlaceholder: React.FC<DropPlaceholderProps> = ({
  width = 'auto',
  height = '4rem',
  className = '',
  label = 'Drop here',
  isActive = true,
  animate = true,
  draggedElement = null
}) => {
  // Get dimensions from dragged element if provided
  const finalWidth = draggedElement ? `${draggedElement.offsetWidth}px` : width;
  const finalHeight = draggedElement ? `${draggedElement.offsetHeight}px` : height;

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
      style={{ width: finalWidth, height: finalHeight }}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};
