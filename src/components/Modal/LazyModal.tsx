import { lazy, ComponentType, ReactNode } from 'react';
import { Modal } from './Modal';

interface LazyModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: () => Promise<{ default: ComponentType<any> }>;
  componentProps?: Record<string, any>;
  fallback?: ReactNode;
}

export function LazyModal({ isOpen, onClose, component, componentProps = {}, fallback }: LazyModalProps) {
  const LazyComponent = lazy(component);

  return (
    <Modal isOpen={isOpen} onClose={onClose} fallback={fallback}>
      <LazyComponent {...componentProps} />
    </Modal>
  );
}
