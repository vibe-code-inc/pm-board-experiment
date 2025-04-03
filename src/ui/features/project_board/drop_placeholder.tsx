import React from 'react';

export interface DropPlaceholderProps {
  /**
   * Whether the placeholder is active/visible
   */
  isActive?: boolean;

  /**
   * Height of the placeholder in pixels, defaults to 40
   */
  height?: number;

  /**
   * Additional CSS classes to apply to the placeholder
   */
  className?: string;

  /**
   * Accessible label for screen readers
   */
  label?: string;

  /**
   * Whether to animate the placeholder appearance
   */
  animate?: boolean;
}

/**
 * Visual placeholder to show where a dragged item will be placed
 */
export function DropPlaceholder({
  isActive = false,
  height = 40,
  className = '',
  label = 'Drop here to place item',
  animate = true
}: DropPlaceholderProps) {
  // Early return if not active
  if (!isActive) return null;

  // Base classes for styling
  const baseClasses = 'w-full border-2 border-dashed rounded-md flex items-center justify-center';

  // Combine animation classes if enabled
  const animationClasses = animate ? 'transition-all duration-200 ease-in-out' : '';

  // Combine all classes including any custom ones
  const classes = `${baseClasses} ${animationClasses} border-blue-400 bg-blue-50 ${className}`;

  return (
    <div
      className={classes}
      style={{ height: `${height}px` }}
      role="region"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}
