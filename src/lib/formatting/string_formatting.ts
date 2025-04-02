/**
 * Capitalizes the first letter of a string
 * @param str String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncates a string to the specified length and adds an ellipsis
 * @param str String to truncate
 * @param maxLength Maximum length before truncating
 * @param ellipsis String to add at the end (default: '...')
 * @returns Truncated string
 */
export const truncate = (str: string, maxLength: number, ellipsis: string = '...'): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;

  return str.slice(0, maxLength) + ellipsis;
};

/**
 * Converts a string to kebab-case
 * @param str String to convert
 * @returns Kebab-cased string
 */
export const toKebabCase = (str: string): string => {
  if (!str) return '';

  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

/**
 * Converts a string to snake_case
 * @param str String to convert
 * @returns Snake_cased string
 */
export const toSnakeCase = (str: string): string => {
  if (!str) return '';

  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
};

/**
 * Converts a string to camelCase
 * @param str String to convert
 * @returns CamelCased string
 */
export const toCamelCase = (str: string): string => {
  if (!str) return '';

  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/[\s-_]+/g, '');
};

/**
 * Converts a string to PascalCase
 * @param str String to convert
 * @returns PascalCased string
 */
export const toPascalCase = (str: string): string => {
  if (!str) return '';

  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
    .replace(/[\s-_]+/g, '');
};

/**
 * Pluralizes a string based on count
 * @param singular Singular form of the word
 * @param count The count to determine plurality
 * @param plural Optional plural form (defaults to singular + 's')
 * @returns Pluralized string
 */
export const pluralize = (singular: string, count: number, plural?: string): string => {
  if (!singular) return '';
  if (count === 1) return singular;

  return plural || `${singular}s`;
};

/**
 * Adds ordinal suffix to a number (1st, 2nd, 3rd, etc.)
 * @param num Number to add ordinal to
 * @returns Number with ordinal suffix
 */
export const ordinal = (num: number): string => {
  const j = num % 10;
  const k = num % 100;

  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;

  return `${num}th`;
};

/**
 * Escapes HTML special characters in a string
 * @param str String to escape
 * @returns Escaped string
 */
export const escapeHtml = (str: string): string => {
  if (!str) return '';

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
