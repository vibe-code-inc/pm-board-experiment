# Base UI Components Specification

## Overview
The Base UI components are primitive, reusable UI elements that form the foundation of the application's design system. These components are used throughout the application to maintain visual consistency and reduce code duplication.

## Product Requirements
- Provide a consistent visual language across the application
- Support different variants and sizes for each component
- Ensure accessible components that meet WCAG standards
- Enable theming and customization
- Maintain a modern and clean aesthetic

## Technical Requirements
- Build components using React and TypeScript
- Use Tailwind CSS for styling
- Ensure components are fully typed with TypeScript
- Implement responsive behavior
- Support keyboard navigation and screen readers
- Follow a composition pattern for complex components

## Behavioral Expectations
- Components should be responsive and adapt to different screen sizes
- Interactive elements should provide appropriate hover, focus, and active states
- Components should use consistent motion and animation patterns
- Error states should be clearly communicated to users
- Loading states should be handled gracefully

## Design Kit Structure
The design_kit directory contains the following component categories:
- button - Button components in various styles and sizes
- input - Text input components
- select - Dropdown selection components
- textarea - Multi-line text input components
- checkbox - Checkbox components
- radio - Radio button components
- toggle - Toggle switch components
- card - Card container components
- dialog - Modal dialog components
- tooltip - Tooltip components
- avatar - User avatar components
- badge - Badge and tag components
- alert - Alert and notification components
- progress - Progress indicator components

## Interfaces (Example for Button)
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}
```

## Related Files
- design_kit/button/button.tsx
- design_kit/button/button_styles.ts
- design_kit/input/input.tsx
- design_kit/select/select.tsx
- design_kit/textarea/textarea.tsx

## Related Specifications
- [Button Component](./design_kit/specs/button.tsx.spec.md)
- [Input Component](./design_kit/specs/input.tsx.spec.md)
- [Select Component](./design_kit/specs/select.tsx.spec.md)
- [Textarea Component](./design_kit/specs/textarea.tsx.spec.md)
