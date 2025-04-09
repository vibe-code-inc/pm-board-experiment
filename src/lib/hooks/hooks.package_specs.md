---
description: Custom Hooks Package Specification
type: package
---

<specification>
  <meta>
    <title>Custom Hooks Specification</title>
    <description>Reusable React hooks for common patterns and behaviors used throughout the PM Board application</description>
    <created-at utc-timestamp="1712678400">April 9, 2024, 10:00 AM EDT</created-at>
    <applies-to>
      <file-matcher glob="src/lib/hooks/**/*.{ts,tsx}">Custom React Hooks</file-matcher>
    </applies-to>
  </meta>

  <overview>
    <description>The Custom Hooks package provides reusable React hooks for common patterns and behaviors used throughout the PM Board application. These hooks encapsulate component logic, making it easier to share functionality between components.</description>
    <responsibility>Provide reusable stateful logic and behavior for React components</responsibility>
  </overview>

  <requirements>
    <technical-requirements>
      <requirement priority="high">
        <description>Implement hooks following the React Hooks API guidelines</description>
      </requirement>
      <requirement priority="high">
        <description>Ensure proper TypeScript typing for all hooks</description>
      </requirement>
      <requirement priority="medium">
        <description>Provide comprehensive JSDoc documentation</description>
      </requirement>
      <requirement priority="high">
        <description>Handle proper cleanup in useEffect hooks</description>
      </requirement>
      <requirement priority="medium">
        <description>Optimize for performance and prevent unnecessary renders</description>
      </requirement>
      <requirement priority="high">
        <description>Follow naming convention of prefixing with "use"</description>
      </requirement>
      <requirement priority="medium">
        <description>Ensure hooks are tested for correctness</description>
      </requirement>
      <requirement priority="medium">
        <description>Implement proper error handling</description>
      </requirement>
      <requirement priority="medium">
        <description>Export hooks individually for better tree-shaking</description>
      </requirement>
      <requirement priority="high">
        <description>Use types instead of interfaces as per project conventions</description>
      </requirement>
      <requirement priority="medium">
        <description>Follow functional programming principles</description>
      </requirement>
      <requirement priority="medium">
        <description>Ensure hooks are compatible with React's concurrent mode</description>
      </requirement>
    </technical-requirements>

    <implementation-guidelines>
      <guideline priority="high">
        <description>Each hook should live in its own file named after the hook</description>
      </guideline>
      <guideline priority="medium">
        <description>All hooks should be re-exported from an index.ts file</description>
      </guideline>
      <guideline priority="high">
        <description>Hooks should validate their inputs where appropriate</description>
      </guideline>
      <guideline priority="medium">
        <description>Hooks should provide meaningful error messages</description>
      </guideline>
      <guideline priority="medium">
        <description>Complex hooks should be built by composing simpler hooks</description>
      </guideline>
      <guideline priority="high">
        <description>Side effects in hooks should always be cleaned up</description>
      </guideline>
      <guideline priority="medium">
        <description>Hooks should memoize callbacks and computed values where appropriate</description>
      </guideline>
      <guideline priority="high">
        <description>Type definitions should be comprehensive and reusable</description>
      </guideline>
    </implementation-guidelines>
  </requirements>

  <components>
    <component name="useLocalStorage" description="A hook to persist state in local storage">
      <implementation><![CDATA[/**
 * Hook for synchronizing state with localStorage
 * @param key The localStorage key
 * @param initialValue The initial value
 * @returns [storedValue, setValue] tuple
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void]]]></implementation>
    </component>

    <component name="useTaskManager" description="A hook to manage tasks including CRUD operations, filtering, and sorting">
      <implementation><![CDATA[/**
 * Hook for managing tasks with filtering, sorting, and CRUD operations
 * @param initialTasks The initial array of tasks
 * @returns Object containing tasks, operations, filtering and sorting utilities
 */
export function useTaskManager(initialTasks: Task[]): {
  tasks: Task[];
  filteredTasks: Task[];
  filters: Partial<TaskFilters>;
  sortField: keyof Task;
  sortDirection: SortDirection;
  createTask: (taskData: Partial<Task>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  setSorting: (field: keyof Task, direction: SortDirection) => void;
}]]></implementation>
    </component>

    <component name="useDisclosure" description="A hook for managing open/close state of modals, dropdowns, etc.">
      <implementation><![CDATA[/**
 * Hook for managing disclosure state (open/close)
 * @param initialState Initial open state
 * @returns Object containing isOpen state and toggle functions
 */
export function useDisclosure(initialState: boolean = false): {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}]]></implementation>
    </component>

    <component name="useDebouncedValue" description="A hook to debounce a value change, useful for search inputs">
      <implementation><![CDATA[/**
 * Hook for debouncing a value change
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T]]></implementation>
    </component>

    <component name="usePrevious" description="A hook to access the previous value of a state or prop">
      <implementation><![CDATA[/**
 * Hook to access the previous value of a state or prop
 * @param value The current value
 * @returns The previous value
 */
export function usePrevious<T>(value: T): T | undefined]]></implementation>
    </component>
  </components>

  <references>
    <reference href="../lib.package_specs.md">Library Utilities Package Specification</reference>
    <reference href="../../features/task_management/task_actions.specs.md">Task Actions Component Specification</reference>
    <reference href="../../features/task_management/task_management.package_specs.md">Task Management Package Specification</reference>
  </references>
</specification>
