import { useState, useCallback } from 'react';
import { ValidationOptions, ValidationErrors, validateForm } from '@/lib/validation/form_validation';

/**
 * Form schema type for mapping fields to their validation options
 */
export type FormSchema<T extends Record<string, unknown>> = {
  [K in keyof T]?: ValidationOptions;
};

/**
 * Hook for form validation and state management
 * @param initialValues Initial form values
 * @param schema Validation schema with rules for each field
 * @returns Form state, handlers, and validation utilities
 */
export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  schema: FormSchema<T>
) {
  // Form state
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>(null);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change events
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    setIsDirty(true);

    // Clear errors when field is modified
    if (errors && errors[name]) {
      setErrors(prev => {
        if (!prev) return null;

        const newErrors = { ...prev };
        delete newErrors[name];
        return Object.keys(newErrors).length > 0 ? newErrors : null;
      });
    }
  }, [errors]);

  /**
   * Set a specific field value programmatically
   */
  const setValue = useCallback((name: keyof T, value: string) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    setIsDirty(true);

    // Clear errors when field is modified
    if (errors && errors[name as string]) {
      setErrors(prev => {
        if (!prev) return null;

        const newErrors = { ...prev };
        delete newErrors[name as string];
        return Object.keys(newErrors).length > 0 ? newErrors : null;
      });
    }
  }, [errors]);

  /**
   * Handle blur events to mark fields as touched
   */
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate single field on blur
    const fieldSchema = schema[name as keyof T];
    if (fieldSchema) {
      const value = values[name as keyof T];
      const stringValue = typeof value === 'string' ? value : '';
      const fieldErrors = validateForm(
        { [name]: stringValue },
        { [name]: fieldSchema }
      );

      if (fieldErrors) {
        setErrors(prev => {
          const newErrors = { ...(prev || {}) };
          Object.assign(newErrors, fieldErrors);
          return newErrors;
        });
      } else if (errors && errors[name]) {
        // Clear error if validation passes
        setErrors(prev => {
          if (!prev) return null;

          const newErrors = { ...prev };
          delete newErrors[name];
          return Object.keys(newErrors).length > 0 ? newErrors : null;
        });
      }
    }
  }, [values, schema, errors]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors(null);
    setTouched({} as Record<keyof T, boolean>);
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Validate the entire form
   * @returns Boolean indicating if form is valid
   */
  const validateFormValues = useCallback((): boolean => {
    // Convert form values to Record<string, string> for validateForm
    const stringValues: Record<string, string> = {};
    Object.keys(values).forEach(key => {
      const value = values[key as keyof T];
      stringValues[key] = typeof value === 'string' ? value : '';
    });

    const validationErrors = validateForm(stringValues, schema as Record<string, ValidationOptions>);
    setErrors(validationErrors);

    return validationErrors === null;
  }, [values, schema]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback((
    onSubmit: (values: T) => void | Promise<void>
  ) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched: Record<keyof T, boolean> = {} as Record<keyof T, boolean>;
      Object.keys(values).forEach(key => {
        allTouched[key as keyof T] = true;
      });
      setTouched(allTouched);

      // Validate form
      const isValid = validateFormValues();

      if (isValid) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    };
  }, [values, validateFormValues]);

  return {
    // Form state
    values,
    errors,
    touched,
    isDirty,
    isSubmitting,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    resetForm,

    // Validation
    validateForm: validateFormValues
  };
}
