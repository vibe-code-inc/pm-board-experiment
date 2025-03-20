import { useEffect, useRef } from 'react';

interface SafeArea {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Custom hook to detect safe areas for notches and home indicators on mobile devices
 * @returns An object containing safe area insets
 */
export const useSafeArea = (): SafeArea => {
  const safeAreaRef = useRef<SafeArea>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

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

    // Listen for orientation change events to recalculate safe areas
    window.addEventListener('orientationchange', detectSafeAreas);

    return () => {
      window.removeEventListener('orientationchange', detectSafeAreas);
    };
  }, []);

  return safeAreaRef.current;
};
