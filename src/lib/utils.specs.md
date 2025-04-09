---
description: Utils Specification
type: utility
---

<specification>
  <meta>
    <title>Utils Specification</title>
    <description>The utils.ts file provides essential utility functions used throughout the application. It includes the `cn` function for merging class names, date formatting utilities, and other helper functions that support various components and features.</description>
    <created-at utc-timestamp="1712678400">April 9, 2024, 10:00 AM EDT</created-at>
    <applies-to>
      <file-matcher glob="src/lib/utils.ts">Utils File</file-matcher>
    </applies-to>
  </meta>

  <overview>
    <description>The utils.ts file provides essential utility functions used throughout the application. It includes the `cn` function for merging class names, date formatting utilities, and other helper functions that support various components and features.</description>
    <responsibility>Provide reusable utility functions that can be shared across the application</responsibility>
  </overview>

  <requirements>
    <functional-requirements>
      <requirement priority="high">
        <description>Provide utility functions that can be reused across the application</description>
      </requirement>
      <requirement priority="high">
        <description>Support consistent styling with proper class name merging</description>
      </requirement>
      <requirement priority="medium">
        <description>Ensure proper date formatting throughout the application</description>
      </requirement>
      <requirement priority="medium">
        <description>Provide helper functions for common operations</description>
      </requirement>
      <requirement priority="high">
        <description>Follow functional programming principles for better testability</description>
      </requirement>
    </functional-requirements>

    <technical-requirements>
      <requirement priority="high">
        <description>Export the `cn` function for class name merging</description>
      </requirement>
      <requirement priority="medium">
        <description>Provide date formatting and manipulation utilities</description>
      </requirement>
      <requirement priority="medium">
        <description>Export helper functions for common operations</description>
      </requirement>
      <requirement priority="high">
        <description>Support all valid class name types as inputs</description>
      </requirement>
      <requirement priority="high">
        <description>Remove duplicate classes when merging</description>
      </requirement>
      <requirement priority="high">
        <description>Prioritize classes from later arguments over earlier ones</description>
      </requirement>
      <requirement priority="high">
        <description>Ensure proper handling of Tailwind utilities</description>
      </requirement>
      <requirement priority="high">
        <description>Support conditional class names</description>
      </requirement>
      <requirement priority="medium">
        <description>Optimize for bundle size and performance</description>
      </requirement>
      <requirement priority="high">
        <description>Use proper TypeScript typing for all functions</description>
      </requirement>
      <requirement priority="high">
        <description>Implement pure functions without side effects</description>
      </requirement>
      <requirement priority="medium">
        <description>Export each function individually for better tree-shaking</description>
      </requirement>
      <requirement priority="medium">
        <description>Document functions with JSDoc comments</description>
      </requirement>
    </technical-requirements>

    <behavioral-expectations>
      <expectation priority="high">
        <description>Properly merge class names with correct handling of conflicts</description>
      </expectation>
      <expectation priority="high">
        <description>Handle conditional classes based on boolean expressions</description>
      </expectation>
      <expectation priority="high">
        <description>Successfully remove duplicate and conflicting classes</description>
      </expectation>
      <expectation priority="medium">
        <description>Format dates consistently across the application</description>
      </expectation>
      <expectation priority="medium">
        <description>Correctly identify dates in the past or within specific ranges</description>
      </expectation>
      <expectation priority="medium">
        <description>Generate unique IDs that are consistent within a session</description>
      </expectation>
      <expectation priority="medium">
        <description>Truncate strings at the specified length with proper ellipsis</description>
      </expectation>
    </behavioral-expectations>
  </requirements>

  <interfaces>
    <interface type="function">
      <definition><![CDATA[/**
 * Type for valid class name values that can be processed by the cn function
 */
export type ClassValue = string | number | boolean | undefined | null |
  Record<string, boolean | undefined | null> | ClassValue[];

/**
 * Merges multiple class names into a single string, removing duplicates and handling Tailwind utility conflicts.
 * @param inputs Any number of class values (strings, objects, arrays, etc.)
 * @returns A single string with merged class names
 */
export function cn(...inputs: ClassValue[]): string;

/**
 * Formats a date string into a user-friendly format
 * @param dateString ISO date string to format
 * @param format The format to use (short, medium, long)
 * @returns Formatted date string
 */
export function formatDate(
  dateString?: string,
  format: 'short' | 'medium' | 'long' = 'medium'
): string;

/**
 * Checks if a date is in the past
 * @param dateString ISO date string to check
 * @returns Boolean indicating if the date is in the past
 */
export function isPastDate(dateString?: string): boolean;

/**
 * Checks if a date is within a certain number of days from now
 * @param dateString ISO date string to check
 * @param days Number of days threshold
 * @returns Boolean indicating if the date is within the threshold
 */
export function isDateWithinDays(dateString?: string, days: number = 3): boolean;

/**
 * Truncates a string to a maximum length and adds ellipsis if needed
 * @param str String to truncate
 * @param maxLength Maximum length before truncating
 * @returns Truncated string with ellipsis if needed
 */
export function truncateString(str: string, maxLength: number = 50): string;

/**
 * Generates a unique ID for DOM elements
 * @param prefix Optional prefix for the ID
 * @returns Unique ID string
 */
export function generateId(prefix: string = 'id'): string;]]></definition>
    </interface>
  </interfaces>

  <implementation>
    <files>
      <file path="src/lib/utils.ts" action="create">
        <changes>Create utils.ts file with required utility functions</changes>
        <example><![CDATA[import { clsx, type ClassValue as ClsxValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type ClassValue = ClsxValue;

/**
 * Merges multiple class names into a single string, removing duplicates and handling Tailwind utility conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a user-friendly format
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
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    case 'long':
      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    case 'medium':
    default:
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
  }
}

/**
 * Checks if a date is in the past
 */
export function isPastDate(dateString?: string): boolean {
  if (!dateString) return false;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;

  const now = new Date();
  return date < now;
}

/**
 * Checks if a date is within a certain number of days from now
 */
export function isDateWithinDays(dateString?: string, days: number = 3): boolean {
  if (!dateString) return false;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;

  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);

  return date >= now && date <= futureDate;
}

/**
 * Truncates a string to a maximum length and adds ellipsis if needed
 */
export function truncateString(str: string, maxLength: number = 50): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;

  return `${str.substring(0, maxLength)}...`;
}

/**
 * Generates a unique ID for DOM elements
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}]]></example>
      </file>
    </files>

    <dependencies>
      <dependency type="external">clsx for basic class merging</dependency>
      <dependency type="external">tailwind-merge for handling Tailwind utility conflicts</dependency>
    </dependencies>
  </implementation>

  <references>
    <reference href="./lib.package_specs.md">Library Utilities</reference>
    <reference href="../ui/features/task_card/task_card.specs.md">Task Card Component</reference>
    <reference href="../ui/features/task_modal/task_modal.specs.md">Task Modal Component</reference>
  </references>
</specification>
