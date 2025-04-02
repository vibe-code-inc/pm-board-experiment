# Task Modal Component Specification

## Overview
The Task Modal component provides an interface for viewing and editing task details. It displays all task information in a modal dialog and allows users to update task properties.

## Product Requirements
- Display task details in a modal overlay
- Support editing all task properties (title, description, status, priority, assignee, due date)
- Provide form validation for required fields
- Allow users to save or cancel edits
- Show appropriate error messages for invalid inputs
- Support keyboard navigation and shortcuts (Escape to close, Alt+S to save)
- Implement accessible form controls with proper labeling
- Display loading state during save operations
- Confirm before discarding unsaved changes
- Provide visual feedback for form submission
- Allow task deletion from the modal with confirmation
- Focus appropriate elements when modal opens

## Technical Requirements
- Implement with React and TypeScript
- Use Tailwind CSS for styling
- Implement proper focus management with focus trapping
- Support keyboard shortcuts for common actions
- Implement comprehensive form validation with error messages
- Use refs to manage focus within the modal
- Implement proper ARIA attributes for accessibility
- Handle unsaved changes with confirmation
- Track all focusable elements in the modal
- Set initial focus on the title input when opened
- Optimize for performance with appropriate React hooks
- Follow single responsibility principle for state and UI logic
- Use type definitions instead of interfaces according to project conventions
- Maintain proper state updates for form data and validation

## Behavioral Expectations
- Modal should open centered on the screen
- Backdrop should prevent interaction with the underlying page
- Focus should be trapped within the modal (Tab cycles through controls)
- Required fields should be validated before save
- Pressing Escape key should close the modal with confirmation if changes exist
- Tab key should cycle through form controls in a logical order
- Alt+S keyboard shortcut should trigger save action
- Changes should only be applied after Save button is clicked
- Cancel button should discard changes with confirmation if unsaved changes exist
- Save button should be disabled during save operation
- Error states should be clearly indicated with messages
- Initial focus should be set on the title input field
- Field labels should be properly associated with inputs
- Invalid fields should have proper ARIA attributes
- Delete confirmation should prevent accidental deletion

## Component Structure
```typescript
type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
};

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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  // Track all focusable elements for focus trap
  const focusableElements = useRef<HTMLElement[]>([]);

  // Update form data when task prop changes
  useEffect(() => {
    setFormData({...task});
    setHasUnsavedChanges(false);
  }, [task]);

  // Focus the title input when modal opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Set up focus trap and keyboard shortcuts
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // Find all focusable elements in the modal
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    focusableElements.current = Array.from(
      modalRef.current.querySelectorAll(selector)
    ) as HTMLElement[];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key to close modal
      if (e.key === 'Escape') {
        handleClose();
        return;
      }

      // Handle Tab key for focus trap
      if (e.key === 'Tab') {
        if (focusableElements.current.length === 0) return;

        // Shift+Tab
        if (e.shiftKey) {
          if (document.activeElement === focusableElements.current[0]) {
            e.preventDefault();
            focusableElements.current[focusableElements.current.length - 1].focus();
          }
        }
        // Tab
        else {
          if (document.activeElement === focusableElements.current[focusableElements.current.length - 1]) {
            e.preventDefault();
            focusableElements.current[0].focus();
          }
        }
      }

      // Alt+S for save
      if (e.key === 's' && e.altKey) {
        e.preventDefault();
        if (!isSubmitting && validateForm()) {
          saveButtonRef.current?.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSubmitting]);

  // Form field change handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setHasUnsavedChanges(true);

    // Clear any errors for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Due date validation - must be a valid date
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      if (isNaN(dueDate.getTime())) {
        newErrors.dueDate = 'Please enter a valid date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Save logic with loading state
    setIsSubmitting(true);
    onSave(formData);
    setIsSubmitting(false);
    setHasUnsavedChanges(false);
    onClose();
  };

  // Delete handler with confirmation
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete?.(task.id);
      onClose();
    }
  };

  // Close handler with unsaved changes check
  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-modal="true"
      aria-labelledby="modal-title"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden"
        role="document"
      >
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 id="modal-title" className="text-xl font-semibold">{formData.id ? 'Edit Task' : 'New Task'}</h2>
            <div className="text-xs text-gray-500">
              <kbd className="px-1 py-0.5 bg-gray-100 rounded">Alt+S</kbd> to save
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* Title field */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                ref={titleInputRef}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-required="true"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p id="title-error" className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Status field */}
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority field */}
            <div className="mb-4">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Description field */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-required="true"
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "description-error" : undefined}
              ></textarea>
              {errors.description && (
                <p id="description-error" className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Assignee field */}
            <div className="mb-4">
              <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <input
                id="assignee"
                type="text"
                name="assignee"
                value={formData.assignee || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Due date field */}
            <div className="mb-4">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                name="dueDate"
                value={formData.dueDate || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.dueDate}
                aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
              />
              {errors.dueDate && (
                <p id="dueDate-error" className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t flex justify-between items-center">
            {onDelete && (
              <button
                type="button"
                ref={firstFocusableRef}
                className="text-red-600 hover:text-red-800"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}

            <div className="flex space-x-2">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                onClick={handleClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                ref={saveButtonRef}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
