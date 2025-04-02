# Select Component Specification

## Overview
The Select component provides a standardized, accessible dropdown selection field with support for validation and error states. It serves as a foundational form element for dropdown selection throughout the application.

## Product Requirements
- Display a dropdown selection field with consistent styling
- Support optional label text displayed above the select
- Display error messages when validation fails
- Maintain consistent appearance with other form elements
- Support responsive design for different screen sizes
- Allow for selection from predefined options
- Ensure accessibility for all users including keyboard and screen reader users
- Provide clear visual feedback for different states (default, focus, error, disabled)

## Technical Requirements
- Implement as a controlled component with React and TypeScript
- Extend the standard HTML select element attributes
- Use Tailwind CSS for styling with project conventions
- Support accessibility features with proper ARIA attributes and labeling
- Ensure proper integration with form validation
- Support nesting of option elements as children
- Implement consistent error state styling
- Use types instead of interfaces as per project conventions
- Implement proper ID generation for label association
- Follow single responsibility principle
- Create a reusable component that maintains focus states
- Support all standard HTML select attributes

## Behavioral Expectations
- Display label when provided with proper HTML association
- Show error message below the select when error prop is provided
- Apply error styling when in error state
- Support all standard HTML select behaviors
- Pass through all unspecified props to the underlying select element
- Maintain proper focus states and keyboard navigation
- Allow for selection of options through keyboard and mouse interaction
- Properly handle form submission
- Announce error messages to screen readers
- Allow custom styling through className prop
- Provide proper focus indicators for keyboard users

## Component Structure
```typescript
type SelectProps = {
  // Optional label text to display above the select
  label?: string;
  // Optional error message to display below the select
  error?: string;
  // Optional ID for the select (auto-generated if not provided)
  id?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select: React.FC<SelectProps> = ({
  className,
  children,
  label,
  error,
  id,
  ...props
}) => {
  // Generate a unique ID if not provided for label association
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base py-1.5 md:py-2",
          error ? "border-red-500" : "",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p
          id={`${selectId}-error`}
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
<Select
  name="country"
  label="Country"
>
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
  <option value="uk">United Kingdom</option>
</Select>

// With error state
<Select
  name="priority"
  label="Priority"
  error="Please select a priority"
>
  <option value="">Select priority</option>
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="high">High</option>
</Select>

// With additional HTML attributes
<Select
  name="category"
  label="Category"
  required
  defaultValue="feature"
>
  <option value="feature">Feature</option>
  <option value="bug">Bug</option>
  <option value="task">Task</option>
</Select>

// Disabled state
<Select
  name="read-only-field"
  label="Read Only Selection"
  disabled
  value="fixed-option"
>
  <option value="fixed-option">Cannot be changed</option>
</Select>
```

## Related Specifications
- [Base UI Components](../../base.package_specs.md)
- [Button Component](../button/button.specs.md)
- [Input Component](../input/input.specs.md)
- [Textarea Component](../textarea/textarea.specs.md)
