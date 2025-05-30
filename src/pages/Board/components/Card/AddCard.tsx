import { useState } from 'react';
import { BoardNameInput } from '../common/BoardNameInput';
import { ActionModal } from '../../../../components/ActionModal/ActionModal';
import api from '../../../../api/request';
import './card.scss';

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
      await api.post(`/board/${boardId}/card`, {
        title: cardTitle,
        list_id: listId,
        position,
      });
      setCardTitle('');
      setShowModal(false);
      onCardAdded();
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  return (
    <>
      <button className="list__add-card" onClick={() => setShowModal(true)}>
        + Додати картку
      </button>

      <ActionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Нова картка"
        primaryButtonText="Додати"
        onPrimaryAction={handleAddCard}
        isPrimaryButtonDisabled={!isTitleValid}
        onSecondaryAction={() => {
          setShowModal(false);
          setCardTitle('');
        }}
      >
        <BoardNameInput
          value={cardTitle}
          onChange={setCardTitle}
          onSubmit={handleAddCard}
          onValidationChange={setIsTitleValid}
          placeholder="Назва картки"
          autoFocus
        />
      </ActionModal>
    </>
  );
}
