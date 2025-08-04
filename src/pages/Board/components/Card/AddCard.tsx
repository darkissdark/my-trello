import { useState } from 'react';
import { boardService, CreateCardData } from '../../../../api/services';
import { LazyModal } from '../../../../components/Modal/LazyModal';
import styles from './AddCard.module.scss';
import React from 'react';

const AddCardModalContent = React.lazy(() => import('./AddCardModalContent'));

interface AddCardProps {
  listId: number;
  boardId: string;
  position: number;
  onCardAdded: () => void;
}

export function AddCard({ listId, boardId, position, onCardAdded }: AddCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);

  const handleAddCard = async () => {
    try {
      const cardData: CreateCardData = {
        title: cardTitle,
        list_id: listId,
        position,
      };
      await boardService.createCard(boardId, cardData);
      setCardTitle('');
      setShowModal(false);
      onCardAdded();
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  return (
    <>
      <button className={styles.listAddCard} onClick={() => setShowModal(true)}>
        + Додати картку
      </button>

      <LazyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        component={AddCardModalContent}
        componentProps={{
          cardTitle,
          setCardTitle,
          isTitleValid,
          setIsTitleValid,
          handleAddCard,
          onClose: () => setShowModal(false),
        }}
      />
    </>
  );
}
