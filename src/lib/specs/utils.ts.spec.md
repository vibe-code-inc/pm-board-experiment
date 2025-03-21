# Utils Specification

## Overview
The utils.ts file provides essential utility functions used throughout the application. Most notably, it includes the `cn` function for merging class names with proper handling of Tailwind CSS utilities.

## Technical Requirements
- Export the `cn` function for class name merging
- Support all valid class name types as inputs
- Remove duplicate classes when merging
- Prioritize classes from later arguments over earlier ones
- Ensure proper handling of Tailwind utilities
- Support conditional class names
- Optimize for bundle size and performance

## Interfaces
```typescript
/**
 * Merges multiple class names into a single string, removing duplicates and handling Tailwind utility conflicts.
 * @param inputs Any number of class values (strings, objects, arrays, etc.)
 * @returns A single string with merged class names
 */
export function cn(...inputs: ClassValue[]): string;
```

## Usage Examples
```typescript
// Basic usage
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
```

## Implementation Details
- Uses `clsx` for basic class merging
- Uses `tailwind-merge` to handle Tailwind utility conflicts
- Handles various input types (strings, objects, arrays)
- Properly manages conflicting Tailwind utilities
- Removes falsy values automatically

## Related Files
- ../utils.ts - Main utility implementation
- ../features.spec.md - Library utilities specification
