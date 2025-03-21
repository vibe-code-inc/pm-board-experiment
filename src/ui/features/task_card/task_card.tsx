import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Edit2 } from 'lucide-react';
import { Task } from '@/types';
import { TaskModal } from '@/ui/features/task_modal/task_modal';
import { PriorityBadge } from './components/priority_badge';
import { DueDate } from './components/due_date';
import { DragHandle } from './components/drag_handle';
import { statusColors, getTaskCardStyle } from './task_card_styles';
import { useAutoScroll } from '@/lib/hooks/use_auto_scroll';
import { useMobileDetection } from '@/lib/hooks/use_mobile_detection';
import { useSafeArea } from '@/lib/hooks/use_safe_area';
import { stopScroll, throttle } from '@/lib/scroll_utils';

interface TaskCardProps {
  task: Task;
  onStatusChange: (status: Task['status']) => void;
  onEdit: (task: Task) => void;
  columnTasks?: Task[]; // Tasks in the current column for reordering
  onReorder?: (draggedTaskId: string, targetTaskId: string) => void; // Callback for reordering
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task: initialTask,
  onStatusChange,
  onEdit,
  columnTasks = [],
  onReorder,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(initialTask);
  const [isDragging, setIsDragging] = useState(false);
  const [touchActive, setTouchActive] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const lastHighlightedElements = useRef<Set<Element>>(new Set());
  const scrollAnimationRef = useRef<number | null>(null);
  const originalPositionRef = useRef<DOMRect | null>(null);

  // Custom hooks
  const isMobile = useMobileDetection();
  const safeArea = useSafeArea();
  const handleAutoScroll = useAutoScroll();

