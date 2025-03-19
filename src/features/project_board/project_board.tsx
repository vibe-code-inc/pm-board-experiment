import React, { useEffect, useState } from 'react';
import { Task, Project } from '@/types';
import { TaskCard } from '@/ui/features/task_card/task_card';
import { Info, X } from 'lucide-react';

interface ProjectBoardProps {
  project: Project;
  onTaskUpdate: (taskId: string, status: Task['status']) => void;
  onTaskEdit: (task: Task) => void;
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({ project, onTaskUpdate, onTaskEdit }) => {
  const [showMobileGuide, setShowMobileGuide] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const columns: { title: string; status: Task['status'] }[] = [
    { title: 'To Do', status: 'todo' },
    { title: 'In Progress', status: 'in-progress' },
    { title: 'Done', status: 'done' },
  ];

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
  const dismissGuide = () => {
    setShowMobileGuide(false);
    localStorage.setItem('dragDropGuideShown', 'true');
  };

  // Standard drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');

    if (taskId) {
      onTaskUpdate(taskId, status);
    }
  };

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
                Use the grip handle on the left side of each task to drag and drop tasks between columns.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{project.name}</h1>
        <p className="text-sm md:text-base text-gray-600">{project.description}</p>
      </div>

      {/* Responsive grid - stack on mobile, side by side on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {columns.map((column) => (
          <div
            key={column.status}
            className="bg-gray-50 rounded-lg p-3 md:p-4 shadow-sm drop-column"
            data-status={column.status}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            <h2 className="font-semibold text-gray-700 mb-3 md:mb-4 text-center md:text-left">
              {column.title}
            </h2>
            <div className="space-y-3 min-h-[150px] md:min-h-[200px]">
              {project.tasks
                .filter((task) => task.status === column.status)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={(status) => onTaskUpdate(task.id, status)}
                    onEdit={() => onTaskEdit(task)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
