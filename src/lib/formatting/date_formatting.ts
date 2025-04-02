/**
 * Format options for date formatting
 */
export type DateFormatOptions = {
  includeTime?: boolean;
  timeFormat?: '12h' | '24h';
  locale?: string;
};

/**
 * Formats a date as a relative time (e.g., "5 minutes ago", "in 3 days")
 * @param dateString ISO date string or Date object
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (dateString: string | Date): string => {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  // Future date
  if (diffInSeconds < 0) {
    const absDiff = Math.abs(diffInSeconds);

    if (absDiff < 60) return 'in a few seconds';
    if (absDiff < 3600) return `in ${Math.floor(absDiff / 60)} minutes`;
    if (absDiff < 86400) return `in ${Math.floor(absDiff / 3600)} hours`;
    if (absDiff < 604800) return `in ${Math.floor(absDiff / 86400)} days`;
    if (absDiff < 2592000) return `in ${Math.floor(absDiff / 604800)} weeks`;
    if (absDiff < 31536000) return `in ${Math.floor(absDiff / 2592000)} months`;
    return `in ${Math.floor(absDiff / 31536000)} years`;
  }

  // Past date
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

/**
 * Formats a date with the specified format options
 * @param dateString ISO date string or Date object
 * @param options Format options
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | Date,
  options: DateFormatOptions = {}
): string => {
  const {
    includeTime = false,
    timeFormat = '24h',
    locale = 'en-US'
  } = options;

  const date = dateString instanceof Date ? dateString : new Date(dateString);

  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  // Basic date formatting options
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  // Add time formatting if requested
  if (includeTime) {
    dateOptions.hour = timeFormat === '12h' ? 'numeric' : '2-digit';
    dateOptions.minute = '2-digit';
    dateOptions.hour12 = timeFormat === '12h';
  }

  return new Intl.DateTimeFormat(locale, dateOptions).format(date);
};

/**
 * Formats a date as a calendar date (e.g., "Today", "Yesterday", "Monday", or "Apr 15, 2023")
 * @param dateString ISO date string or Date object
 * @param options Format options
 * @returns Formatted calendar date string
 */
export const formatCalendarDate = (
  dateString: string | Date,
  options: DateFormatOptions = {}
): string => {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  const now = new Date();

  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  // Set both dates to midnight for comparison
  const dateAtMidnight = new Date(date);
  dateAtMidnight.setHours(0, 0, 0, 0);

  const nowAtMidnight = new Date(now);
  nowAtMidnight.setHours(0, 0, 0, 0);

  // Calculate day difference
  const diffInDays = Math.floor(
    (nowAtMidnight.getTime() - dateAtMidnight.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Format based on difference
  if (diffInDays === 0) {
    return options.includeTime
      ? `Today at ${formatTime(date, options)}`
      : 'Today';
  }

  if (diffInDays === 1) {
    return options.includeTime
      ? `Yesterday at ${formatTime(date, options)}`
      : 'Yesterday';
  }

  if (diffInDays < 7) {
    return options.includeTime
      ? `${date.toLocaleDateString(options.locale || 'en-US', { weekday: 'long' })} at ${formatTime(date, options)}`
      : date.toLocaleDateString(options.locale || 'en-US', { weekday: 'long' });
  }

  return formatDate(date, options);
};

/**
 * Helper function to format just the time portion of a date
 * @param date Date object
 * @param options Format options
 * @returns Formatted time string
 */
const formatTime = (date: Date, options: DateFormatOptions = {}): string => {
  const {
    timeFormat = '24h',
    locale = 'en-US'
  } = options;

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: timeFormat === '12h' ? 'numeric' : '2-digit',
    minute: '2-digit',
    hour12: timeFormat === '12h'
  };

  return new Intl.DateTimeFormat(locale, timeOptions).format(date);
};
