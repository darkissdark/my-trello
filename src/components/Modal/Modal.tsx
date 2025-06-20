import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import css from './modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  const modalContent = (
    <div className={css.modal} onClick={onClose}>
      <div className={css.content} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
