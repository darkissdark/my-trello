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
      if (as === 'input' && validate(value, true)) {
        onSubmit?.();
      } else if (as === 'textarea' && !e.shiftKey) {
        e.preventDefault();
        if (disableValidation || validate(value, true)) {
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
    if (disableValidation || validate(value, true)) {
      onBlur?.();
    }
  };

  return (
    <div className="input-board-name">
      {as === 'textarea' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={`${error ? 'error' : ''} input-board-element`}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={1}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={`${error ? 'error' : ''} input-board-element`}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
      )}
      {!disableValidation && error && <div className={css.error}>{error}</div>}
    </div>
  );
}
