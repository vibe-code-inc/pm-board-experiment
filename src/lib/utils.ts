import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple class names into a single string, removing duplicates and handling Tailwind utility conflicts.
 * @param inputs Any number of class values (strings, objects, arrays, etc.)
 * @returns A single string with merged class names
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
