import React from 'react';
import { X } from 'lucide-react';
import { Task } from '@/types';
import { Button } from '@/ui/base/design_kit/button/button';
import { Input } from '@/ui/base/design_kit/input/input';
import { Select } from '@/ui/base/design_kit/select/select';
import { Textarea } from '@/ui/base/design_kit/textarea/textarea';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
  onChange: (task: Task) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  onClose,
  onSave,
  onChange,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(task);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Task</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={task.title}
            onChange={(e) => onChange({ ...task, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={task.description}
            onChange={(e) => onChange({ ...task, description: e.target.value })}
            rows={3}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={task.priority}
              onChange={(e) => onChange({ ...task, priority: e.target.value as Task['priority'] })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <Input
              type="date"
              label="Due Date"
              value={task.dueDate}
              onChange={(e) => onChange({ ...task, dueDate: e.target.value })}
            />
          </div>
          <Input
            label="Assignee"
            value={task.assignee || ''}
            onChange={(e) => onChange({ ...task, assignee: e.target.value })}
            placeholder="Enter assignee name"
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
