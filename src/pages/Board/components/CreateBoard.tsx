import { useState } from 'react';
import { Modal } from '../../../components/Modal/Modal';
import api from '../../../api/request';
import { BoardNameInput } from './common/BoardNameInput';

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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>Нова дошка</h2>
        <div className="modal__content__input-group">
          <BoardNameInput
            value={newBoardTitle}
            onChange={setNewBoardTitle}
            onValidationChange={setIsTitleValid}
            onSubmit={handleCreateBoard}
            placeholder="Назва дошки"
          />
        </div>
        <div className="modal__content__actions">
          <button className="button__add" onClick={handleCreateBoard} disabled={!isTitleValid}>
            Створити
          </button>
          <button className="button__cancel" onClick={() => setShowModal(false)}>
            Скасувати
          </button>
        </div>
      </Modal>
    </>
  );
}
