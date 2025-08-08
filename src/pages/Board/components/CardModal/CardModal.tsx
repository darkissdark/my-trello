import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { CardDetails } from '../Card/CardDetails';
import { ICard } from '../../../../common/interfaces/ICard';
import styles from './CardModal.module.scss';

interface CardModalProps {
  boardId: string;
  onCardUpdated: () => void;
  isOpen: boolean;
  selectedCard: ICard | null;
  onClose: () => void;
}

export const CardModal = ({ boardId, onCardUpdated, isOpen, selectedCard, onClose }: CardModalProps) => {
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
        onClose={onClose}
      />
    </Suspense>
  );
};
