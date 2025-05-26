import { useState, useEffect } from 'react';

export function useTitleValidation(value: string, onValidationChange?: (isValid: boolean) => void) {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const isValid = validate(value);
    onValidationChange?.(isValid);
  }, [value, onValidationChange]);

  const validate = (value: string, force = false): boolean => {
    if (!value.trim()) {
      if (touched || force) {
        setError('Назва не може бути порожньою');
      } else {
        setError('');
      }
      return false;
    }

    const regex = /^[a-zA-Zа-яА-ЯґҐєЄіІїЇ0-9 ._-]+$/;
    if (!regex.test(value)) {
      setError('Назва може містити тільки літери, цифри, пробіли, тире, крапки та нижні підкреслення');
      return false;
    }

    setError('');
    return true;
  };

  const markTouched = () => setTouched(true);

  return { error, validate, markTouched };
}
