import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if device is mobile based on screen width
 * @param breakpoint Width in pixels below which device is considered mobile
 * @returns Boolean indicating if device is mobile
 */
export const useMobileDetection = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia(`(max-width: ${breakpoint}px)`).matches);
    };

    // Check initially
    checkMobile();

    // Listen for window resize events
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
};
