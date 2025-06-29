import { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../api/request';
import './board.scss';
import { IBoard } from '../../common/interfaces/IBoard';
import { List } from './components/List/List';
import { IList } from '../../common/interfaces/IList';
import { BoardNameInput } from './components/common/BoardNameInput';
import { BackgroundSettings } from '../../components/BackgroundSettings/BackgroundSettings';
import { RootState } from '../../store';
import { Link } from 'react-router-dom';
import { LazyModal } from '../../components/Modal/LazyModal';
import React from 'react';
import { setLoading } from '../../store/slices/loadingSlice';
import { openModal, closeModal } from '../../store/slices/modalSlice';

const CardDetails = lazy(() =>
  import('./components/Card/CardDetails').then((module) => ({ default: module.CardDetails }))
);
const AddListModalContent = React.lazy(() => import('./components/common/AddListModalContent'));

export function Board() {
  const { boardId, cardId } = useParams();
  const [board, setBoard] = useState<IBoard | null>(null);
  const [title, setTitle] = useState('');
  const [lists, setLists] = useState<IList[]>([]);
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);

  const { isOpen, card: selectedCard } = useSelector((state: RootState) => state.modal);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

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

  const fetchBoard = useCallback(
    async (showLoader: boolean = false) => {
      dispatch(setLoading(showLoader));
      try {
        const { data } = await api.get(`/board/${boardId}`);
        setBoard(data);
        setTitle(data.title);
        setLists(data.lists || []);
      } catch (error) {
        console.error('Error fetching board:', error);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [boardId, dispatch]
  );

  useEffect(() => {
    fetchBoard(true);
  }, [fetchBoard]);

  useEffect(() => {
    if (cardId && lists.length > 0) {
      const card = lists.flatMap((list) => list.cards).find((card) => String(card.id) === String(cardId));
      if (card && (!isOpen || !selectedCard || String(selectedCard.id) !== String(cardId))) {
        dispatch(openModal({ ...card }));
      }
    } else if (!cardId && isOpen) {
      dispatch(closeModal());
    }
  }, [cardId, lists, isOpen, selectedCard, dispatch]);

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
      const position = lists.length;
      await api.post(`/board/${boardId}/list`, { title: newListTitle, position });
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
        <div>
          <Link to={'/'} className="board_back-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="38"
              fill="currentColor"
              className="bi bi-arrow-left"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 1-.5.5H3.707l4.147 4.146a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 0 1 .708.708L3.707 7.5H14.5a.5.5 0 0 1 .5.5z"
              />
            </svg>
          </Link>
        </div>
        <BoardNameInput
          as="textarea"
          value={title}
          onChange={setTitle}
          onSubmit={updateBoardTitle}
          onBlur={updateBoardTitle}
        />
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

        <BackgroundSettings
          onBackgroundChange={handleBackgroundChange}
          currentImageUrl={board?.custom?.background?.[0] ?? ''}
          currentBackgroundColor={board?.custom?.background?.[1] ?? '#ffffff'}
        />
        <div className="board__background" style={backgroundStyle}></div>
      </main>

      <LazyModal
        isOpen={showAddListModal}
        onClose={() => setShowAddListModal(false)}
        component={AddListModalContent}
        componentProps={{
          newListTitle,
          setNewListTitle,
          isTitleValid,
          setIsTitleValid,
          handleAddList,
          onClose: () => setShowAddListModal(false),
        }}
      />

      {isOpen && selectedCard && (
        <Suspense fallback={<div className="card-details-loading">Loading...</div>}>
          <CardDetails card={selectedCard} boardId={boardId!} onCardUpdated={fetchBoard} currentUser={user} />
        </Suspense>
      )}
    </>
  );
}

export default Board;
