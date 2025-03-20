import { useCallback } from 'react';
import { directScroll, stopScroll, SCROLL_CONFIG } from '@/lib/scroll_utils';

/**
 * Custom hook for handling auto-scrolling during drag operations
 * @returns Function to handle auto-scrolling based on touch/mouse position
 */
export const useAutoScroll = () => {
  const { EDGE_ZONE_PERCENT, MIN_SCROLL_SPEED, MAX_SCROLL_SPEED, EXPONENTIAL_POWER } = SCROLL_CONFIG;

  const handleAutoScroll = useCallback((touchX: number, touchY: number) => {
    // Get current dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate edge zones
    const edgeWidth = windowWidth * EDGE_ZONE_PERCENT;
    const edgeHeight = windowHeight * EDGE_ZONE_PERCENT;

    // Calculate scroll speed based on position
    let direction: 'left' | 'right' | 'up' | 'down' | null = null;
    let speed = MIN_SCROLL_SPEED;

    // HORIZONTAL EDGES
    if (touchX < edgeWidth) {
      // Left edge
      direction = 'left';
      // Calculate how close to the edge (0-1)
      const edgeFactor = 1 - (touchX / edgeWidth);
      // Apply exponential scaling
      const expFactor = Math.pow(edgeFactor, EXPONENTIAL_POWER);
      // Scale between min and max speed
      speed = MIN_SCROLL_SPEED + expFactor * (MAX_SCROLL_SPEED - MIN_SCROLL_SPEED);
    } else if (touchX > windowWidth - edgeWidth) {
      // Right edge
      direction = 'right';
      const edgeFactor = 1 - ((windowWidth - touchX) / edgeWidth);
      const expFactor = Math.pow(edgeFactor, EXPONENTIAL_POWER);
      speed = MIN_SCROLL_SPEED + expFactor * (MAX_SCROLL_SPEED - MIN_SCROLL_SPEED);
    }

    // VERTICAL EDGES - only check if not already scrolling horizontally
    if (!direction) {
      if (touchY < edgeHeight) {
        // Top edge
        direction = 'up';
        const edgeFactor = 1 - (touchY / edgeHeight);
        const expFactor = Math.pow(edgeFactor, EXPONENTIAL_POWER);
        speed = MIN_SCROLL_SPEED + expFactor * (MAX_SCROLL_SPEED - MIN_SCROLL_SPEED);
      } else if (touchY > windowHeight - edgeHeight) {
        // Bottom edge
        direction = 'down';
        const edgeFactor = 1 - ((windowHeight - touchY) / edgeHeight);
        const expFactor = Math.pow(edgeFactor, EXPONENTIAL_POWER);
        speed = MIN_SCROLL_SPEED + expFactor * (MAX_SCROLL_SPEED - MIN_SCROLL_SPEED);
      }
    }

    // Outside viewport gets max speed
    if (touchX < 0) {
      direction = 'left';
      speed = MAX_SCROLL_SPEED * 2; // 2x max speed
    } else if (touchX > windowWidth) {
      direction = 'right';
      speed = MAX_SCROLL_SPEED * 2;
    } else if (touchY < 0) {
      direction = 'up';
      speed = MAX_SCROLL_SPEED * 2;
    } else if (touchY > windowHeight) {
      direction = 'down';
      speed = MAX_SCROLL_SPEED * 2;
    }

    // Apply scrolling if needed
    if (direction) {
      directScroll(direction, Math.round(speed));
    } else {
      stopScroll();
    }
  }, [EDGE_ZONE_PERCENT, MIN_SCROLL_SPEED, MAX_SCROLL_SPEED, EXPONENTIAL_POWER]);

  return handleAutoScroll;
};
