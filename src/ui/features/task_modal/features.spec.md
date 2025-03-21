# Task Modal Component Specification

## Overview
The Task Modal component provides an interface for creating new tasks and editing existing tasks. It presents a form with all task fields and handles validation and submission.

## Product Requirements
- Allow creation of new tasks with all required fields
- Enable editing of existing task information
- Provide validation for required fields
- Support all task properties (title, description, status, priority, assignee, due date)
- Allow canceling operations without saving
- Provide clear feedback for successful/failed operations

## Technical Requirements
- Build with React and TypeScript
- Use base form components from the design kit (input, select, textarea, button)
- Implement form validation
- Handle form submission
- Support keyboard interactions (tab navigation, Escape to close)
- Ensure accessibility for screen readers

## Behavioral Expectations
- The modal should be centered on the screen with a backdrop
- Required fields should be clearly marked
- Validation errors should appear inline with the relevant fields
- Submit button should be disabled until all required fields are valid
- Escape key should close the modal
- Clicking outside the modal should close it (with confirmation if there are unsaved changes)
- Due date field should use a date picker component

## Interfaces
```typescript
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task;
  onSubmit: (task: Omit<Task, 'id'> | Task) => void;
  isCreating?: boolean;
}

interface TaskFormData {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  assignee?: string;
  dueDate?: string;
}

type ValidationErrors = Partial<Record<keyof TaskFormData, string>>;
```

## Related Files
- task_modal.tsx - Main modal component
- task_form.tsx - Form component within the modal
- form_validation.ts - Validation utilities for the task form
