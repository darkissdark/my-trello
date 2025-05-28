import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/request';
import './board.scss';
import { IBoard } from '../../common/interfaces/IBoard';
import { List } from './components/List/List';
import { IList } from '../../common/interfaces/IList';
import { BoardNameInput } from './components/common/BoardNameInput';
import { ActionModal } from '../../components/ActionModal/ActionModal';

export function Board() {
  const { boardId } = useParams();
  const [board, setBoard] = useState<IBoard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [lists, setLists] = useState<IList[]>([]);
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);

  const fetchBoard = useCallback(async () => {
    try {
      const { data } = await api.get(`/board/${boardId}`);
      setBoard(data);
      setTitle(data.title);
      setLists(data.lists || []);
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const updateBoardTitle = async () => {
    try {
      await api.put(`/board/${boardId}`, {
        title,
        custom: board?.custom,
      });
      await fetchBoard();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleAddList = async () => {
    try {
      await api.post(`/board/${boardId}/list`, {
        title: newListTitle,
        position: lists.length,
      });
      setNewListTitle('');
      setShowAddListModal(false);
      await fetchBoard();
    } catch (error) {
      console.error('Error adding list:', error);
    }
  };

  return (
    <>
      <header className="board__header">
        {isEditing ? (
          <BoardNameInput
            value={title}
            onChange={setTitle}
            onSubmit={updateBoardTitle}
            onBlur={updateBoardTitle}
            onCancel={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <h1 onClick={() => setIsEditing(true)}>{board?.title}</h1>
        )}
      </header>

      <main className="board">
        {lists.map((list) => (
          <List key={list.id} title={list.title} cards={list.cards} />
        ))}
        <button className="board__add-list list" onClick={() => setShowAddListModal(true)}>
          + Додати список
        </button>
      </main>

      <ActionModal
        isOpen={showAddListModal}
        onClose={() => setShowAddListModal(false)}
        title="Новий список"
        primaryButtonText="Додати"
        onPrimaryAction={handleAddList}
        onSecondaryAction={() => {
          setShowAddListModal(false);
          setNewListTitle('');
        }}
        isPrimaryButtonDisabled={!isTitleValid}
      >
        <BoardNameInput
          value={newListTitle}
          onChange={setNewListTitle}
          onSubmit={handleAddList}
          onBlur={() => setShowAddListModal(false)}
          onValidationChange={setIsTitleValid}
          onCancel={() => {
            setShowAddListModal(false);
            setNewListTitle('');
          }}
          autoFocus
        />
      </ActionModal>
    </>
  );
}
