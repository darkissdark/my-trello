import { ComponentType, ReactNode, Suspense } from 'react';
import { Modal } from './Modal';

interface LazyModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: ComponentType<any>;
  componentProps?: Record<string, any>;
  fallback?: ReactNode;
}

export function LazyModal({
  isOpen,
  onClose,
  component: Component,
  componentProps = {},
  fallback = <div>Loading...</div>,
}: LazyModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Suspense fallback={fallback}>
        <Component {...componentProps} />
      </Suspense>
    </Modal>
  );
}
