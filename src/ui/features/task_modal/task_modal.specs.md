# Task Modal Component Specification

## Overview
The Task Modal component provides an interface for viewing and editing task details. It displays all task information in a modal dialog and allows users to update task properties.

## Product Requirements
- Display task details in a modal overlay
- Support editing all task properties
- Provide form validation for required fields
- Allow users to save or cancel edits
- Show appropriate error messages for invalid inputs
- Support keyboard navigation and shortcuts
- Implement accessible form controls
- Display loading state during save operations
- Confirm before discarding unsaved changes
- Provide visual feedback for form submission
- Allow task deletion from the modal

## Technical Requirements
- Implement with React and TypeScript
- Use Tailwind CSS for styling
- Build on top of base UI components
- Implement proper focus management
- Support keyboard shortcuts for common actions
- Implement form validation
- Ensure trap focus within the modal
- Implement proper ARIA attributes
- Support responsive design for different screen sizes
- Optimize for performance
- Implement proper error handling

## Behavioral Expectations
- Modal should open centered on the screen
- Backdrop should prevent interaction with the underlying page
- Focus should be trapped within the modal
- Required fields should be validated before save
- Pressing Escape key should close the modal
- Tab key should cycle through form controls
- Changes should only be applied after Save button is clicked
- Cancel button should discard changes and close the modal
- Save button should be disabled during save operation
- Error states should be clearly indicated with messages
- Delete confirmation should prevent accidental deletion

## Component Structure
```typescript
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
}) => {
  // State for form fields and validation
  const [formData, setFormData] = useState<Task>({...task});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form field change handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation logic

    // Save logic with loading state
    setIsSubmitting(true);
    onSave(formData);
    setIsSubmitting(false);
    onClose();
  };

  // Delete handler with confirmation
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete?.(task.id);
      onClose();
    }
  };

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">{formData.id ? 'Edit Task' : 'New Task'}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* Form fields for task properties */}
            {/* Title field */}
            {/* Status field */}
            {/* Priority field */}
            {/* Description field */}
            {/* Assignee field */}
            {/* Due date field */}
          </div>

          <div className="px-6 py-4 border-t flex justify-between items-center">
            {onDelete && (
              <button
                type="button"
                className="text-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}

            <div className="flex space-x-2">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
```

## Related Specifications
- [Feature UI Components](../features.package_specs.md)
- [Base Button Component](../../base/design_kit/button/button.specs.md)
- [Task Card Component](../task_card/task_card.specs.md)
