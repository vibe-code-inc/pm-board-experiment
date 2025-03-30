# Button Component Specification

## Overview
The Button component provides a standardized button element with various visual styles and sizes. It serves as a fundamental interactive element used throughout the application for triggering actions.

## Technical Requirements
- Implement with React and TypeScript
- Support all standard HTML button attributes
- Use Tailwind CSS for styling
- Support different visual variants
- Support different sizes
- Support disabled state
- Support loading state with spinner
- Support icons (leading and trailing)
- Ensure accessibility compliance
- Support keyboard navigation
- Use the `cn` utility for class merging

## Variants
- **Primary**: Used for the main call-to-action on a page
- **Secondary**: Used for secondary actions
- **Ghost**: A subtle button with no background or border
- **Destructive**: Used for destructive actions (deletion, etc.)
- **Link**: Styled to look like a link but behaves like a button

## Sizes
- **Small**: Compact size for tight spaces
- **Medium**: Default size for most contexts
- **Large**: Larger size for emphasis

## Props Interface
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}
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
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
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
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
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
