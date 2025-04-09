---
description: Textarea Component Specification
type: component
---

<specification>
  <meta>
    <title>Textarea Component Specification</title>
    <description>The Textarea component provides a standardized, accessible multi-line text input field with support for validation and error states. It serves as a foundational element in forms throughout the application for collecting larger text inputs.</description>
    <created-at utc-timestamp="1712678400">April 9, 2024, 10:00 AM EDT</created-at>
    <applies-to>
      <file-matcher glob="src/ui/base/design_kit/textarea/textarea.tsx">Textarea Component</file-matcher>
    </applies-to>
  </meta>

  <overview>
    <description>The Textarea component provides a standardized, accessible multi-line text input field with support for validation and error states. It serves as a foundational element in forms throughout the application for collecting larger text inputs.</description>
    <responsibility>Provide a consistent, accessible multi-line text input field for collecting larger text inputs with validation support</responsibility>
  </overview>

  <requirements>
    <functional-requirements>
      <requirement priority="high">
        <description>Display a multi-line text input field with consistent styling</description>
      </requirement>
      <requirement priority="high">
        <description>Support optional label text displayed above the textarea</description>
      </requirement>
      <requirement priority="high">
        <description>Display error messages when validation fails</description>
      </requirement>
      <requirement priority="medium">
        <description>Maintain consistent appearance with other form elements</description>
      </requirement>
      <requirement priority="medium">
        <description>Support responsive design for different screen sizes</description>
      </requirement>
      <requirement priority="medium">
        <description>Allow for flexible height adjustment based on content</description>
      </requirement>
      <requirement priority="high">
        <description>Ensure accessibility for all users including keyboard and screen reader users</description>
      </requirement>
      <requirement priority="high">
        <description>Provide clear visual feedback for different states (default, focus, error, disabled)</description>
      </requirement>
    </functional-requirements>

    <technical-requirements>
      <requirement priority="high">
        <description>Implement as a controlled component with React and TypeScript</description>
      </requirement>
      <requirement priority="high">
        <description>Extend the standard HTML textarea element attributes</description>
      </requirement>
      <requirement priority="high">
        <description>Use Tailwind CSS for styling with project conventions</description>
      </requirement>
      <requirement priority="high">
        <description>Support accessibility features with proper ARIA attributes and labeling</description>
      </requirement>
      <requirement priority="high">
        <description>Ensure proper integration with form validation</description>
      </requirement>
      <requirement priority="high">
        <description>Implement consistent error state styling</description>
      </requirement>
      <requirement priority="medium">
        <description>Support for resizing behavior (vertical, horizontal, both, or none)</description>
      </requirement>
      <requirement priority="high">
        <description>Use types instead of interfaces as per project conventions</description>
      </requirement>
      <requirement priority="medium">
        <description>Implement proper ID generation for label association</description>
      </requirement>
      <requirement priority="high">
        <description>Follow single responsibility principle</description>
      </requirement>
      <requirement priority="high">
        <description>Create a reusable component that maintains focus states</description>
      </requirement>
      <requirement priority="high">
        <description>Support all standard HTML textarea attributes</description>
      </requirement>
    </technical-requirements>

    <behavioral-expectations>
      <expectation priority="high">
        <description>Display label when provided with proper HTML association</description>
      </expectation>
      <expectation priority="high">
        <description>Show error message below the textarea when error prop is provided</description>
      </expectation>
      <expectation priority="high">
        <description>Apply error styling when in error state</description>
      </expectation>
      <expectation priority="medium">
        <description>Support all standard HTML textarea behaviors</description>
      </expectation>
      <expectation priority="medium">
        <description>Pass through all unspecified props to the underlying textarea element</description>
      </expectation>
      <expectation priority="high">
        <description>Maintain proper focus states and keyboard navigation</description>
      </expectation>
      <expectation priority="high">
        <description>Allow for multi-line text input with appropriate wrapping</description>
      </expectation>
      <expectation priority="medium">
        <description>Properly handle form submission</description>
      </expectation>
      <expectation priority="high">
        <description>Announce error messages to screen readers</description>
      </expectation>
      <expectation priority="medium">
        <description>Allow custom styling through className prop</description>
      </expectation>
      <expectation priority="high">
        <description>Provide proper focus indicators for keyboard users</description>
      </expectation>
    </behavioral-expectations>
  </requirements>

  <interfaces>
    <interface type="props">
      <definition><![CDATA[type TextareaProps = {
  // Optional label text to display above the textarea
  label?: string;
  // Optional error message to display below the textarea
  error?: string;
  // Optional ID for the textarea (auto-generated if not provided)
  id?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;]]></definition>
    </interface>
  </interfaces>

  <implementation>
    <files>
      <file path="src/ui/base/design_kit/textarea/textarea.tsx" action="create">
        <changes>Create Textarea component implementation</changes>
        <example><![CDATA[import * as React from 'react';
import { cn } from '@/lib/utils';

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
};]]></example>
      </file>
    </files>

    <dependencies>
      <dependency type="external">react for UI components</dependency>
      <dependency type="internal">cn utility from @/lib/utils</dependency>
    </dependencies>
  </implementation>

  <references>
    <reference href="../../base.package_specs.md">Base UI Components</reference>
    <reference href="../button/button.specs.md">Button Component</reference>
    <reference href="../input/input.specs.md">Input Component</reference>
    <reference href="../select/select.specs.md">Select Component</reference>
  </references>
</specification>
