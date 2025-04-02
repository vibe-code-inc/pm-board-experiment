# Utils Specification

## Overview
The utils.ts file provides essential utility functions used throughout the application. It includes the `cn` function for merging class names, date formatting utilities, and other helper functions that support various components and features.

## Product Requirements
- Provide utility functions that can be reused across the application
- Support consistent styling with proper class name merging
- Ensure proper date formatting throughout the application
- Provide helper functions for common operations
- Follow functional programming principles for better testability

## Technical Requirements
- Export the `cn` function for class name merging
- Provide date formatting and manipulation utilities
- Export helper functions for common operations
- Support all valid class name types as inputs
- Remove duplicate classes when merging
- Prioritize classes from later arguments over earlier ones
- Ensure proper handling of Tailwind utilities
- Support conditional class names
- Optimize for bundle size and performance
- Use proper TypeScript typing for all functions
- Implement pure functions without side effects
- Export each function individually for better tree-shaking
- Document functions with JSDoc comments

## Functions and Types
```typescript
/**
 * Type for valid class name values that can be processed by the cn function
 */
export type ClassValue = string | number | boolean | undefined | null |
  Record<string, boolean | undefined | null> | ClassValue[];

/**
 * Merges multiple class names into a single string, removing duplicates and handling Tailwind utility conflicts.
 * @param inputs Any number of class values (strings, objects, arrays, etc.)
 * @returns A single string with merged class names
 */
export function cn(...inputs: ClassValue[]): string;

/**
 * Formats a date string into a user-friendly format
 * @param dateString ISO date string to format
 * @param format The format to use (short, medium, long)
 * @returns Formatted date string
 */
export function formatDate(
  dateString?: string,
  format: 'short' | 'medium' | 'long' = 'medium'
): string;

/**
 * Checks if a date is in the past
 * @param dateString ISO date string to check
 * @returns Boolean indicating if the date is in the past
 */
export function isPastDate(dateString?: string): boolean;

/**
 * Checks if a date is within a certain number of days from now
 * @param dateString ISO date string to check
 * @param days Number of days threshold
 * @returns Boolean indicating if the date is within the threshold
 */
export function isDateWithinDays(dateString?: string, days: number = 3): boolean;

/**
 * Truncates a string to a maximum length and adds ellipsis if needed
 * @param str String to truncate
 * @param maxLength Maximum length before truncating
 * @returns Truncated string with ellipsis if needed
 */
export function truncateString(str: string, maxLength: number = 50): string;

/**
 * Generates a unique ID for DOM elements
 * @param prefix Optional prefix for the ID
 * @returns Unique ID string
 */
export function generateId(prefix: string = 'id'): string;
```

## Usage Examples
```typescript
// Class name merging
cn('text-red-500', 'bg-blue-200', 'p-4');
// => 'text-red-500 bg-blue-200 p-4'

// Conditional classes
cn('p-4', { 'text-red-500': isError, 'text-green-500': isSuccess });
// => 'p-4 text-red-500' or 'p-4 text-green-500' depending on conditions

// With Tailwind conflicts
cn('text-red-500', 'text-blue-500');
// => 'text-blue-500' (later classes override earlier ones)

// With className prop
cn(baseStyles, variants[variant], sizes[size], className);
// => Combines all classes with proper handling of conflicts

// Date formatting
formatDate('2023-03-15', 'short');
// => 'Mar 15'

formatDate('2023-03-15', 'medium');
// => 'Mar 15, 2023'

formatDate('2023-03-15', 'long');
// => 'March 15, 2023'

// Date checking
isPastDate('2023-01-01');
// => true (assuming today is after this date)

isDateWithinDays('2023-03-18', 3);
// => true/false depending on current date

// String utilities
truncateString('This is a very long string that needs to be truncated', 20);
// => 'This is a very long...'

// ID generation
generateId('button');
// => 'button-a1b2c3d4'
```

## Implementation Details
- Uses `clsx` for basic class merging
- Uses `tailwind-merge` to handle Tailwind utility conflicts
- Handles various input types (strings, objects, arrays)
- Properly manages conflicting Tailwind utilities
- Removes falsy values automatically
- Uses the native Date API for date operations
- Uses functional programming patterns for all utilities
- Implements proper error handling for edge cases

## Related Specifications
- [Library Utilities](./lib.package_specs.md)
- [Task Card Component](../ui/features/task_card/task_card.specs.md)
- [Task Modal Component](../ui/features/task_modal/task_modal.specs.md)
