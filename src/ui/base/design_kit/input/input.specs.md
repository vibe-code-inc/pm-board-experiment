# Input Component Specification

## Overview
The Input component provides a standardized, accessible text input field with support for validation and error states. It serves as a foundational element in forms throughout the application.

## Product Requirements
- Display a text input field with consistent styling
- Support optional label text displayed above the input
- Display error messages when validation fails
- Maintain consistent appearance with other form elements
- Support responsive design for different screen sizes
- Ensure accessibility for all users including keyboard and screen reader users
- Provide clear visual feedback for different states (default, focus, error, disabled)

## Technical Requirements
- Implement as a controlled component with React and TypeScript
- Extend the standard HTML input element attributes
- Use Tailwind CSS for styling with project conventions
- Support accessibility features with proper ARIA attributes and labeling
- Ensure proper integration with form validation
- Support all common input types (text, email, password, etc.)
- Implement consistent error state styling
- Use types instead of interfaces as per project conventions
- Implement proper ID generation for label association
- Follow single responsibility principle
- Create a reusable component that maintains focus states
- Support all standard HTML input attributes

## Behavioral Expectations
- Display label when provided with proper HTML association
- Show error message below the input when error prop is provided
- Apply error styling when in error state
- Support all standard HTML input behaviors
- Pass through all unspecified props to the underlying input element
- Maintain proper focus states and keyboard navigation
- Properly handle form submission
- Announce error messages to screen readers
- Allow custom styling through className prop
- Provide proper focus indicators for keyboard users

## Component Structure
```typescript
type InputProps = {
  // Optional label text to display above the input
  label?: string;
  // Optional error message to display below the input
  error?: string;
  // Optional ID for the input (auto-generated if not provided)
  id?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = ({
  className,
  label,
  error,
  id,
  ...props
}) => {
  // Generate a unique ID if not provided for label association
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base py-1.5 md:py-2",
          error ? "border-red-500" : "",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
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
<Input
  name="email"
  type="email"
  label="Email Address"
  placeholder="Enter your email"
/>

// With error state
<Input
  name="password"
  type="password"
  label="Password"
  error="Password must be at least 8 characters"
/>

// With additional HTML attributes
<Input
  name="username"
  label="Username"
  required
  maxLength={20}
  autoComplete="username"
/>

// Disabled state
<Input
  name="readonly-field"
  label="Read Only Field"
  value="Cannot be changed"
  disabled
/>
```

## Related Specifications
- [Base UI Components](../../base.package_specs.md)
- [Button Component](../button/button.specs.md)
- [Select Component](../select/select.specs.md)
- [Textarea Component](../textarea/textarea.specs.md)
