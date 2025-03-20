// Scroll utility functions

// Configuration for auto-scrolling
export const SCROLL_CONFIG = {
  EDGE_ZONE_PERCENT: 0.3, // Edge detection zone - 30% of screen dimensions
  MIN_SCROLL_SPEED: 50, // Minimum scrolling speed in pixels per frame
  MAX_SCROLL_SPEED: 200, // Maximum scrolling speed in pixels per frame
  EXPONENTIAL_POWER: 2, // Exponential power for acceleration
};

// Variable to track the scroll interval
let scrollIntervalId: number | null = null;

/**
 * Performs direct scrolling in a specified direction at a given speed
 * @param direction The direction to scroll: 'left', 'right', 'up', or 'down'
 * @param speed Speed in pixels per interval
 */
export function directScroll(direction: 'left' | 'right' | 'up' | 'down', speed: number) {
  if (scrollIntervalId) {
    clearInterval(scrollIntervalId);
  }

  // Set up interval for continuous scrolling with fixed pixel amounts
  scrollIntervalId = window.setInterval(() => {
    if (direction === 'left') {
      window.scrollBy(-speed, 0);
    } else if (direction === 'right') {
      window.scrollBy(speed, 0);
    } else if (direction === 'up') {
      window.scrollBy(0, -speed);
    } else if (direction === 'down') {
      window.scrollBy(0, speed);
    }
  }, 16); // ~60fps
}

/**
 * Stops any active scrolling
 */
export function stopScroll() {
  if (scrollIntervalId) {
    clearInterval(scrollIntervalId);
    scrollIntervalId = null;
  }
}

/**
 * Utility function to throttle function calls
 * @param func The function to throttle
 * @param delay The delay in milliseconds between function calls
 * @returns A throttled version of the function
 */
export const throttle = (func: Function, delay: number) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    func(...args);
  };
};
