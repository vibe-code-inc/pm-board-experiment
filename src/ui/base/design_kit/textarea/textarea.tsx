import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  className,
  label,
  error,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base py-1.5 md:py-2",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs md:text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
