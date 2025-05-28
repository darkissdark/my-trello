import { useState } from 'react';
import api from '../../../api/request';
import { BoardNameInput } from './common/BoardNameInput';
import { ActionModal } from '../../../components/ActionModal/ActionModal';

interface CreateBoardProps {
  onCardCreated: () => void;
}

export function CreateBoard({ onCardCreated }: CreateBoardProps) {
  const [showModal, setShowModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);
  const boardEndpoint = '/board';

  const handleCreateBoard = async () => {
    const newBoard = {
      title: newBoardTitle,
      custom: {
        background: 'blue',
      },
    };

    try {
      await api.post(boardEndpoint, newBoard);
      onCardCreated();
      setNewBoardTitle('');
      setShowModal(false);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  return (
    <>
      <button className="boards__button boards__card" onClick={() => setShowModal(true)}>
        + Додати дошку
      </button>

      <ActionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Нова дошка"
        primaryButtonText="Створити"
        onPrimaryAction={handleCreateBoard}
        isPrimaryButtonDisabled={!isTitleValid}
      >
        <BoardNameInput
          value={newBoardTitle}
          onChange={setNewBoardTitle}
          onValidationChange={setIsTitleValid}
          onSubmit={handleCreateBoard}
          placeholder="Назва дошки"
        />
      </ActionModal>
    </>
  );
}
