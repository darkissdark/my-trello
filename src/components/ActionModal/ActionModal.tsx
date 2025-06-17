import { ReactNode, lazy, Suspense } from 'react';
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

const ActionModalContent = lazy(() => import('./ActionModalContent'));

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
      <Suspense fallback={<div>Loading...</div>}>
        <ActionModalContent
          title={title}
          primaryButtonText={primaryButtonText}
          onPrimaryAction={onPrimaryAction}
          isPrimaryButtonDisabled={isPrimaryButtonDisabled}
          secondaryButtonText={secondaryButtonText}
          onSecondaryAction={onSecondaryAction || onClose}
        >
          {children}
        </ActionModalContent>
      </Suspense>
    </Modal>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
