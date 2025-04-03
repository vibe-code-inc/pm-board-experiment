import React, { useRef } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from '@/ui/task_card/task_card';
import { DropPlaceholder } from '@/ui/features/project_board/drop_placeholder';
import { useDragAndDropManager } from '@/lib/drag_drop/drag_drop_manager';

// Import the DragAndDropManager type from the hook's return type
type DragAndDropManager = ReturnType<typeof useDragAndDropManager>;

export interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  dragDropManager: DragAndDropManager;
  onTaskDrop: (
    taskId: string,
    sourceStatus: TaskStatus,
    targetTaskId: string | null,
    position: 'before' | 'after'
  ) => void;
  onTaskEdit: (task: Task) => void;
}

export function TaskColumn({
  status,
  title,
  tasks,
  dragDropManager,
  onTaskDrop,
  onTaskEdit
}: TaskColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const tasksRef = useRef<HTMLDivElement>(null);

  // Handle container drag over events to update the drop placeholder
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!columnRef.current || !tasksRef.current) return;

    // Get all task items in the column
    const taskElements = Array.from(tasksRef.current.querySelectorAll('[data-task-id]'));

    // Update the drop placeholder position
    dragDropManager.handleContainerDragOver(e, status, taskElements);
  };

  // Handle container drag leave
  const handleDragLeave = () => {
    dragDropManager.handleContainerDragLeave();
  };

  // Handle container drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!columnRef.current) return;

    // Handle the drop operation
    const result = dragDropManager.handleContainerDrop(e, status);
    if (!result) return;

    const { itemId, sourceContainerId, targetId, position } = result;

    // Notify the parent component about the task drop
    onTaskDrop(itemId, sourceContainerId as TaskStatus, targetId, position as 'before' | 'after');
  };

  // Handle task drag start
  const handleTaskDragStart = (taskId: string) => {
    dragDropManager.handleDragStart(taskId, status);
  };

  // Get the current drop placeholder position
  const showPlaceholder = dragDropManager.draggedOverContainerId === status &&
    dragDropManager.dropPlaceholderPosition !== null;

  // Determine if the placeholder should be at the top of an empty column
  const isEmptyColumnPlaceholder = showPlaceholder &&
    tasks.length === 0 &&
    dragDropManager.dropPlaceholderPosition?.targetId === null;

  // Helper for finding task index
  const getTaskIndexById = (taskId: string | null) => {
    if (!taskId) return -1;
    return tasks.findIndex(task => task.id === taskId);
  };

  // Get the active placeholder index
  const getPlaceholderIndex = () => {
    if (!dragDropManager.dropPlaceholderPosition) return -1;

    const { targetId, position } = dragDropManager.dropPlaceholderPosition;

    if (!targetId) return 0; // Top of the list

    const targetIndex = getTaskIndexById(targetId);
    if (targetIndex === -1) return -1;

    // Return the appropriate index based on position
    return position === 'before' ? targetIndex : targetIndex + 1;
  };

  // Is the column currently being dragged over
  const isActive = dragDropManager.draggedOverContainerId === status;

  return (
    <div
      ref={columnRef}
      className={`bg-white rounded-lg shadow p-4 flex flex-col w-80 min-w-80 ${
        isActive ? 'ring-2 ring-blue-500' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-column-id={status}
    >
      <h2 className="text-lg font-semibold mb-4">{title} ({tasks.length})</h2>

      <div ref={tasksRef} className="flex-1 overflow-y-auto space-y-2">
        {/* Show placeholder at the top of empty columns */}
        {isEmptyColumnPlaceholder && (
          <DropPlaceholder isActive={true} height={80} label={`Drop to add to ${title}`} />
        )}

        {/* Render tasks with placeholders */}
        {tasks.map((task, index) => {
          const placeholderIndex = getPlaceholderIndex();
          const showBeforePlaceholder = placeholderIndex === index &&
            dragDropManager.dropPlaceholderPosition?.position === 'before';
          const showAfterPlaceholder = placeholderIndex === index + 1 &&
            dragDropManager.dropPlaceholderPosition?.position === 'after';

          return (
            <React.Fragment key={task.id}>
              {showBeforePlaceholder && (
                <DropPlaceholder isActive={true} label={`Drop before ${task.title}`} />
              )}

              <TaskCard
                task={task}
                onDragStart={() => handleTaskDragStart(task.id)}
                onEdit={() => onTaskEdit(task)}
                data-task-id={task.id}
              />

              {showAfterPlaceholder && (
                <DropPlaceholder isActive={true} label={`Drop after ${task.title}`} />
              )}
            </React.Fragment>
          );
        })}

        {tasks.length === 0 && !isEmptyColumnPlaceholder && (
          <div className="text-gray-400 text-center p-4">No tasks</div>
        )}
      </div>
    </div>
  );
}
