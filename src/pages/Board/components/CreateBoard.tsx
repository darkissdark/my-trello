import { useState } from 'react';
import { Modal } from '../../../components/Modal/Modal';
import api from '../../../api/request';

interface CreateBoardProps {
  onCardCreated: () => void;
}

export function CreateBoard({ onCardCreated }: CreateBoardProps) {
  const [showModal, setShowModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const boardEndpoint = '/board';

  const validateTitle = (title: string): boolean => {
    if (!title.trim()) {
      setTitleError('Назва дошки не може бути порожньою');
      return false;
    }

    const regex = /^[a-zA-Zа-яА-ЯґҐєЄіІїЇ0-9 ._-]+$/;
    if (!regex.test(title)) {
      setTitleError('Назва може містити тільки літери, цифри, пробіли, тире, крапки та нижні підкреслення');
      return false;
    }

    setTitleError('');
    return true;
  };

  const handleCreateBoard = async () => {
    if (!validateTitle(newBoardTitle)) return;

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewBoardTitle(value);
    if (value) {
      validateTitle(value);
    } else {
      setTitleError('');
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
          <input
            type="text"
            placeholder="Назва дошки"
            value={newBoardTitle}
            onChange={handleTitleChange}
            className={titleError ? 'error' : ''}
          />
          {titleError && <div className="modal__content__error">{titleError}</div>}
        </div>
        <div className="modal__content__actions">
          <button className="button__add" onClick={handleCreateBoard} disabled={!newBoardTitle || !!titleError}>
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