  // Update local task when initialTask changes
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  // Cleanup function to cancel any active scroll animation
  const cleanupScrollAnimation = useCallback(() => {
    if (scrollAnimationRef.current !== null) {
      window.cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
  }, []);

  // Component cleanup
  useEffect(() => {
    return () => {
      cleanupScrollAnimation();
      if (placeholderRef.current) {
        placeholderRef.current.remove();
        placeholderRef.current = null;
      }
    };
  }, [cleanupScrollAnimation]);

  // When dragging ends, make sure to stop any scrolling
  useEffect(() => {
    return () => {
      stopScroll();
    };
  }, []);

  // Create a placeholder element for both desktop and mobile
  const createPlaceholder = useCallback(() => {
    if (placeholderRef.current) {
      placeholderRef.current.remove();
    }

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const newPlaceholder = document.createElement('div');
    newPlaceholder.className = 'task-card-placeholder';
    newPlaceholder.style.height = `${rect.height}px`;
    newPlaceholder.style.width = `${rect.width}px`;
    newPlaceholder.style.margin = '8px 0';
    newPlaceholder.style.border = '2px dashed #9ca3af';
    newPlaceholder.style.borderRadius = '8px';
    newPlaceholder.style.backgroundColor = '#f3f4f6';
    newPlaceholder.style.boxSizing = 'border-box';
    newPlaceholder.style.transition = 'all 0.2s ease';

    placeholderRef.current = newPlaceholder;

    return newPlaceholder;
  }, []);

  // Clear all highlights efficiently
  const clearHighlights = useCallback(() => {
    lastHighlightedElements.current.forEach(el => {
      el.classList.remove('drop-target-highlight', 'insert-above', 'insert-below');
    });
    lastHighlightedElements.current.clear();
  }, []);

  // Handle placeholder positioning for both desktop and mobile
  const positionPlaceholder = useCallback((x: number, y: number) => {
    if (!placeholderRef.current) return;

    const elementsAtPoint = document.elementsFromPoint(x, y);

    // Find drop column and target task card
    const dropColumn = elementsAtPoint.find(el =>
      el.classList.contains('drop-column')
    ) as HTMLElement;

    const targetTaskCard = elementsAtPoint.find(el =>
      el.classList.contains('task-card') &&
      el !== cardRef.current &&
      !el.contains(cardRef.current) &&
      !cardRef.current?.contains(el)
    ) as HTMLElement;

    // Clear previous highlights
    clearHighlights();

    // If we've moved out of the original column, hide the placeholder
    if (placeholderRef.current && !placeholderRef.current.parentNode?.contains(dropColumn)) {
      placeholderRef.current.style.display = 'none';
    }

    // Handle drop column highlight and placeholder positioning
    if (dropColumn) {
      dropColumn.classList.add('drop-target-highlight');
      lastHighlightedElements.current.add(dropColumn);

      if (placeholderRef.current) {
        // Get the task list container in the column
        const taskList = dropColumn.querySelector('.task-list');
        if (!taskList) return;

        // Check if this is an empty column
        const emptyColumnMessage = taskList.querySelector('.empty-column-message');
        if (emptyColumnMessage) {
          // Hide the "drag tasks here" message
          emptyColumnMessage.classList.add('hidden');
          lastHighlightedElements.current.add(emptyColumnMessage);

          // Ensure task list is no longer centered
          taskList.classList.remove('flex', 'items-center', 'justify-center');
          lastHighlightedElements.current.add(taskList);

          // Add placeholder directly to task list
          placeholderRef.current.style.display = 'block';
          taskList.appendChild(placeholderRef.current);
          return;
        }

        // Get all task cards in this column (excluding the dragged card)
        const columnTaskCards = Array.from(taskList.querySelectorAll('.task-card:not(.dragging):not(.touch-dragging)')) as HTMLElement[];

        // If there are no task cards in this column, add placeholder
        if (columnTaskCards.length === 0) {
          placeholderRef.current.style.display = 'block';
          taskList.appendChild(placeholderRef.current);
          return;
        }

        // Find the closest task card based on vertical position
        let closestCard: HTMLElement | null = null;
        let closestDistance = Infinity;
        let insertBefore = true;

        // Find card closest to touch/mouse point
        for (const taskCard of columnTaskCards) {
          const rect = taskCard.getBoundingClientRect();
          const cardMiddleY = rect.top + rect.height / 2;
          const distance = Math.abs(y - cardMiddleY);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestCard = taskCard;
            // If point is above middle point, insert before; otherwise, insert after
            insertBefore = y < cardMiddleY;
          }
        }

        if (closestCard && closestCard.parentNode) {
          placeholderRef.current.style.display = 'block';

          // Store the task ID in the placeholder's dataset
          placeholderRef.current.dataset.targetTaskId = closestCard.dataset.taskId;
          placeholderRef.current.dataset.insertBefore = insertBefore.toString();

          // Insert the placeholder at the appropriate position
          if (insertBefore) {
            closestCard.parentNode.insertBefore(placeholderRef.current, closestCard);
            lastHighlightedElements.current.add(closestCard);
          } else {
            closestCard.parentNode.insertBefore(placeholderRef.current, closestCard.nextSibling);
            lastHighlightedElements.current.add(closestCard);
          }
        }
      }
    } else if (targetTaskCard && onReorder) {
      // If we're over a specific task card
      lastHighlightedElements.current.add(targetTaskCard);

      // Determine if we're in the top or bottom half of the target card
      const rect = targetTaskCard.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const insertBefore = y < midY;

      if (placeholderRef.current) {
        placeholderRef.current.style.display = 'block';

        // Store the task ID in the placeholder's dataset
        placeholderRef.current.dataset.targetTaskId = targetTaskCard.dataset.taskId;
        placeholderRef.current.dataset.insertBefore = insertBefore.toString();

        // Only move placeholder if it's not already in the right position
        const isAboveAndShouldBeAbove = insertBefore &&
          placeholderRef.current.nextSibling === targetTaskCard;
        const isBelowAndShouldBeBelow = !insertBefore &&
          placeholderRef.current.previousSibling === targetTaskCard;

        // Only reposition if needed - reduces DOM operations
        if (!isAboveAndShouldBeAbove && !isBelowAndShouldBeBelow) {
          if (insertBefore) {
            targetTaskCard.parentNode?.insertBefore(placeholderRef.current, targetTaskCard);
          } else {
            targetTaskCard.parentNode?.insertBefore(placeholderRef.current, targetTaskCard.nextSibling);
          }
        }
      }
    }
  }, [clearHighlights]);

