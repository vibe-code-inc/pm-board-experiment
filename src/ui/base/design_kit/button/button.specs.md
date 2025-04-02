# Button Component Specification

## Overview
The Button component provides a standardized button element with various visual styles and sizes. It serves as a fundamental interactive element used throughout the application for triggering actions.

## Product Requirements
- Provide a consistent button appearance across the application
- Support various visual styles to indicate different types of actions
- Support different sizes for various contexts and layouts
- Provide visual feedback for interactive states (hover, focus, active)
- Indicate loading states during asynchronous operations
- Support icon placement for enhanced visual communication
- Ensure buttons are accessible to all users including keyboard and screen reader users

## Technical Requirements
- Implement with React and TypeScript
- Support all standard HTML button attributes
- Use Tailwind CSS for styling with the project's class naming conventions
- Support different visual variants (primary, secondary, ghost, destructive, link)
- Support different sizes (small, medium, large)
- Support disabled state with visual indication
- Support loading state with spinner animation
- Support icons in leading and trailing positions
- Ensure accessibility compliance (ARIA attributes, focus states)
- Support keyboard navigation and interactions
- Use the `cn` utility from lib/utils for conditional class merging
- Follow single responsibility principle by focusing solely on button presentation
- Implement proper TypeScript types (not interfaces) as per project conventions

## Behavioral Expectations
- Buttons should provide visual feedback on hover, focus, and active states
- Disabled buttons should prevent interactions and appear visually distinct
- Loading buttons should show a spinner and prevent multiple clicks
- Buttons should handle touch and mouse interactions appropriately
- Focus states should be clearly visible for keyboard navigation
- Buttons should respond to Enter and Space key presses
- Buttons with icons should maintain proper alignment and spacing
- All variants should maintain consistent height within their size category
- The component should accept and properly handle all standard HTML button attributes

## Props Interface
```typescript
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
```

## Implementation Details
```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  // Base styles shared by all variants
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  // Variant-specific styles
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
    ghost: 'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    link: 'text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-500',
  };

  // Size-specific styles
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2" aria-hidden="true">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2" aria-hidden="true">{rightIcon}</span>}
    </button>
  );
};
```

## Usage Examples
```tsx
// Primary button (default)
<Button>Submit</Button>

// Secondary button with icon
<Button variant="secondary" leftIcon={<SaveIcon />}>
  Save
</Button>

// Destructive button
<Button variant="destructive">Delete</Button>

// Small ghost button
<Button variant="ghost" size="sm">
  Cancel
</Button>

// Loading state
<Button isLoading>Processing</Button>

// Disabled state
<Button disabled>Cannot Submit</Button>
```

## Related Specifications
- [Base UI Components](../../base.package_specs.md)
