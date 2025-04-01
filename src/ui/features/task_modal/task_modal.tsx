import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task } from '@/types';
import { Button } from '@/ui/base/design_kit/button/button';
import { Input } from '@/ui/base/design_kit/input/input';
import { Select } from '@/ui/base/design_kit/select/select';
import { Textarea } from '@/ui/base/design_kit/textarea/textarea';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onSave: (task: Task) => void;
  onChange?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
  onChange,
  onDelete,
}) => {
  // State for form fields and validation
  const [formData, setFormData] = useState<Task>({...task});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when task prop changes
  useEffect(() => {
    setFormData({...task});
  }, [task]);

  // Form field change handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    // Call onChange if it exists
    onChange?.(updatedFormData);

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
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
    try {
      onSave(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler with confirmation
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete?.(task.id);
      onClose();
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-lg mx-auto my-8 md:my-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Edit Task</h2>
          <Button variant="ghost" onClick={onClose} className="p-1 md:p-2">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            rows={3}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Due Date"
              name="dueDate"
              value={formData.dueDate || ''}
              onChange={handleChange}
            />
            <Input
              label="Assignee"
              name="assignee"
              value={formData.assignee || ''}
              onChange={handleChange}
              placeholder="Enter assignee name"
            />
          </div>
          <div className="flex justify-between items-center pt-4">
            {onDelete && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleDelete}
                className="text-red-600"
              >
                Delete
              </Button>
            )}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:space-x-3">
              <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
