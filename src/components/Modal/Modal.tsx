import { ReactNode } from 'react';
import './modal.scss';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
} 