# Input Component Specification

## Overview
The Input component provides a standardized, accessible text input field with support for validation and error states. It serves as a foundational element in forms throughout the application.

## Product Requirements
- Display a text input field with consistent styling
- Support optional label text displayed above the input
- Display error messages when validation fails
- Maintain consistent appearance with other form elements
- Support responsive design for different screen sizes

## Technical Requirements
- Implement as a controlled component with React and TypeScript
- Extend the standard HTML input element attributes
- Use Tailwind CSS for styling
- Support accessibility features with proper ARIA attributes
- Ensure proper integration with form validation
- Support all common input types (text, email, password, etc.)
- Implement consistent error state styling

## Behavioral Expectations
- Display label when provided
- Show error message below the input when error prop is provided
- Apply error styling when in error state
- Support all standard HTML input behaviors
- Pass through all unspecified props to the underlying input element
- Maintain proper focus states and keyboard navigation

## Interfaces
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Optional label text to display above the input
  label?: string;
  // Optional error message to display below the input
  error?: string;
}
```

## Component Implementation
```typescript
export const Input: React.FC<InputProps> = ({
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
      <input
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
```

## Related Specifications
- [Base UI Components](../../base.package_specs.md)
- [Button Component](../button/button.specs.md)
- [Select Component](../select/select.specs.md)
- [Textarea Component](../textarea/textarea.specs.md)
