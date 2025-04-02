# Textarea Component Specification

## Overview
The Textarea component provides a standardized, accessible multi-line text input field with support for validation and error states. It serves as a foundational element in forms throughout the application for collecting larger text inputs.

## Product Requirements
- Display a multi-line text input field with consistent styling
- Support optional label text displayed above the textarea
- Display error messages when validation fails
- Maintain consistent appearance with other form elements
- Support responsive design for different screen sizes
- Allow for flexible height adjustment based on content
- Ensure accessibility for all users including keyboard and screen reader users
- Provide clear visual feedback for different states (default, focus, error, disabled)

## Technical Requirements
- Implement as a controlled component with React and TypeScript
- Extend the standard HTML textarea element attributes
- Use Tailwind CSS for styling with project conventions
- Support accessibility features with proper ARIA attributes and labeling
- Ensure proper integration with form validation
- Implement consistent error state styling
- Support for resizing behavior (vertical, horizontal, both, or none)
- Use types instead of interfaces as per project conventions
- Implement proper ID generation for label association
- Follow single responsibility principle
- Create a reusable component that maintains focus states
- Support all standard HTML textarea attributes

## Behavioral Expectations
- Display label when provided with proper HTML association
- Show error message below the textarea when error prop is provided
- Apply error styling when in error state
- Support all standard HTML textarea behaviors
- Pass through all unspecified props to the underlying textarea element
- Maintain proper focus states and keyboard navigation
- Allow for multi-line text input with appropriate wrapping
- Properly handle form submission
- Announce error messages to screen readers
- Allow custom styling through className prop
- Provide proper focus indicators for keyboard users

## Component Structure
```typescript
type TextareaProps = {
  // Optional label text to display above the textarea
  label?: string;
  // Optional error message to display below the textarea
  error?: string;
  // Optional ID for the textarea (auto-generated if not provided)
  id?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea: React.FC<TextareaProps> = ({
  className,
  label,
  error,
  id,
  ...props
}) => {
  // Generate a unique ID if not provided for label association
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base py-1.5 md:py-2",
          error ? "border-red-500" : "",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${textareaId}-error`}
          className="mt-1 text-xs md:text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};
```

## Examples
```tsx
// Basic usage
<Textarea
  name="description"
  label="Description"
  placeholder="Enter a detailed description"
  rows={4}
/>

// With error state
<Textarea
  name="comments"
  label="Comments"
  error="Comments must be at least 10 characters"
  rows={3}
/>

// With additional HTML attributes
<Textarea
  name="feedback"
  label="Feedback"
  required
  maxLength={500}
  rows={5}
  placeholder="Share your thoughts..."
/>

// Disabled state
<Textarea
  name="read-only-field"
  label="Read Only Text"
  disabled
  value="This content cannot be edited"
  rows={2}
/>
```

## Related Specifications
- [Base UI Components](../../base.package_specs.md)
- [Button Component](../button/button.specs.md)
- [Input Component](../input/input.specs.md)
- [Select Component](../select/select.specs.md)