  // For mouse movement during drag
  const handleDragStart = (e: React.DragEvent) => {
    const card = cardRef.current;
    if (!card) return;

    e.dataTransfer.setData('taskId', task.id);
    setIsDragging(true);

    // Record initial position for reference
    const rect = card.getBoundingClientRect();
    originalPositionRef.current = rect;
    card.dataset.originalLeft = rect.left.toString();
    card.dataset.originalTop = rect.top.toString();
    card.dataset.originalWidth = rect.width.toString();
    card.dataset.originalHeight = rect.height.toString();

    // Create a placeholder for desktop dragging
    const placeholder = createPlaceholder();
    if (placeholder && card.parentNode) {
      card.parentNode.insertBefore(placeholder, card.nextSibling);
    }

    // Create a custom drag image for better control
    try {
      // Clone the card for the drag image
      const dragImage = card.cloneNode(true) as HTMLElement;
      dragImage.style.width = `${rect.width}px`;
      dragImage.style.transform = 'translate3d(0,0,0)';
      dragImage.style.opacity = '0.8';
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px'; // Position offscreen
      dragImage.style.left = '-1000px';
      document.body.appendChild(dragImage);

      // Set the drag image with proper offset
      e.dataTransfer.setDragImage(dragImage, e.clientX - rect.left, e.clientY - rect.top);

      // Remove the element after drag starts
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 100);
    } catch (err) {
      // Fallback if custom drag image fails
      if (e.dataTransfer.setDragImage) {
        e.dataTransfer.setDragImage(card, 10, 10);
      }
    }

    // Add feedback classes
    card.classList.add('dragging');
    card.setAttribute('aria-grabbed', 'true');

