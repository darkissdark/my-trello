import { ReactNode, Suspense } from 'react';
import './modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Modal({ isOpen, onClose, children, fallback = <div>Loading...</div> }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <Suspense fallback={fallback}>{children}</Suspense>
      </div>
    </div>
  );
}
