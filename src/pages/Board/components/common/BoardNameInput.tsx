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
}: BoardNameInputProps) {
  const { error, validate, markTouched } = useTitleValidation(value, onValidationChange);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (!value) markTouched();
    onChange(e.target.value);
    if (as === 'textarea' && e.target instanceof HTMLTextAreaElement) {
      adjustTextareaHeight(e.target);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && validate(value, true) && as === 'input') {
      onSubmit?.();
    } else if (e.key === 'Escape') {
      onCancel?.();
    }
  };

  const handleBlur = () => {
    if (validate(value, true)) {
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
          className={error ? 'error' : ''}
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
          className={error ? 'error' : ''}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
      )}
      {error && <div className={css.error}>{error}</div>}
    </div>
  );
}
