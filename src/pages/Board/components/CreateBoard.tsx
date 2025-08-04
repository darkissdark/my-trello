import { useState } from 'react';
import { boardService, CreateBoardData } from '../../../api/services';
import { LazyModal } from '../../../components/Modal/LazyModal';
import styles from './CreateBoard.module.scss';
import React from 'react';

const CreateBoardModalContent = React.lazy(() => import('./CreateBoardModalContent'));

interface CreateBoardProps {
  onCardCreated: () => void;
}

export function CreateBoard({ onCardCreated }: CreateBoardProps) {
  const [showModal, setShowModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);

  const handleCreateBoard = async () => {
    const boardData: CreateBoardData = {
      title: newBoardTitle,
    };

    try {
      await boardService.createBoard(boardData);
      onCardCreated();
      setNewBoardTitle('');
      setShowModal(false);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  return (
    <>
      <button className={`${styles.boardsCard} ${styles.boardsButton}`} onClick={() => setShowModal(true)}>
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
