import React from 'react';
import { Task } from '@/types';

type TaskFilters = {
  status?: Task['status'];
  priority?: Task['priority'];
  assignee?: string;
}

type TaskFilterProps = {
  filters: TaskFilters;
  onFilterChange: (filters: Partial<TaskFilters>) => void;
  availableAssignees?: string[];
}

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

  // Check if any filters are active
  const hasActiveFilters = filters.status !== undefined ||
                          filters.priority !== undefined ||
                          filters.assignee !== undefined;

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
            className={`w-full rounded-md border-gray-300 ${filters.status ? 'bg-blue-50 border-blue-300' : ''}`}
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
            className={`w-full rounded-md border-gray-300 ${filters.priority ? 'bg-blue-50 border-blue-300' : ''}`}
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
            className={`w-full rounded-md border-gray-300 ${filters.assignee ? 'bg-blue-50 border-blue-300' : ''}`}
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
            className={`px-4 py-2 rounded ${hasActiveFilters ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={clearFilters}
            aria-label={activeFilterCount > 0 ? `Clear ${activeFilterCount} active filters` : "Clear filters"}
            disabled={!hasActiveFilters}
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