    // Start mouse movement tracking
    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleAutoScroll(moveEvent.clientX, moveEvent.clientY);
      positionPlaceholder(moveEvent.clientX, moveEvent.clientY);
    };

    // Add mouse move listener
    document.addEventListener('mousemove', handleMouseMove);

    // Clean up on drag end
    window.addEventListener('dragend', function cleanupDrag() {
      document.removeEventListener('mousemove', handleMouseMove);
      stopScroll();
      window.removeEventListener('dragend', cleanupDrag);
    }, { once: true });
  };

  // Handle drag over events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Update placeholder position
    positionPlaceholder(e.clientX, e.clientY);
  };

  // Add a custom drag enter handler for desktop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Add a custom drop handler for desktop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    // Prevent default browser behavior
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    // Get the dragged task ID
    const draggedTaskId = e.dataTransfer.getData('taskId');

    // Handle drop based on placeholder position
    if (placeholderRef.current && placeholderRef.current.parentNode) {
      const targetTaskId = placeholderRef.current.dataset.targetTaskId;
      const insertBefore = placeholderRef.current.dataset.insertBefore === 'true';

      if (targetTaskId) {
        // Call reorder with the correct target and position
        onReorder?.(draggedTaskId, targetTaskId);
      } else {
        // Check if we're dropping in a different column
        const dropColumn = Array.from(document.elementsFromPoint(e.clientX, e.clientY))
          .find(el => el.classList.contains('drop-column')) as HTMLElement;

        if (dropColumn && dropColumn.dataset.status) {
          const newStatus = dropColumn.dataset.status as Task['status'];
          if (newStatus !== task.status) {
            onStatusChange(newStatus);
          }
        }
      }
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    stopScroll();

    if (cardRef.current) {
      cardRef.current.setAttribute('aria-grabbed', 'false');
      cardRef.current.classList.remove('dragging');

      // Clean up any data attributes - fix null check
      const dataset = cardRef.current.dataset;
      if (dataset) {
        Object.keys(dataset).forEach(key => {
          if (key.startsWith('original')) {
            delete dataset[key];
          }
        });
      }
    }

    // Clean up placeholder and highlights
    clearHighlights();

    // Restore any hidden empty column messages
    document.querySelectorAll('.empty-column-message.hidden').forEach(el => {
      el.classList.remove('hidden');
    });

    // Restore flex layouts for empty columns
    document.querySelectorAll('.task-list').forEach(taskList => {
      if (taskList.childElementCount === 0 ||
          (taskList.childElementCount === 1 && taskList.children[0].classList.contains('empty-column-message'))) {
        taskList.classList.add('flex', 'items-center', 'justify-center');
      }
    });

    // Remove the placeholder
    if (placeholderRef.current) {
      placeholderRef.current.remove();
      placeholderRef.current = null;
    }
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only handle touch on the drag handle for mobile
    if (!dragHandleRef.current?.contains(e.target as Node)) {
      return;
    }

    // Store original position for calculation
    if (cardRef.current) {
      const card = cardRef.current;
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      // Store precise positioning data with scroll offsets included
      card.dataset.touchStartX = touch.clientX.toString();
      card.dataset.touchStartY = touch.clientY.toString();
      card.dataset.originalLeft = rect.left.toString();
      card.dataset.originalTop = rect.top.toString();
      card.dataset.originalWidth = rect.width.toString();
      card.dataset.originalHeight = rect.height.toString();
      card.dataset.scrollY = scrollY.toString();
      card.dataset.scrollX = scrollX.toString();

      // Activate touch tracking
      setTouchActive(true);

      // Add feedback class for visual styles
      card.classList.add('touch-dragging');
      document.body.classList.add('touch-dragging-active');

      // Create a placeholder that matches the exact size of the dragged card
      const placeholder = createPlaceholder();
      if (placeholder && card.parentNode) {
        card.parentNode.insertBefore(placeholder, card.nextSibling);
      }
    }
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchActive && cardRef.current) {
      // Note: We can't use preventDefault here due to passive event listeners
      // Instead, we rely on touchAction: none in the style

      // Get touch position and start scrolling
      const touch = e.touches[0];
      handleAutoScroll(touch.clientX, touch.clientY);

      // Also call throttled handler for other operations
      handleTouchMoveThrottled(e);
    }
  };

  // Create a throttled version of the touch move handler
  const handleTouchMoveThrottled = useCallback(
    throttle((e: React.TouchEvent) => {
      // If touch tracking isn't active, don't do anything
      if (!touchActive || !cardRef.current) {
        return;
      }

      // We can't use preventDefault here due to passive event listeners
      // We rely on touchAction: none in the style

      if (!isDragging) {
        setIsDragging(true);
      }

      // Get the card element and touch data
      const card = cardRef.current;
      const touch = e.touches[0];

      // Calculate movement - only need this for card positioning
      const startX = parseInt(card.dataset.touchStartX || '0');
      const startY = parseInt(card.dataset.touchStartY || '0');
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // Position the card using transform for better performance
      if (!card.style.position || card.style.position !== 'fixed') {
        const originalLeft = parseFloat(card.dataset.originalLeft || '0');
        const originalTop = parseFloat(card.dataset.originalTop || '0');
        const originalWidth = parseFloat(card.dataset.originalWidth || '0');

        // Position the card exactly where it was without any offset
        card.style.transition = 'none';
        card.style.position = 'fixed'; // Use fixed instead of absolute for precise positioning
        card.style.zIndex = '100';
        card.style.width = `${originalWidth}px`;
        card.style.left = `${originalLeft}px`;
        card.style.top = `${originalTop}px`;
        card.style.margin = '0';
        card.style.transform = 'translate3d(0,0,0)';

        // Force browser to apply the styles before adding the transform
        card.offsetHeight; // Trigger a reflow

        // Apply the transform on the next frame to avoid flickering
        requestAnimationFrame(() => {
          if (card && touchActive) {
            card.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
            card.style.opacity = '0.8';
          }
        });
        return; // Skip the rest of this cycle
      }

      // Use CSS transform for better performance
      card.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      card.style.opacity = '0.8';

      // Position the placeholder
      positionPlaceholder(touch.clientX, touch.clientY);
    }, 16),
    [touchActive, isDragging, positionPlaceholder]
  );

  useEffect(() => {
    // Set up touch event handlers with proper passive option when component mounts
    const card = cardRef.current;
    if (card) {
      // Add non-passive event listeners directly
      const touchMoveHandler = (e: TouchEvent) => {
        if (touchActive) {
          e.preventDefault(); // This works when added via addEventListener with passive: false

          // Get the touch position
          const touch = e.touches[0];

          // Call the auto-scroll function
          handleAutoScroll(touch.clientX, touch.clientY);

          // Also call the throttled handler to handle dragging functionality
          // We need to convert the native event to a React event for the throttled handler
          // This is a simplified way to do it - just pass enough for our needs
          const syntheticEvent = {
            touches: e.touches,
            preventDefault: () => e.preventDefault(),
          } as unknown as React.TouchEvent;

          handleTouchMoveThrottled(syntheticEvent);
        }
      };

      // Add with passive: false option
      card.addEventListener('touchmove', touchMoveHandler, { passive: false });

      // Clean up when component unmounts
      return () => {
        card.removeEventListener('touchmove', touchMoveHandler);
      };
    }
  }, [touchActive, handleAutoScroll, handleTouchMoveThrottled]);

  // Handle touch end
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchActive) return;

    setTouchActive(false);

    // Stop any auto-scrolling
    stopScroll();

    if (cardRef.current) {
      const card = cardRef.current;
      setIsDragging(false);

      // Setup a smooth transition for going back to normal
      card.style.transition = 'transform 0.1s ease-out, opacity 0.1s ease-out';
      card.style.transform = 'translate3d(0,0,0)';
      card.style.opacity = '1';

      // Wait for the transition to complete before resetting all styles
      setTimeout(() => {
        // Reset all styles completely
        card.style.cssText = ''; // Reset all inline styles at once
        card.classList.remove('touch-dragging');
        document.body.classList.remove('touch-dragging-active');
      }, 100);

      // Execute the correct action based on placeholder position
      if (placeholderRef.current && placeholderRef.current.parentNode) {
        const targetTaskId = placeholderRef.current.dataset.targetTaskId;
        const insertBefore = placeholderRef.current.dataset.insertBefore === 'true';

        if (targetTaskId) {
          // Call reorder with the correct target ID
          onReorder?.(task.id, targetTaskId);
        } else {
          // Check if we're dropping in a different column
          const touch = e.changedTouches[0];
          const dropColumn = Array.from(document.elementsFromPoint(touch.clientX, touch.clientY))
            .find(el => el.classList.contains('drop-column')) as HTMLElement;

          if (dropColumn && dropColumn.dataset.status) {
            const newStatus = dropColumn.dataset.status as Task['status'];
            if (newStatus !== task.status) {
              onStatusChange(newStatus);
            }
          }
        }
      }

      // Clear all highlights
      clearHighlights();

      // Restore any hidden empty column messages
      document.querySelectorAll('.empty-column-message.hidden').forEach(el => {
        el.classList.remove('hidden');
      });

      // Restore flex layouts for empty columns
      document.querySelectorAll('.task-list').forEach(taskList => {
        if (taskList.childElementCount === 0 ||
            (taskList.childElementCount === 1 && taskList.children[0].classList.contains('empty-column-message'))) {
          taskList.classList.add('flex', 'items-center', 'justify-center');
        }
      });

      // Remove the placeholder
      if (placeholderRef.current) {
        placeholderRef.current.remove();
        placeholderRef.current = null;
      }

      // Clean up data attributes
      Object.keys(card.dataset).forEach(key => {
        if (key.startsWith('touch') || key.startsWith('original') || key.startsWith('scroll')) {
          delete card.dataset[key];
        }
      });
    }
  };

  // Handle touch cancel
  const handleTouchCancel = (e: React.TouchEvent) => {
    // Stop any auto-scrolling
    stopScroll();
    handleTouchEnd(e);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTask(updatedTask);
  };

  const handleSave = (updatedTask: Task) => {
    setTask(updatedTask);
    onEdit(updatedTask);
    setIsEditing(false);
  };

  return (
    <>
      <div
        ref={cardRef}
        className={getTaskCardStyle(task.status, isDragging)}
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        aria-grabbed="false"
        data-task-id={task.id}
        style={{ touchAction: 'none' }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
          <div className="flex items-start gap-2">
            {isMobile && (
              <DragHandle innerRef={dragHandleRef} />
            )}
            <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2">{task.title}</h3>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsEditing(true)}
              className="opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(e.target.value as Task['status'])}
              className="text-xs sm:text-sm rounded border-gray-300 focus:ring-2 focus:ring-blue-500 py-0.5"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 md:line-clamp-3">
          {task.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <PriorityBadge priority={task.priority} />
          {task.dueDate && <DueDate date={task.dueDate} />}
          {task.assignee && (
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded truncate max-w-[120px]">
              {task.assignee}
            </span>
          )}
        </div>
      </div>

      {isEditing && (
        <TaskModal
          task={task}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          onChange={handleTaskUpdate}
        />
      )}
    </>
  );
};
