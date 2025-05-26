import { useTitleValidation } from '../../../../hooks/useTitleValidation';

interface BoardNameInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onBlur?: () => void;
  onCancel?: () => void;
  onValidationChange?: (isValid: boolean) => void;
  placeholder?: string;
  autoFocus?: boolean;
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
}: BoardNameInputProps) {
  const { error, validate, markTouched } = useTitleValidation(value, onValidationChange);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!value) markTouched();
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && validate(value, true)) {
      onSubmit?.();
    } else if (e.key === 'Escape') {
      onCancel?.();
    }
  };

  return (
    <div className="input-board-name">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (validate(value, true)) {
            onBlur?.();
          }
        }}
        className={error ? 'error' : ''}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      {error && <div className="input-board-error">{error}</div>}
    </div>
  );
}
