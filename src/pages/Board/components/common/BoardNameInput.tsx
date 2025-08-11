import { useTitleValidation } from '../../../../hooks/useTitleValidation';
import { useEffect, useRef } from 'react';
import css from './BoardNameInput.module.scss';

interface BoardNameInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onBlur?: () => void;
  onCancel?: () => void;
  onValidationChange?: (isValid: boolean) => void;
  placeholder?: string;
  autoFocus?: boolean;
  as?: 'input' | 'textarea';
  disableValidation?: boolean;
  additionalClassName?: string;
  additionalClassNameWrapper?: string;
}

export function BoardNameInput({
  value,
  onChange,
  onBlur,
  onSubmit,
  onCancel,
  onValidationChange,
  placeholder,
  autoFocus,
  as = 'input',
  disableValidation = false,
  additionalClassName,
  additionalClassNameWrapper,
}: BoardNameInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const validation = useTitleValidation(value, onValidationChange);
  const error = disableValidation ? undefined : validation.error;
  const validate = disableValidation ? () => true : validation.validate;
  const markTouched = disableValidation ? () => {} : validation.markTouched;

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (as === 'textarea' && textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [value, as]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!disableValidation && !value) markTouched();
    onChange(e.target.value);
    if (as === 'textarea' && e.target instanceof HTMLTextAreaElement) {
      adjustTextareaHeight(e.target);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      const trimmedValue = value.trim();
      if (trimmedValue !== value) {
        onChange(trimmedValue);
      }

      if (as === 'input' && validate(trimmedValue, true)) {
        onSubmit?.();
      } else if (as === 'textarea' && !e.shiftKey) {
        e.preventDefault();
        if (disableValidation || validate(trimmedValue, true)) {
          if (textareaRef.current) {
            textareaRef.current.blur();
          }
        }
      }
    } else if (e.key === 'Escape') {
      onCancel?.();
    }
  };

  const handleBlur = () => {
    const trimmedValue = value.trim();
    if (trimmedValue !== value) {
      onChange(trimmedValue);
    }
    if (disableValidation || validate(trimmedValue, true)) {
      onBlur?.();
    }
  };

  return (
    <div className={additionalClassNameWrapper}>
      {as === 'textarea' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={`${error ? 'error' : ''} ${additionalClassName}`}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={1}
          name="textarea"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={`${error ? 'error' : ''} input-board-element ${additionalClassName}`}
          placeholder={placeholder}
          autoFocus={autoFocus}
          name="input"
        />
      )}
      {!disableValidation && error && <div className={css.error}>{error}</div>}
    </div>
  );
}
