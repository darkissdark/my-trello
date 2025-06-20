import React from 'react';
import css from './modal.module.scss';

interface ModalActionContentProps {
  title: string;
  children: React.ReactNode;
  primaryButtonText: string;
  onPrimaryAction: () => void;
  isPrimaryButtonDisabled?: boolean;
  secondaryButtonText: string;
  onSecondaryAction: () => void;
}

export default function ModalActionContent({
  title,
  children,
  primaryButtonText,
  onPrimaryAction,
  isPrimaryButtonDisabled = false,
  secondaryButtonText,
  onSecondaryAction,
}: ModalActionContentProps) {
  return (
    <div>
      <h2 className={css.title}>{title}</h2>
      <div className={css.inputGroup}>{children}</div>
      <div className={css.actions}>
        <button
          className={`${css.buttonAdd} ${css.button}`}
          onClick={onPrimaryAction}
          disabled={isPrimaryButtonDisabled}
        >
          {primaryButtonText}
        </button>
        <button className={`${css.buttonCancel} ${css.button}`} onClick={onSecondaryAction}>
          {secondaryButtonText}
        </button>
      </div>
    </div>
  );
}
