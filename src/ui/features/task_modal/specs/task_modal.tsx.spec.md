# Task Modal Component Specification

## Overview
The TaskModal component provides an interface for creating and editing tasks. It displays a form in a modal overlay, allowing users to modify task details such as title, description, priority, due date, and assignee.

## Technical Requirements
- Implement a responsive modal dialog
- Provide form fields for all task properties
- Support input validation
- Handle form submission and cancellation
- Support keyboard navigation and accessibility
- Prevent background scrolling when modal is open
- Implement focus trapping within the modal
- Support appropriate close methods (button, escape key, overlay click)

## Behavioral Expectations
- Display form with current task values pre-populated
- Validate required fields before submission
- Provide visual feedback for validation errors
- Close when Cancel button is clicked
- Save changes when Save button is clicked or form is submitted
- Support keyboard submission (Enter key)
- Maintain proper spacing and layout on all screen sizes
- Trap focus within the modal for accessibility
- Close on Escape key press

## Component Structure
```
<div className="modal-overlay">
  <div className="modal-container">
    <div className="modal-header">
      <h2>Edit Task</h2>
      <button className="close-button"><X /></button>
    </div>
    <form className="task-form">
      <Input label="Title" ... />
      <Textarea label="Description" ... />
      <div className="form-row">
        <Select label="Priority" ... />
        <Input label="Due Date" type="date" ... />
      </div>
      <Input label="Assignee" ... />
      <div className="form-actions">
        <Button variant="secondary">Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  </div>
</div>
```

## Interfaces
```typescript
interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
  onChange: (task: Task) => void;
}
```

## Related Files
- task_modal.tsx - Main component implementation
- ../features.spec.md - Task modal feature specification
- ../../base/design_kit/button/button.tsx - Button component
- ../../base/design_kit/input/input.tsx - Input component
- ../../base/design_kit/select/select.tsx - Select component
- ../../base/design_kit/textarea/textarea.tsx - Textarea component

## Implementation Notes
- Uses design kit components for form elements
- Implements mobile-responsive layout
- Uses fixed positioning with z-index for overlay
- Prevents body scrolling when modal is open
- Transitions opacity for smooth opening/closing
- Traps focus for better accessibility
- Uses form validation for required fields
