/**
 * Type for validation errors
 */
export type ValidationErrors = Record<string, string> | null;

/**
 * Type for validation options
 */
export type ValidationOptions = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  isEmail?: boolean;
  isDate?: boolean;
  isNumber?: boolean;
  min?: number;
  max?: number;
  customValidator?: (value: string) => string | null;
};

/**
 * Type for field validator function
 */
export type FieldValidator = (value: string, options?: ValidationOptions) => string | null;

/**
 * Type for form validator function
 */
export type FormValidator = (values: Record<string, string>) => ValidationErrors;

/**
 * Validates required fields
 * @param value The field value
 * @param message Optional custom error message
 * @returns Error message or null if valid
 */
export const required = (value: string, message: string = 'This field is required'): string | null => {
  return value.trim() ? null : message;
};

/**
 * Validates a minimum length
 * @param value The field value
 * @param minLength The minimum length
 * @param message Optional custom error message
 * @returns Error message or null if valid
 */
export const minLength = (value: string, minLength: number, message?: string): string | null => {
  return value.length >= minLength
    ? null
    : message || `Must be at least ${minLength} characters`;
};

/**
 * Validates a maximum length
 * @param value The field value
 * @param maxLength The maximum length
 * @param message Optional custom error message
 * @returns Error message or null if valid
 */
export const maxLength = (value: string, maxLength: number, message?: string): string | null => {
  return value.length <= maxLength
    ? null
    : message || `Must be no more than ${maxLength} characters`;
};

/**
 * Validates an email format
 * @param value The field value
 * @param message Optional custom error message
 * @returns Error message or null if valid
 */
export const isEmail = (value: string, message: string = 'Please enter a valid email address'): string | null => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value) ? null : message;
};

/**
 * Validates a date format
 * @param value The field value
 * @param message Optional custom error message
 * @returns Error message or null if valid
 */
export const isDate = (value: string, message: string = 'Please enter a valid date'): string | null => {
  const date = new Date(value);
  return !isNaN(date.getTime()) ? null : message;
};

/**
 * Validates a number format
 * @param value The field value
 * @param message Optional custom error message
 * @returns Error message or null if valid
 */
export const isNumber = (value: string, message: string = 'Please enter a valid number'): string | null => {
  return !isNaN(Number(value)) ? null : message;
};

/**
 * Validates a pattern match
 * @param value The field value
 * @param pattern The RegExp pattern to match
 * @param message Optional custom error message
 * @returns Error message or null if valid
 */
export const matchesPattern = (value: string, pattern: RegExp, message: string = 'Invalid format'): string | null => {
  return pattern.test(value) ? null : message;
};

/**
 * Validates a field with multiple rules
 * @param value The field value
 * @param options Validation options
 * @returns Error message or null if valid
 */
export const validateField = (value: string, options: ValidationOptions): string | null => {
  if (options.required) {
    const requiredError = required(value);
    if (requiredError) {
      return requiredError;
    }
  }

  if (value.trim()) {
    if (options.minLength) {
      const minLengthError = minLength(value, options.minLength);
      if (minLengthError) {
        return minLengthError;
      }
    }

    if (options.maxLength) {
      const maxLengthError = maxLength(value, options.maxLength);
      if (maxLengthError) {
        return maxLengthError;
      }
    }

    if (options.isEmail) {
      const emailError = isEmail(value);
      if (emailError) {
        return emailError;
      }
    }

    if (options.isDate) {
      const dateError = isDate(value);
      if (dateError) {
        return dateError;
      }
    }

    if (options.isNumber) {
      const numberError = isNumber(value);
      if (numberError) {
        return numberError;
      }
    }

    if (options.pattern) {
      const patternError = matchesPattern(value, options.pattern);
      if (patternError) {
        return patternError;
      }
    }

    if (options.isNumber) {
      const num = Number(value);

      if (options.min !== undefined && num < options.min) {
        return `Must be at least ${options.min}`;
      }

      if (options.max !== undefined && num > options.max) {
        return `Must be no more than ${options.max}`;
      }
    }

    if (options.customValidator) {
      return options.customValidator(value);
    }
  }

  return null;
};

/**
 * Validates a form with multiple fields
 * @param values Form values
 * @param validators Validation rules for each field
 * @returns Validation errors or null if valid
 */
export const validateForm = (
  values: Record<string, string>,
  validators: Record<string, ValidationOptions>
): ValidationErrors => {
  const errors: Record<string, string> = {};

  Object.keys(validators).forEach(field => {
    const value = values[field] || '';
    const fieldOptions = validators[field];
    const error = validateField(value, fieldOptions);

    if (error) {
      errors[field] = error;
    }
  });

  return Object.keys(errors).length > 0 ? errors : null;
};
