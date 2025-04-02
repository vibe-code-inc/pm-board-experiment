# Task Filter Component Specification

## Overview
The TaskFilter component provides an interface for filtering tasks based on different criteria. It allows users to refine the task list view by selecting various filter options.

## Product Requirements
- Allow filtering tasks by status
- Allow filtering tasks by priority
- Allow filtering tasks by assignee
- Support clearing all filters
- Provide a clean and intuitive filter interface
- Show active filters with visual indicators
- Support combining multiple filter criteria
- Allow saving common filter combinations
- Ensure the filter interface is accessible to all users

## Technical Requirements
- Implement with React and TypeScript
- Create responsive filter layout
- Support various screen sizes
- Implement accessible form controls with proper labels and ARIA attributes
- Optimize for performance
- Support keyboard navigation and screen readers
- Use Tailwind CSS for styling
- Use types instead of interfaces as per project conventions
- Follow single responsibility principle for filter logic
- Properly handle state management for filter options
- Implement proper TypeScript typing for all props and handlers
- Use proper event typing for change handlers

## Behavioral Expectations
- Changing a filter should immediately update the task list
- Multiple filters should be combined with AND logic
- Active filters should be visually indicated
- Clearing filters should reset to showing all tasks
- Filter state should persist during the session
- Filter controls should be intuitive and easy to use
- Mobile view should adapt for touch interaction
- Keyboard users should be able to navigate and operate all filter controls
- Screen readers should properly announce filter options and current selections
- Form controls should have proper focus states

## Component Structure
```typescript
type TaskFilters = {
  status?: Task['status'];
  priority?: Task['priority'];
  assignee?: string;
};

type TaskFilterProps = {
  filters: TaskFilters;
  onFilterChange: (filters: Partial<TaskFilters>) => void;
  availableAssignees?: string[];
};

export const TaskFilter: React.FC<TaskFilterProps> = ({
  filters,
  onFilterChange,
  availableAssignees = [],
}) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? undefined : e.target.value as Task['status'];
    onFilterChange({ status: value });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? undefined : e.target.value as Task['priority'];
    onFilterChange({ priority: value });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? undefined : e.target.value;
    onFilterChange({ assignee: value });
  };

  const clearFilters = () => {
    onFilterChange({
      status: undefined,
      priority: undefined,
      assignee: undefined,
    });
  };

  // Count active filters for accessibility announcements
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div
      className="bg-white p-4 rounded-lg shadow"
      role="region"
      aria-label="Task filters"
    >
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="status-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status-filter"
            className="w-full rounded-md border-gray-300"
            value={filters.status || 'all'}
            onChange={handleStatusChange}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="priority-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priority-filter"
            className="w-full rounded-md border-gray-300"
            value={filters.priority || 'all'}
            onChange={handlePriorityChange}
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="assignee-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Assignee
          </label>
          <select
            id="assignee-filter"
            className="w-full rounded-md border-gray-300"
            value={filters.assignee || 'all'}
            onChange={handleAssigneeChange}
            aria-label="Filter by assignee"
          >
            <option value="all">All Assignees</option>
            {availableAssignees.map(assignee => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={clearFilters}
            aria-label={activeFilterCount > 0 ? `Clear ${activeFilterCount} active filters` : "Clear filters"}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div
          className="mt-2 text-sm text-gray-500"
          aria-live="polite"
        >
          {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
        </div>
      )}
    </div>
  );
};
```

## Related Specifications
- [Task Management Features](./task_management.package_specs.md)
- [Select Component](../../ui/base/design_kit/select/select.specs.md)
