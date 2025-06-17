import { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../api/request';
import './board.scss';
import { IBoard } from '../../common/interfaces/IBoard';
import { List } from './components/List/List';
import { IList } from '../../common/interfaces/IList';
import { BoardNameInput } from './components/common/BoardNameInput';
import { ActionModal } from '../../components/ActionModal/ActionModal';
import { BackgroundSettings } from '../../components/BackgroundSettings/BackgroundSettings';
import { RootState } from '../../store';

const CardDetails = lazy(() => import('./components/Card/CardDetails').then(module => ({ default: module.CardDetails })));

export function Board() {
  const { boardId } = useParams();
  const [board, setBoard] = useState<IBoard | null>(null);
  const [title, setTitle] = useState('');
  const [lists, setLists] = useState<IList[]>([]);
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [currentUserId] = useState<number>(1);

  const { isOpen, card: selectedCard } = useSelector((state: RootState) => state.modal);

  const handleBackgroundChange = async (imageUrl: string[]) => {
    if (!board) return;

    try {
      const updatedBoard = { ...board, custom: { ...board.custom, background: imageUrl } };
      await api.put(`/board/${boardId}`, { custom: updatedBoard.custom });
      setBoard(updatedBoard);
    } catch (error) {
      console.error('Error updating background image:', error);
    }
  };

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

  const backgroundStyle = useMemo(() => {
    if (!board?.custom?.background) return {};
    return {
      backgroundImage: `url(${board.custom.background[0]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }, [board?.custom?.background]);

  const updateBoardTitle = async () => {
    if (title.trim() === '' || board?.title === title.trim()) {
      return;
    }

    try {
      await api.put(`/board/${boardId}`, { title });
      setBoard((prev) => (prev ? { ...prev, title } : null));
    } catch (error) {
      console.error('Error updating board title:', error);
    }
  };

  const handleAddList = async () => {
    if (newListTitle.trim() === '') return;

    try {
      await api.post(`/board/${boardId}/list`, { title: newListTitle });
      fetchBoard();
      setShowAddListModal(false);
      setNewListTitle('');
    } catch (error) {
      console.error('Error adding list:', error);
    }
  };

  return (
    <>
      <header className="board__header">
        <BoardNameInput value={title} onChange={setTitle} onSubmit={updateBoardTitle} onBlur={updateBoardTitle} />
      </header>

      <main className="board">
        {lists.map((list) => (
          <List
            key={list.id}
            id={list.id}
            boardId={boardId!}
            title={list.title}
            cards={list.cards}
            onListUpdated={fetchBoard}
          />
        ))}
        <button className="board__add-list list" onClick={() => setShowAddListModal(true)}>
          + Додати список
        </button>

        <BackgroundSettings onBackgroundChange={handleBackgroundChange} />
        <div className="board__background" style={backgroundStyle}></div>
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
          onValidationChange={setIsTitleValid}
          onCancel={() => {
            setShowAddListModal(false);
            setNewListTitle('');
          }}
          autoFocus
        />
      </ActionModal>

      {isOpen && selectedCard && (
        <Suspense fallback={<div className="card-details-loading">Loading...</div>}>
          <CardDetails card={selectedCard} boardId={boardId!} onCardUpdated={fetchBoard} currentUserId={currentUserId} />
        </Suspense>
      )}
    </>
  );
}
