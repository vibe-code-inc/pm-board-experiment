import React, { useState, useCallback } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { useDragAndDropManager } from '@/lib/drag_drop/drag_drop_manager';
import { TaskColumn } from './task_column';

interface ProjectBoardProps {
  project: {
    tasks: Task[];
    [key: string]: any;
  };
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskEdit: (task: Task) => void;
}

export function ProjectBoard({ project, onTaskUpdate, onTaskEdit }: ProjectBoardProps) {
  // Group tasks by status - ensure we have a valid array
  const tasks = project?.tasks || [];

  const tasksByStatus = tasks.reduce<Record<TaskStatus, Task[]>>((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  // Ensure all statuses have an array, even if empty
  const allStatuses: TaskStatus[] = ['todo', 'in_progress', 'done'];
  allStatuses.forEach(status => {
    if (!tasksByStatus[status]) {
      tasksByStatus[status] = [];
    }
  });

  // Use our drag and drop manager hook to handle drag and drop operations
  const dragDropManager = useDragAndDropManager();

  // Handler for tasks being dropped into a column
  const handleTaskDrop = useCallback(
    (
      taskId: string,
      sourceStatus: TaskStatus,
      targetStatus: TaskStatus,
      targetTaskId: string | null,
      position: 'before' | 'after'
    ) => {
      // Don't do anything if nothing changed (dropped in same position)
      if (sourceStatus === targetStatus && !targetTaskId) {
        return;
      }

      // Update the task status if it changed
      if (sourceStatus !== targetStatus) {
        onTaskUpdate(taskId, { status: targetStatus });
      }

      // For now, we're not implementing actual reordering
      // In a real app, this would update task positions
    },
    [onTaskUpdate]
  );

  // Mapping statuses to their display names
  const statusDisplayNames: Record<TaskStatus, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 flex overflow-x-auto p-4 gap-4">
        {allStatuses.map(status => (
          <TaskColumn
            key={status}
            status={status}
            title={statusDisplayNames[status]}
            tasks={tasksByStatus[status]}
            dragDropManager={dragDropManager}
            onTaskDrop={(taskId, sourceStatus, targetTaskId, position) =>
              handleTaskDrop(taskId, sourceStatus, status, targetTaskId, position)
            }
            onTaskEdit={onTaskEdit}
          />
        ))}
      </div>
    </div>
  );
}
