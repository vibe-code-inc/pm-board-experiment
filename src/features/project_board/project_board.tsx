import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Task, Project } from '@/types';
import { TaskCard } from '@/ui/features/task_card/task_card';
import { Info, X } from 'lucide-react';

interface ProjectBoardProps {
  project: Project;
  onTaskUpdate: (taskId: string, status: Task['status']) => void;
  onTaskEdit: (task: Task) => void;
}

// Column definitions - defined outside component to prevent recreation
const columns: { title: string; status: Task['status'] }[] = [
  { title: 'To Do', status: 'todo' },
  { title: 'In Progress', status: 'in-progress' },
  { title: 'Done', status: 'done' },
];

export const ProjectBoard: React.FC<ProjectBoardProps> = ({ project, onTaskUpdate, onTaskEdit }) => {
  const [showMobileGuide, setShowMobileGuide] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [localProject, setLocalProject] = useState<Project>(project);
  const [dragInProgress, setDragInProgress] = useState(false);

  // Update local project when props change
  useEffect(() => {
    if (!dragInProgress) {
      setLocalProject(project);
    }
  }, [project, dragInProgress]);

  // Pre-compute task groups per column to minimize render calculations
  const columnTasks = useMemo(() => {
    const result: Record<Task['status'], Task[]> = {
      'todo': [],
      'in-progress': [],
      'done': []
    };

    localProject.tasks.forEach(task => {
      result[task.status].push(task);
    });

    return result;
  }, [localProject.tasks]);

  // Check if we're on mobile and if we should show the guide
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(isMobileView);

      // Show the guide if we're on mobile and the user hasn't dismissed it before
      if (isMobileView && !localStorage.getItem('dragDropGuideShown')) {
        setShowMobileGuide(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Dismiss the guide and remember the user's choice
  const dismissGuide = useCallback(() => {
    setShowMobileGuide(false);
    localStorage.setItem('dragDropGuideShown', 'true');
  }, []);

  // Standard drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    // Add highlight to the column
    if (e.currentTarget.classList.contains('drop-column')) {
      e.currentTarget.classList.add('drop-target-highlight');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Remove highlight when dragging out
    if (e.currentTarget.classList.contains('drop-column')) {
      e.currentTarget.classList.remove('drop-target-highlight');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');

    // Remove highlight
    if (e.currentTarget.classList.contains('drop-column')) {
      e.currentTarget.classList.remove('drop-target-highlight');
    }

    if (taskId) {
      onTaskUpdate(taskId, status);
    }
  }, [onTaskUpdate]);

  // Handle reordering of tasks within a column
  const handleReorder = useCallback((draggedTaskId: string, targetTaskId: string) => {
    // Signal drag start to prevent project updates during reordering
    setDragInProgress(true);

    // Create a copy of the project for local updates
    const updatedProject = { ...localProject };
    const allTasks = [...updatedProject.tasks];

    // Find the tasks
    const draggedTaskIndex = allTasks.findIndex(task => task.id === draggedTaskId);
    const targetTaskIndex = allTasks.findIndex(task => task.id === targetTaskId);

    if (draggedTaskIndex === -1 || targetTaskIndex === -1) {
      setDragInProgress(false);
      return;
    }

    // Get the dragged task
    const draggedTask = allTasks[draggedTaskIndex];

    // Get positional info to determine if we need to insert before or after the target
    const draggedElement = document.querySelector(`[data-task-id="${draggedTaskId}"]`);
    const targetElement = document.querySelector(`[data-task-id="${targetTaskId}"]`);

    if (!draggedElement || !targetElement) {
      setDragInProgress(false);
      return;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const draggedRect = draggedElement.getBoundingClientRect();

    // Get the center point of each element
    const draggedCenter = draggedRect.top + draggedRect.height / 2;
    const targetCenter = targetRect.top + targetRect.height / 2;

    // Remove the dragged task
    allTasks.splice(draggedTaskIndex, 1);

    // Calculate the new position for insertion
    let insertPosition = targetTaskIndex;
    if (draggedTaskIndex < targetTaskIndex) {
      // If dragging from above to below, adjust the insert position
      insertPosition--;
    }

    // If dragging from below to above, we want to insert before the target
    // If dragging from above to below, we want to insert after the target
    if (draggedCenter < targetCenter) {
      // Insert before the target
      insertPosition = targetTaskIndex > draggedTaskIndex ? targetTaskIndex - 1 : targetTaskIndex;
    } else {
      // Insert after the target
      insertPosition = targetTaskIndex < draggedTaskIndex ? targetTaskIndex + 1 : targetTaskIndex;
    }

    // Insert the dragged task at the new position
    allTasks.splice(insertPosition, 0, draggedTask);

    // Batch state update to reduce re-renders
    window.requestAnimationFrame(() => {
      // Update the local project state
      updatedProject.tasks = allTasks;
      setLocalProject(updatedProject);

      // Allow project updates again after a short delay to avoid flicker
      setTimeout(() => {
        setDragInProgress(false);
      }, 50);

      // Notify the parent component about the reordering
      if (typeof window !== 'undefined') {
        // Create a custom event to notify the parent
        const reorderEvent = new CustomEvent('taskReorder', {
          detail: {
            projectId: updatedProject.id,
            tasks: updatedProject.tasks
          }
        });
        document.dispatchEvent(reorderEvent);
      }
    });
  }, [localProject]);

  // Add a polyfill for elementsFromPoint if it doesn't exist (older browsers)
  useEffect(() => {
    if (!document.elementsFromPoint) {
      document.elementsFromPoint = function(x, y) {
        const elements: Element[] = [];
        const element = document.elementFromPoint(x, y);

        if (element) {
          elements.push(element);

          // Temporarily hide this element so we can find what's underneath
          const htmlElement = element as HTMLElement;
          const originalVisibility = htmlElement.style.visibility;
          htmlElement.style.visibility = 'hidden';

          // Recursively get elements underneath
          const elementsUnder = document.elementsFromPoint(x, y);

          // Restore visibility
          htmlElement.style.visibility = originalVisibility;

          if (elementsUnder) {
            elements.push(...elementsUnder);
          }
        }

        return elements;
      };
    }
  }, []);

  return (
    <div className="p-4 md:p-6">
      {/* Mobile drag and drop guide */}
      {showMobileGuide && isMobile && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4 relative">
          <button
            className="absolute top-2 right-2 text-blue-500"
            onClick={dismissGuide}
            aria-label="Close guide"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 text-sm">Touch Dragging Enabled</h3>
              <p className="text-xs text-blue-700 mt-1">
                Use the grip handle on the left side of each task to drag and drop tasks between columns or rearrange tasks within a column.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{localProject.name}</h1>
        <p className="text-sm md:text-base text-gray-600">{localProject.description}</p>
      </div>

      {/* Responsive grid - stack on mobile, side by side on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {columns.map((column) => {
          // Get tasks for this column from pre-computed object
          const tasks = columnTasks[column.status];
          const hasNoTasks = tasks.length === 0;

          return (
            <div
              key={column.status}
              className={`bg-gray-50 rounded-lg p-3 md:p-4 shadow-sm drop-column ${hasNoTasks ? 'empty-column' : ''}`}
              data-status={column.status}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <h2 className="font-semibold text-gray-700 mb-3 md:mb-4 text-center md:text-left">
                {column.title}
              </h2>
              <div className={`space-y-3 task-list min-h-[150px] md:min-h-[200px] ${hasNoTasks ? 'flex items-center justify-center' : ''}`}>
                {hasNoTasks ? (
                  <div className="text-gray-400 text-sm text-center border-2 border-dashed border-gray-200 rounded-lg p-4 w-full empty-column-message">
                    Drag tasks here
                  </div>
                ) : (
                  tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={(status) => onTaskUpdate(task.id, status)}
                      onEdit={() => onTaskEdit(task)}
                      columnTasks={tasks}
                      onReorder={handleReorder}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
