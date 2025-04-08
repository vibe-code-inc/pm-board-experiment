---
description: Task Filter Utility Specification
type: utility
---

<specification>
  <meta>
    <title>Task Filter Utility</title>
    <description>A utility for filtering tasks based on various criteria including status, priority, and assignee.</description>
    <created-at utc-timestamp="1712678400">April 9, 2024, 10:00 AM EDT</created-at>
    <last-updated utc-timestamp="1712764800">April 10, 2024, 10:00 AM EDT</last-updated>
    <applies-to>
      <file-matcher glob="src/features/task_management/task_filter.tsx">Task Filter Component Implementation</file-matcher>
    </applies-to>
  </meta>

  <overview>
    <description>The TaskFilter component provides an interface for filtering tasks based on different criteria. It allows users to refine the task list view by selecting various filter options.</description>
    <responsibility>Enable users to filter and refine task list views based on various criteria</responsibility>
  </overview>

  <requirements>
    <functional-requirements>
      <requirement priority="high">
        <description>Allow filtering tasks by status</description>
      </requirement>
      <requirement priority="high">
        <description>Allow filtering tasks by priority</description>
      </requirement>
      <requirement priority="high">
        <description>Allow filtering tasks by assignee</description>
      </requirement>
      <requirement priority="high">
        <description>Support clearing all filters</description>
      </requirement>
      <requirement priority="high">
        <description>Provide a clean and intuitive filter interface</description>
      </requirement>
      <requirement priority="medium">
        <description>Show active filters with visual indicators</description>
      </requirement>
      <requirement priority="medium">
        <description>Support combining multiple filter criteria</description>
      </requirement>
      <requirement priority="low">
        <description>Allow saving common filter combinations</description>
      </requirement>
      <requirement priority="high">
        <description>Ensure the filter interface is accessible to all users</description>
      </requirement>
    </functional-requirements>

    <technical-requirements>
      <requirement priority="high">
        <description>Implement with React and TypeScript</description>
      </requirement>
      <requirement priority="high">
        <description>Create responsive filter layout</description>
      </requirement>
      <requirement priority="high">
        <description>Support various screen sizes</description>
      </requirement>
      <requirement priority="high">
        <description>Implement accessible form controls with proper labels and ARIA attributes</description>
      </requirement>
      <requirement priority="medium">
        <description>Optimize for performance</description>
      </requirement>
      <requirement priority="high">
        <description>Support keyboard navigation and screen readers</description>
      </requirement>
      <requirement priority="high">
        <description>Use Tailwind CSS for styling</description>
      </requirement>
      <requirement priority="high">
        <description>Use types instead of interfaces as per project conventions</description>
      </requirement>
      <requirement priority="high">
        <description>Follow single responsibility principle for filter logic</description>
      </requirement>
      <requirement priority="high">
        <description>Properly handle state management for filter options</description>
      </requirement>
      <requirement priority="high">
        <description>Implement proper TypeScript typing for all props and handlers</description>
      </requirement>
      <requirement priority="high">
        <description>Use proper event typing for change handlers</description>
      </requirement>
    </technical-requirements>

    <behavioral-expectations>
      <expectation priority="high">
        <description>Changing a filter should immediately update the task list</description>
      </expectation>
      <expectation priority="high">
        <description>Multiple filters should be combined with AND logic</description>
      </expectation>
      <expectation priority="medium">
        <description>Active filters should be visually indicated</description>
      </expectation>
      <expectation priority="high">
        <description>Clearing filters should reset to showing all tasks</description>
      </expectation>
      <expectation priority="medium">
        <description>Filter state should persist during the session</description>
      </expectation>
      <expectation priority="high">
        <description>Filter controls should be intuitive and easy to use</description>
      </expectation>
      <expectation priority="medium">
        <description>Mobile view should adapt for touch interaction</description>
      </expectation>
      <expectation priority="high">
        <description>Keyboard users should be able to navigate and operate all filter controls</description>
      </expectation>
      <expectation priority="high">
        <description>Screen readers should properly announce filter options and current selections</description>
      </expectation>
      <expectation priority="high">
        <description>Form controls should have proper focus states</description>
      </expectation>
    </behavioral-expectations>
  </requirements>

  <interfaces>
    <interface type="props">
      <definition><![CDATA[type TaskFilters = {
  status?: Task['status'];
  priority?: Task['priority'];
  assignee?: string;
};

type TaskFilterProps = {
  filters: TaskFilters;
  onFilterChange: (filters: Partial<TaskFilters>) => void;
  availableAssignees?: string[];
};]]></definition>
    </interface>
  </interfaces>

  <implementation>
    <files>
      <file path="src/features/task_management/task_filter.tsx" action="create">
        <changes>Create the TaskFilter component implementation</changes>
        <example><![CDATA[export const TaskFilter: React.FC<TaskFilterProps> = ({
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
            aria-label={`Clear all filters ${activeFilterCount > 0 ? `(${activeFilterCount} active)` : ''}`}
          >
            Clear Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gray-700 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};]]></example>
      </file>
    </files>
  </implementation>

  <dependencies>
    <dependency>
      <name>React</name>
      <version>^18.0.0</version>
    </dependency>
    <dependency>
      <name>TypeScript</name>
      <version>^5.0.0</version>
    </dependency>
    <dependency>
      <name>Tailwind CSS</name>
      <version>^3.0.0</version>
    </dependency>
  </dependencies>

  <references>
    <reference>
      <name>Task Type Definition</name>
      <path>src/types.specs.md</path>
    </reference>
    <reference>
      <name>Task List Specification</name>
      <path>src/features/task_management/task_list.specs.md</path>
    </reference>
    <reference>
      <name>Task Management Package Specification</name>
      <path>src/features/task_management/task_management.package_specs.md</path>
    </reference>
  </references>
</specification>
