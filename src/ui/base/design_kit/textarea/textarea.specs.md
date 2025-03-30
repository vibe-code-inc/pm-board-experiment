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

## Technical Requirements
- Implement as a controlled component with React and TypeScript
- Extend the standard HTML textarea element attributes
- Use Tailwind CSS for styling
- Support accessibility features with proper ARIA attributes
- Ensure proper integration with form validation
- Implement consistent error state styling
- Support for resizing behavior (vertical, horizontal, both, or none)

## Behavioral Expectations
- Display label when provided
- Show error message below the textarea when error prop is provided
- Apply error styling when in error state
- Support all standard HTML textarea behaviors
- Pass through all unspecified props to the underlying textarea element
- Maintain proper focus states and keyboard navigation
- Allow for multi-line text input with appropriate wrapping

## Interfaces
```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Optional label text to display above the textarea
  label?: string;
  // Optional error message to display below the textarea
  error?: string;
}
```

## Component Implementation
```typescript
export const Textarea: React.FC<TextareaProps> = ({
  className,
  label,
  error,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base py-1.5 md:py-2",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs md:text-sm text-red-600">{error}</p>
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
```

## Related Specifications
- [Base UI Components](../../base.package_specs.md)
- [Button Component](../button/button.specs.md)
- [Input Component](../input/input.specs.md)
- [Select Component](../select/select.specs.md)
