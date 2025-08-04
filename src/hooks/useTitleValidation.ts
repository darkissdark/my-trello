import { useState, useEffect, useCallback } from 'react';

export function useTitleValidation(value: string | undefined, onValidationChange?: (isValid: boolean) => void) {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validate = useCallback(
    (valueToValidate: string | undefined, force = false): boolean => {
      if (!valueToValidate || !valueToValidate.trim()) {
        if (touched || force) {
          setError('Title cannot be empty');
        } else {
          setError('');
        }
        return false;
      }

      const regex = /^[a-zA-Z0-9 ._-]+$/;
      if (!regex.test(valueToValidate)) {
        setError('Title can only contain letters, numbers, spaces, dashes, dots and underscores');
        return false;
      }

      setError('');
      return true;
    },
    [touched]
  );

  useEffect(() => {
    const isValid = validate(value);
    onValidationChange?.(isValid);
  }, [value, validate, onValidationChange]);

  const markTouched = () => setTouched(true);

  return { error, validate, markTouched };
}
