import { ReactNode } from 'react';

interface ActionModalContentProps {
  title: string;
  children: ReactNode;
  primaryButtonText: string;
  onPrimaryAction: () => void;
  isPrimaryButtonDisabled?: boolean;
  secondaryButtonText: string;
  onSecondaryAction: () => void;
}

export default function ActionModalContent({
  title,
  children,
  primaryButtonText,
  onPrimaryAction,
  isPrimaryButtonDisabled = false,
  secondaryButtonText,
  onSecondaryAction,
}: ActionModalContentProps) {
  return (
    <>
      <h2>{title}</h2>
      <div className="modal__content__input-group">{children}</div>
      <div className="modal__content__actions">
        <button className="button__add" onClick={onPrimaryAction} disabled={isPrimaryButtonDisabled}>
          {primaryButtonText}
        </button>
        <button className="button__cancel" onClick={onSecondaryAction}>
          {secondaryButtonText}
        </button>
      </div>
    </>
  );
}
