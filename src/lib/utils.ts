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

/**
 * Formats a date string into a user-friendly format
 * @param dateString ISO date string to format
 * @param format The format to use (short, medium, long)
 * @returns Formatted date string
 */
export function formatDate(
  dateString?: string,
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return '';

  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'medium':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    case 'long':
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    default:
      return date.toLocaleDateString();
  }
}

/**
 * Checks if a date is in the past
 * @param dateString ISO date string to check
 * @returns Boolean indicating if the date is in the past
 */
export function isPastDate(dateString?: string): boolean {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();

  if (isNaN(date.getTime())) return false;

  // Set hours to 0 to compare just the dates
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  return compareDate < today;
}

/**
 * Checks if a date is within a certain number of days from now
 * @param dateString ISO date string to check
 * @param days Number of days threshold
 * @returns Boolean indicating if the date is within the threshold
 */
export function isDateWithinDays(dateString?: string, days: number = 3): boolean {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();

  if (isNaN(date.getTime())) return false;

  // Set hours to 0 to compare just the dates
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  const timeDiff = compareDate.getTime() - today.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);

  return daysDiff >= 0 && daysDiff <= days;
}

/**
 * Truncates a string to a maximum length and adds ellipsis if needed
 * @param str String to truncate
 * @param maxLength Maximum length before truncating
 * @returns Truncated string with ellipsis if needed
 */
export function truncateString(str: string, maxLength: number = 50): string {
  if (!str) return '';

  if (str.length <= maxLength) return str;

  return str.substring(0, maxLength) + '...';
}

/**
 * Generates a unique ID for DOM elements
 * @param prefix Optional prefix for the ID
 * @returns Unique ID string
 */
export function generateId(prefix: string = 'id'): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${randomPart}`;
}
