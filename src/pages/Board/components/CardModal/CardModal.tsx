import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { CardDetails } from '../Card/CardDetails';
import styles from './CardModal.module.scss';

interface CardModalProps {
  boardId: string;
  onCardUpdated: () => void;
}

export const CardModal = ({ boardId, onCardUpdated }: CardModalProps) => {
  const { isOpen, card: selectedCard } = useSelector((state: RootState) => state.modal);
  const { user } = useSelector((state: RootState) => state.auth);

  if (!isOpen || !selectedCard) {
    return null;
  }

  return (
    <Suspense fallback={<div className={styles.cardDetailsLoading}>Loading...</div>}>
      <CardDetails 
        card={selectedCard} 
        boardId={boardId} 
        onCardUpdated={onCardUpdated} 
        currentUser={user} 
      />
    </Suspense>
  );
}; 