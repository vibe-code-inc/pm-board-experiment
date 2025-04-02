import { useState, useCallback } from 'react';

/**
 * Hook for managing disclosure state (open/close)
 * @param initialState Initial open state
 * @returns Object containing isOpen state and toggle functions
 */
export function useDisclosure(initialState: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle
  };
}
