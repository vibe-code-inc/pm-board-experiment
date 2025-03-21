import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Clock, Flag, Edit2, GripVertical } from 'lucide-react';
import { Task } from '@/types';
import { TaskModal } from '@/ui/features/task_modal/task_modal';

interface TaskCardProps {
  task: Task;
  onStatusChange: (status: Task['status']) => void;
  onEdit: (task: Task) => void;
  columnTasks?: Task[]; // Tasks in the current column for reordering
  onReorder?: (draggedTaskId: string, targetTaskId: string) => void; // Callback for reordering
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusColors = {
  'todo': 'bg-gray-100',
  'in-progress': 'bg-purple-100',
  'done': 'bg-green-100',
};

// Throttle function to limit frequency of function calls
const throttle = (func: Function, delay: number) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    func(...args);
  };
};

// Outside of component, add scroll utility functions
const EDGE_ZONE_PERCENT = 0.25; // Edge detection zone - increased to 25% of screen dimensions
const EXPONENTIAL_POWER = 3; // Higher power means more aggressive exponential curve

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
  const [isMobile, setIsMobile] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const lastHighlightedElements = useRef<Set<Element>>(new Set());
  const scrollAnimationRef = useRef<number | null>(null);
  const safeAreaRef = useRef({ top: 0, right: 0, bottom: 0, left: 0 });

  // Add time tracking refs at component level
  const scrollTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // Update local task when initialTask changes
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  // Detect safe areas for notches and home indicators
  useEffect(() => {
    // Try to detect safe areas using CSS environment variables
    const detectSafeAreas = () => {
      // Check if environment variables are supported
      const style = window.getComputedStyle(document.documentElement);

      try {
        // Use CSS environment variables for safe areas if available
        const safeTop = parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0');
        const safeRight = parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0');
        const safeBottom = parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0');
        const safeLeft = parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0');

        safeAreaRef.current = {
          top: safeTop,
          right: safeRight,
          bottom: safeBottom,
          left: safeLeft
        };
      } catch (e) {
        // Fallback to sensible defaults if environment variables aren't supported
        safeAreaRef.current = {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        };
      }
    };

    detectSafeAreas();

    // Listen for orientationchange events to recalculate safe areas
    window.addEventListener('orientationchange', detectSafeAreas);

    return () => {
      window.removeEventListener('orientationchange', detectSafeAreas);
    };
  }, []);

  // Detect if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (placeholderRef.current) {
        placeholderRef.current.remove();
        placeholderRef.current = null;
      }
    };
  }, []);

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

  // Auto-scroll function with extreme speed
  const handleAutoScroll = useCallback((touchX: number, touchY: number) => {
    // Get current dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate edge zones - 10% of screen
    const edgeSize = Math.min(windowWidth, windowHeight) * EDGE_ZONE_PERCENT;

    // EXTREMELY high scroll speed: 500% of screen per second
    const maxSpeedPerSecondX = windowWidth * 5.0;
    const maxSpeedPerSecondY = windowHeight * 5.0;

    // Create direct scrolling function with time-based calculation
    const performScroll = (timestamp: number) => {
      // Initialize time tracking on first frame
      if (scrollTimeRef.current === 0) {
        scrollTimeRef.current = timestamp;
        lastFrameTimeRef.current = timestamp;
        scrollAnimationRef.current = window.requestAnimationFrame(performScroll);
        return;
      }

      // Calculate elapsed time since last frame in seconds
      const deltaTime = (timestamp - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = timestamp;

      // Calculate scroll with extreme exponential scaling
      let scrollX = 0;
      let scrollY = 0;

      // EXPONENTIAL horizontal scroll calculation
      if (touchX <= edgeSize) {
        // LEFT edge - exponential speed increase closer to edge
        // Calculate how close we are to the edge (0 = at edge, 1 = at edge boundary)
        const proximityToEdge = 1 - (touchX / edgeSize);
        // Apply exponential power for extreme acceleration near edges
        const expFactor = Math.pow(proximityToEdge, EXPONENTIAL_POWER);
        // Apply extreme scaling
        scrollX = -maxSpeedPerSecondX * deltaTime * expFactor * 10;
      } else if (touchX >= windowWidth - edgeSize) {
        // RIGHT edge - exponential speed increase closer to edge
        const proximityToEdge = 1 - ((windowWidth - touchX) / edgeSize);
        const expFactor = Math.pow(proximityToEdge, EXPONENTIAL_POWER);
        scrollX = maxSpeedPerSecondX * deltaTime * expFactor * 10;
      }

      // EXPONENTIAL vertical scroll calculation
      if (touchY <= edgeSize) {
        // TOP edge - exponential speed increase closer to edge
        const proximityToEdge = 1 - (touchY / edgeSize);
        const expFactor = Math.pow(proximityToEdge, EXPONENTIAL_POWER);
        scrollY = -maxSpeedPerSecondY * deltaTime * expFactor * 10;
      } else if (touchY >= windowHeight - edgeSize) {
        // BOTTOM edge - exponential speed increase closer to edge
        const proximityToEdge = 1 - ((windowHeight - touchY) / edgeSize);
        const expFactor = Math.pow(proximityToEdge, EXPONENTIAL_POWER);
        scrollY = maxSpeedPerSecondY * deltaTime * expFactor * 10;
      }

      // Extreme speed outside viewport (10x normal speed)
      if (touchX < 0) {
        const outsideFactor = Math.min(10, 1 + Math.abs(touchX / 100));
        scrollX = -maxSpeedPerSecondX * deltaTime * outsideFactor * 10;
      } else if (touchX > windowWidth) {
        const outsideFactor = Math.min(10, 1 + Math.abs((touchX - windowWidth) / 100));
        scrollX = maxSpeedPerSecondX * deltaTime * outsideFactor * 10;
      }

      if (touchY < 0) {
        const outsideFactor = Math.min(10, 1 + Math.abs(touchY / 100));
        scrollY = -maxSpeedPerSecondY * deltaTime * outsideFactor * 10;
      } else if (touchY > windowHeight) {
        const outsideFactor = Math.min(10, 1 + Math.abs((touchY - windowHeight) / 100));
        scrollY = maxSpeedPerSecondY * deltaTime * outsideFactor * 10;
      }

      // Apply scroll if needed
      if (scrollX !== 0 || scrollY !== 0) {
        // Apply with integer values for better performance
        window.scrollBy(Math.round(scrollX), Math.round(scrollY));
      } else {
        // No scrolling needed, cancel animation
        cleanupScrollAnimation();
        scrollTimeRef.current = 0;
        return;
      }

      // Continue animation loop
      scrollAnimationRef.current = window.requestAnimationFrame(performScroll);
    };

    // Check if we're at or beyond any edge and start scrolling immediately
    const isAtLeftEdge = touchX <= edgeSize;
    const isAtRightEdge = touchX >= windowWidth - edgeSize;
    const isAtTopEdge = touchY <= edgeSize;
    const isAtBottomEdge = touchY >= windowHeight - edgeSize;
    const isOutsideX = touchX < 0 || touchX > windowWidth;
    const isOutsideY = touchY < 0 || touchY > windowHeight;

    // Start scrolling if at ANY edge or outside viewport
    if (isAtLeftEdge || isAtRightEdge || isAtTopEdge || isAtBottomEdge || isOutsideX || isOutsideY) {
      // Cancel any existing animation
      cleanupScrollAnimation();

      // Reset time tracking
      scrollTimeRef.current = 0;
      lastFrameTimeRef.current = 0;

      // Apply MASSIVE initial scroll for immediate feedback
      const initialDeltaTime = 1/30; // Assume 30fps for initial jump

      if (isAtLeftEdge || touchX < 0) {
        const proximityToEdge = isAtLeftEdge ? 1 - (touchX / edgeSize) : 1;
        const expFactor = Math.pow(proximityToEdge, EXPONENTIAL_POWER);
        window.scrollBy(Math.round(-maxSpeedPerSecondX * initialDeltaTime * expFactor * 30), 0);
      } else if (isAtRightEdge || touchX > windowWidth) {
        const proximityToEdge = isAtRightEdge ? 1 - ((windowWidth - touchX) / edgeSize) : 1;
        const expFactor = Math.pow(proximityToEdge, EXPONENTIAL_POWER);
        window.scrollBy(Math.round(maxSpeedPerSecondX * initialDeltaTime * expFactor * 30), 0);
      }

      if (isAtTopEdge || touchY < 0) {
        const proximityToEdge = isAtTopEdge ? 1 - (touchY / edgeSize) : 1;
        const expFactor = Math.pow(proximityToEdge, EXPONENTIAL_POWER);
        window.scrollBy(0, Math.round(-maxSpeedPerSecondY * initialDeltaTime * expFactor * 30));
      } else if (isAtBottomEdge || touchY > windowHeight) {
        const proximityToEdge = isAtBottomEdge ? 1 - ((windowHeight - touchY) / edgeSize) : 1;
        const expFactor = Math.pow(proximityToEdge, EXPONENTIAL_POWER);
        window.scrollBy(0, Math.round(maxSpeedPerSecondY * initialDeltaTime * expFactor * 30));
      }

      // Then start the animation for continuous scrolling
      scrollAnimationRef.current = window.requestAnimationFrame(performScroll);
    } else {
      // Not at edges, stop any existing animation
      cleanupScrollAnimation();
      scrollTimeRef.current = 0;
    }
  }, [cleanupScrollAnimation]);

  // For traditional drag events
  const handleDragStart = (e: React.DragEvent) => {
    const card = cardRef.current;
    if (!card) return;

    e.dataTransfer.setData('taskId', task.id);
    setIsDragging(true);

    // Record initial position for reference
    const rect = card.getBoundingClientRect();
    card.dataset.originalLeft = rect.left.toString();
    card.dataset.originalTop = rect.top.toString();
    card.dataset.originalWidth = rect.width.toString();
    card.dataset.originalHeight = rect.height.toString();

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

    // Create a function that handles auto-scrolling during mouse move
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Trigger auto-scroll immediately on every mouse move
      handleAutoScroll(moveEvent.clientX, moveEvent.clientY);
    };

    // More aggressive scroll checking using interval for desktop dragging
    // This ensures scrolling continues even when the mouse isn't moving
    let lastKnownX = e.clientX;
    let lastKnownY = e.clientY;

    // Create interval to continuously check mouse position and scroll
    const scrollInterval = setInterval(() => {
      if (lastKnownX <= 0 || lastKnownX >= window.innerWidth ||
          lastKnownY <= 0 || lastKnownY >= window.innerHeight ||
          lastKnownX <= window.innerWidth * EDGE_ZONE_PERCENT ||
          lastKnownX >= window.innerWidth * (1 - EDGE_ZONE_PERCENT) ||
          lastKnownY <= window.innerHeight * EDGE_ZONE_PERCENT ||
          lastKnownY >= window.innerHeight * (1 - EDGE_ZONE_PERCENT)) {
        handleAutoScroll(lastKnownX, lastKnownY);
      }
    }, 8); // Check more frequently (reduced from 16ms to 8ms)

    // Update last known position on mouse move
    const trackMousePosition = (moveEvent: MouseEvent) => {
      lastKnownX = moveEvent.clientX;
      lastKnownY = moveEvent.clientY;
    };

    // Add and remove listeners for mouse movement during drag
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousemove', trackMousePosition);

    // Set cleanup function for when drag ends
    window.addEventListener('dragend', function cleanupDrag() {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', trackMousePosition);
      clearInterval(scrollInterval);
      cleanupScrollAnimation();
      window.removeEventListener('dragend', cleanupDrag);
    }, { once: true });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Stop any auto-scrolling
    cleanupScrollAnimation();

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
  };

  // Clear all highlights efficiently
  const clearHighlights = useCallback(() => {
    lastHighlightedElements.current.forEach(el => {
      el.classList.remove('drop-target-highlight', 'insert-above', 'insert-below');
    });
    lastHighlightedElements.current.clear();
  }, []);

  // For touch events
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
      if (!placeholderRef.current && cardRef.current) {
        const newPlaceholder = document.createElement('div');
        newPlaceholder.className = 'task-card-placeholder';

        // Set exact dimensions to match the card
        newPlaceholder.style.height = `${rect.height}px`;
        newPlaceholder.style.width = `${rect.width}px`;
        newPlaceholder.style.boxSizing = 'border-box';
        newPlaceholder.style.display = 'none';

        // Insert it right after the current card to preserve list structure initially
        if (card.parentNode) {
          card.parentNode.insertBefore(newPlaceholder, card.nextSibling);
          placeholderRef.current = newPlaceholder;
        }
      }
    }
  };

  // Create a throttled version of the touch move handler
  const handleTouchMoveThrottled = useCallback(
    throttle((e: React.TouchEvent) => {
      // If touch tracking isn't active, don't do anything
      if (!touchActive || !cardRef.current) {
        return;
      }

      // Prevent scrolling while dragging
      e.preventDefault();

      if (!isDragging) {
        setIsDragging(true);
      }

      // Get the card element and touch data
      const card = cardRef.current;
      const touch = e.touches[0];

      // Always try to scroll if we're near an edge
      const x = touch.clientX;
      const y = touch.clientY;
      const edgePercent = EDGE_ZONE_PERCENT;

      // Check if we're near an edge and should trigger scrolling
      if (x <= 0 || x >= window.innerWidth ||
          y <= 0 || y >= window.innerHeight ||
          x <= window.innerWidth * edgePercent ||
          x >= window.innerWidth * (1 - edgePercent) ||
          y <= window.innerHeight * edgePercent ||
          y >= window.innerHeight * (1 - edgePercent)) {
        handleAutoScroll(x, y);
      }

      // Calculate movement
      const startX = parseInt(card.dataset.touchStartX || '0');
      const startY = parseInt(card.dataset.touchStartY || '0');
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // If first move, setup proper initial positioning
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

      // Create highlight effect for potential drop targets
      const elementsAtTouch = document.elementsFromPoint(touch.clientX, touch.clientY);

      // Look for both columns and other tasks
      const dropColumn = elementsAtTouch.find(el =>
        el.classList.contains('drop-column')
      ) as HTMLElement;

      const targetTaskCard = elementsAtTouch.find(el =>
        el.classList.contains('task-card') &&
        el !== card &&
        !el.contains(card) &&
        !card.contains(el)
      ) as HTMLElement;

      // Clear previous highlights efficiently
      clearHighlights();

      // If we've moved out of the original column, hide the placeholder at its original position
      if (placeholderRef.current && !placeholderRef.current.parentNode?.contains(dropColumn)) {
        placeholderRef.current.style.display = 'none';
      }

      // Add highlight to the column we're over
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
            // Hide the "drag tasks here" message when dragging over empty column
            emptyColumnMessage.classList.add('hidden');
            lastHighlightedElements.current.add(emptyColumnMessage);

            // Ensure task list is no longer centered (remove flex)
            taskList.classList.remove('flex', 'items-center', 'justify-center');
            lastHighlightedElements.current.add(taskList);

            // Add placeholder directly to task list
            placeholderRef.current.style.display = 'block';
            taskList.appendChild(placeholderRef.current);
            return;
          }

          // Get all task cards in this column (excluding the dragged card)
          const columnTaskCards = Array.from(taskList.querySelectorAll('.task-card:not(.touch-dragging)')) as HTMLElement[];

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

          // Find card closest to touch point
          for (const taskCard of columnTaskCards) {
            const rect = taskCard.getBoundingClientRect();
            const cardMiddleY = rect.top + rect.height / 2;
            const distance = Math.abs(touch.clientY - cardMiddleY);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestCard = taskCard;
              // If touch is above middle point, insert before; otherwise, insert after
              insertBefore = touch.clientY < cardMiddleY;
            }
          }

          if (closestCard && closestCard.parentNode) {
            placeholderRef.current.style.display = 'block';

            // Insert the placeholder at the appropriate position
            if (insertBefore) {
              closestCard.parentNode.insertBefore(placeholderRef.current, closestCard);
              // Add indicator class but no additional border
              lastHighlightedElements.current.add(closestCard);
            } else {
              closestCard.parentNode.insertBefore(placeholderRef.current, closestCard.nextSibling);
              // Add indicator class but no additional border
              lastHighlightedElements.current.add(closestCard);
            }
          }
        }
      } else if (targetTaskCard && onReorder) {
        // If we're over a specific task card
        // Don't add drop-target-highlight to task cards to avoid double border
        lastHighlightedElements.current.add(targetTaskCard);

        // Determine if we're in the top or bottom half of the target card
        const rect = targetTaskCard.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;

        if (placeholderRef.current) {
          placeholderRef.current.style.display = 'block';

          // Only move placeholder if it's not already in the right position
          const isAboveAndShouldBeAbove = touch.clientY < midY &&
            placeholderRef.current.nextSibling === targetTaskCard;
          const isBelowAndShouldBeBelow = touch.clientY >= midY &&
            placeholderRef.current.previousSibling === targetTaskCard;

          // Only reposition if needed - reduces DOM operations
          if (!isAboveAndShouldBeAbove && !isBelowAndShouldBeBelow) {
            if (touch.clientY < midY) {
              // Don't add border classes that change dimensions
              targetTaskCard.parentNode?.insertBefore(placeholderRef.current, targetTaskCard);
            } else {
              // Don't add border classes that change dimensions
              targetTaskCard.parentNode?.insertBefore(placeholderRef.current, targetTaskCard.nextSibling);
            }
          }
        }
      }
    }, 8), // Use 8ms throttle for responsive scrolling
    [touchActive, isDragging, clearHighlights, onReorder, handleAutoScroll]
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    // This wrapper prevents excessive renders while still capturing the event
    if (touchActive && cardRef.current) {
      e.preventDefault(); // Prevent scrolling

      // Get the touch position
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;

      // Check if we're near an edge and should trigger scrolling
      if (x <= 0 || x >= window.innerWidth ||
          y <= 0 || y >= window.innerHeight ||
          x <= window.innerWidth * EDGE_ZONE_PERCENT ||
          x >= window.innerWidth * (1 - EDGE_ZONE_PERCENT) ||
          y <= window.innerHeight * EDGE_ZONE_PERCENT ||
          y >= window.innerHeight * (1 - EDGE_ZONE_PERCENT)) {
        // Call auto-scroll directly for immediate response
        handleAutoScroll(x, y);
      }

      // Also call the throttled handler for other drag operations
      handleTouchMoveThrottled(e);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchActive) return;

    setTouchActive(false);

    // Stop any auto-scrolling
    cleanupScrollAnimation();

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

      // Find the element we're over
      const touch = e.changedTouches[0];
      const elementsAtTouch = document.elementsFromPoint(touch.clientX, touch.clientY);

      // Check if we're over another task card first (for reordering)
      const targetTaskCard = elementsAtTouch.find(el =>
        el.classList.contains('task-card') &&
        el !== card &&
        !el.contains(card) &&
        !card.contains(el)
      ) as HTMLElement;

      // Find the drop column
      const dropColumn = elementsAtTouch.find(el =>
        el.classList.contains('drop-column')
      ) as HTMLElement;

      // Execute the correct action based on where the card was dropped
      if (placeholderRef.current && placeholderRef.current.parentNode) {
        // Find nearby task cards to determine position
        const prevCard = placeholderRef.current.previousElementSibling as HTMLElement;
        const nextCard = placeholderRef.current.nextElementSibling as HTMLElement;

        if (dropColumn && dropColumn.dataset.status) {
          // If dropped in a different column, update status
          const newStatus = dropColumn.dataset.status as Task['status'];

          if (newStatus !== task.status) {
            onStatusChange(newStatus);
          } else if (prevCard && prevCard.dataset.taskId && prevCard !== card) {
            // If in same column, reorder based on placeholder position
            onReorder?.(task.id, prevCard.dataset.taskId);
          } else if (nextCard && nextCard.dataset.taskId && nextCard !== card) {
            onReorder?.(task.id, nextCard.dataset.taskId);
          }
        } else if (targetTaskCard && targetTaskCard.dataset.taskId) {
          // Direct drop on a task card
          onReorder?.(task.id, targetTaskCard.dataset.taskId);
        }
      } else if (dropColumn && dropColumn.dataset.status) {
        // Simple column drop without specific position
        onStatusChange(dropColumn.dataset.status as Task['status']);
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

  // Handle touch cancel event
  const handleTouchCancel = (e: React.TouchEvent) => {
    // Stop any auto-scrolling
    cleanupScrollAnimation();
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
        className={`task-card p-3 md:p-4 rounded-lg shadow-sm ${statusColors[task.status]} transition-all hover:shadow-md cursor-move group ${isDragging ? 'opacity-60' : ''} select-none`}
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        aria-grabbed="false"
        data-task-id={task.id}
        style={{ touchAction: 'none' }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
          <div className="flex items-start gap-2">
            {isMobile && (
              <div
                ref={dragHandleRef}
                className="touch-drag-handle mt-1 text-gray-400 transition-colors hover:text-gray-600 active:text-blue-500"
                aria-label="Drag handle"
              >
                <GripVertical className="w-4 h-4" />
              </div>
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
          <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
            <Flag className="w-3 h-3 inline mr-1" />
            {task.priority}
          </span>
          {task.dueDate && (
            <span className="text-xs text-gray-600 flex items-center truncate max-w-[120px]">
              <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{new Date(task.dueDate).toLocaleDateString()}</span>
            </span>
          )}
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
