import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from '../Modal/Modal';
import './action-modal.scss';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  primaryButtonText: string;
  onPrimaryAction: () => void;
  isPrimaryButtonDisabled?: boolean;
  secondaryButtonText?: string;
  onSecondaryAction?: () => void;
}

export function ActionModal({
  isOpen,
  onClose,
  title,
  children,
  primaryButtonText,
  onPrimaryAction,
  isPrimaryButtonDisabled = false,
  secondaryButtonText = 'Скасувати',
  onSecondaryAction,
}: ActionModalProps) {
  if (!isOpen) return null;

  const modalContent = (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>{title}</h2>
      <div className="modal__content__input-group">{children}</div>
      <div className="modal__content__actions">
        <button className="button__add" onClick={onPrimaryAction} disabled={isPrimaryButtonDisabled}>
          {primaryButtonText}
        </button>
        <button className="button__cancel" onClick={onSecondaryAction || onClose}>
          {secondaryButtonText}
        </button>
      </div>
    </Modal>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
