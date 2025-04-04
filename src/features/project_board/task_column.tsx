import React, { useRef } from 'react';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from '@/ui/features/task_card/task_card';

type TaskColumnProps = {
  // Column status identifier
  status: TaskStatus;
  // Display name for the column
  title: string;
  // Tasks belonging to this column
  tasks: Task[];
  // Whether a task is currently being dragged over this column
  isDraggedOver: boolean;
  // Information about where to render the drop placeholder, if any
  dropPlaceholderPosition: {
    containerId: string;
    targetId: string | null;
    position: 'before' | 'after';
  } | null;
  // Placeholder component to render between tasks
  placeholderComponent: React.ReactNode;
  // Callbacks
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onTaskStatusChange: (taskId: string, status: TaskStatus) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDragStart: (taskId: string, element?: HTMLElement) => void;
  onTaskDragEnd: () => void;
};

export const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  title,
  tasks,
  isDraggedOver,
  dropPlaceholderPosition,
  placeholderComponent,
  onDragOver,
  onDrop,
  onDragLeave,
  onTaskStatusChange,
  onTaskEdit,
  onTaskDragStart,
  onTaskDragEnd
}) => {
  // Column ref for DOM manipulation if needed
  const columnRef = useRef<HTMLDivElement>(null);

  // Helper to render tasks with placeholders
  const renderTasksWithPlaceholder = () => {
    if (tasks.length === 0) {
      if (dropPlaceholderPosition?.containerId === status) {
        return placeholderComponent;
      }
      return <div className="text-gray-400 text-center p-4">No tasks</div>;
    }

    return (
      <>
        {tasks.map(task => {
          // Check if placeholder should be rendered before this task
          const renderPlaceholderBefore =
            dropPlaceholderPosition?.containerId === status &&
            dropPlaceholderPosition.targetId === task.id &&
            dropPlaceholderPosition.position === 'before';

          // Check if placeholder should be rendered after this task
          const renderPlaceholderAfter =
            dropPlaceholderPosition?.containerId === status &&
            dropPlaceholderPosition.targetId === task.id &&
            dropPlaceholderPosition.position === 'after';

          return (
            <React.Fragment key={task.id}>
              {renderPlaceholderBefore && placeholderComponent}
              <TaskCard
                task={task}
                onStatusChange={(newStatus) => onTaskStatusChange(task.id, newStatus)}
                onEdit={() => onTaskEdit(task)}
              />
              {renderPlaceholderAfter && placeholderComponent}
            </React.Fragment>
          );
        })}

        {/* If placeholder should be at the bottom with no target task */}
        {dropPlaceholderPosition?.containerId === status &&
         dropPlaceholderPosition.targetId === null &&
          placeholderComponent}
      </>
    );
  };

  // Column class with conditional styling based on drag state
  const columnClass = `bg-white rounded-lg shadow p-4 flex flex-col ${
    isDraggedOver ? 'ring-2 ring-blue-500 ring-opacity-70' : ''
  }`;

  return (
    <div
      ref={columnRef}
      className={columnClass}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      data-column={status}
    >
      <h2 className="text-lg font-semibold mb-4">{title} ({tasks.length})</h2>
      <div className="flex-1 overflow-y-auto">
        {renderTasksWithPlaceholder()}
      </div>
    </div>
  );
};
