import { useState, useEffect, useCallback } from 'react';

export function useTitleValidation(value: string, onValidationChange?: (isValid: boolean) => void) {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validate = useCallback(
    (valueToValidate: string, force = false): boolean => {
      if (!valueToValidate.trim()) {
        if (touched || force) {
          setError('Назва не може бути порожньою');
        } else {
          setError('');
        }
        return false;
      }

      const regex = /^[a-zA-Zа-яА-ЯґҐєЄіІїЇ0-9 ._-]+$/;
      if (!regex.test(valueToValidate)) {
        setError('Назва може містити тільки літери, цифри, пробіли, тире, крапки та нижні підкреслення');
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
