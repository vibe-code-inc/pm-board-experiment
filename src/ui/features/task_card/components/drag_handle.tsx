import React from 'react';
import { GripVertical } from 'lucide-react';

interface DragHandleProps {
  innerRef?: React.RefObject<HTMLDivElement>;
}

export const DragHandle: React.FC<DragHandleProps> = ({ innerRef }) => {
  return (
    <div
      ref={innerRef}
      className="touch-drag-handle mt-1 text-gray-400 transition-colors hover:text-gray-600 active:text-blue-500"
      aria-label="Drag handle"
    >
      <GripVertical className="w-4 h-4" />
    </div>
  );
};
