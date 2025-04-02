import { useState, useEffect } from 'react';

/**
 * Hook that listens for matches to a CSS media query
 * @param query The CSS media query to match
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with the current match
  const getMatches = (): boolean => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  // State and setter for matched value
  const [matches, setMatches] = useState<boolean>(getMatches);

  // Handle change event
  const handleChange = () => {
    setMatches(getMatches());
  };

  // Listen for changes
  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Set up initial value
    handleChange();

    // Use addEventListener when available
    if (matchMedia.addEventListener) {
      matchMedia.addEventListener('change', handleChange);
      return () => {
        matchMedia.removeEventListener('change', handleChange);
      };
    } else {
      // Fallback for older browsers
      matchMedia.addListener(handleChange);
      return () => {
        matchMedia.removeListener(handleChange);
      };
    }
  }, [query]);

  return matches;
}

/**
 * Predefined media query hooks
 */

/**
 * Hook that returns true on small screen sizes (mobile)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

/**
 * Hook that returns true on tablet screen sizes
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

/**
 * Hook that returns true on desktop screen sizes
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/**
 * Hook that returns true when the user prefers dark color scheme
 */
export function useIsDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * Hook that returns true when the user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
