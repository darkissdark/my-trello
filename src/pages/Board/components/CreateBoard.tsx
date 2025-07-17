import { useState } from 'react';
import api from '../../../api/request';
import { LazyModal } from '../../../components/Modal/LazyModal';
import React from 'react';

const CreateBoardModalContent = React.lazy(() => import('./CreateBoardModalContent'));

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

      <LazyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        component={CreateBoardModalContent}
        componentProps={{
          newBoardTitle,
          setNewBoardTitle,
          isTitleValid,
          setIsTitleValid,
          handleCreateBoard,
          onClose: () => setShowModal(false),
        }}
      />
    </>
  );
}
