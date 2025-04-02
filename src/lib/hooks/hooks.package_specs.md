# Custom Hooks Specification

## Overview
The Custom Hooks package provides reusable React hooks for common patterns and behaviors used throughout the PM Board application. These hooks encapsulate component logic, making it easier to share functionality between components.

## Technical Requirements
- Implement hooks following the React Hooks API guidelines
- Ensure proper TypeScript typing for all hooks
- Provide comprehensive JSDoc documentation
- Handle proper cleanup in useEffect hooks
- Optimize for performance and prevent unnecessary renders
- Follow naming convention of prefixing with "use"
- Ensure hooks are tested for correctness
- Implement proper error handling
- Export hooks individually for better tree-shaking
- Use types instead of interfaces as per project conventions
- Follow functional programming principles
- Ensure hooks are compatible with React's concurrent mode

## Included Hooks

### useLocalStorage
A hook to persist state in local storage.

```typescript
/**
 * Hook for synchronizing state with localStorage
 * @param key The localStorage key
 * @param initialValue The initial value
 * @returns [storedValue, setValue] tuple
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void]
```

### useTaskManager
A hook to manage tasks including CRUD operations, filtering, and sorting.

```typescript
/**
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
}
```

### useDisclosure
A hook for managing open/close state of modals, dropdowns, etc.

```typescript
/**
 * Hook for managing disclosure state (open/close)
 * @param initialState Initial open state
 * @returns Object containing isOpen state and toggle functions
 */
export function useDisclosure(initialState: boolean = false): {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}
```

### useDebouncedValue
A hook to debounce a value change, useful for search inputs.

```typescript
/**
 * Hook for debouncing a value change
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T
```

### usePrevious
A hook to access the previous value of a state or prop.

```typescript
/**
 * Hook to access the previous value of a state or prop
 * @param value The current value
 * @returns The previous value
 */
export function usePrevious<T>(value: T): T | undefined
```

## Implementation Guidelines
- Each hook should live in its own file named after the hook
- All hooks should be re-exported from an index.ts file
- Hooks should validate their inputs where appropriate
- Hooks should provide meaningful error messages
- Complex hooks should be built by composing simpler hooks
- Side effects in hooks should always be cleaned up
- Hooks should memoize callbacks and computed values where appropriate
- Type definitions should be comprehensive and reusable

## Related Specifications
- [Library Utilities](../lib.package_specs.md)
- [Task Actions](../../features/task_management/task_actions.specs.md)
- [Task Management](../../features/task_management/task_management.package_specs.md)
