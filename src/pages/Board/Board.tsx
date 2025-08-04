import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openModal, closeModal } from '../../store/slices/modalSlice';
import { useBoard } from '../../hooks/useBoard';
import { BoardHeader } from './components/BoardHeader/BoardHeader';
import { BoardContent } from './components/BoardContent/BoardContent';
import { CardModal } from './components/CardModal/CardModal';
import Loader from '../../components/Loader';
import { LogoutButton } from '../../components/LogoutButton/LogoutButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export function Board() {
  const { boardId, cardId } = useParams();
  const dispatch = useDispatch();

  const { board, lists, fetchBoard, updateBoardTitle, updateBoardBackground, createList } = useBoard(boardId!);

  const [title, setTitle] = useState('');

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const { isOpen } = useSelector((state: RootState) => state.modal);

  // Оновлюємо title коли board змінюється
  useEffect(() => {
    if (board) {
      setTitle(board.title);
    }
  }, [board]);

  // Завантажуємо дошку при монтуванні
  useEffect(() => {
    fetchBoard(true);
  }, [fetchBoard]);

  // Знаходимо картку за cardId
  const card = useMemo(() => {
    return lists.flatMap((list) => list.cards).find((card) => String(card.id) === String(cardId));
  }, [lists, cardId]);

  // Відкриваємо модальне вікно картки якщо є cardId
  useEffect(() => {
    if (cardId && lists.length > 0) {
      if (card) {
        const listContainingCard = lists.find((list) => list.cards.some((c) => String(c.id) === String(cardId)));
        if (listContainingCard) {
          dispatch(openModal({ ...card, list_id: listContainingCard.id }));
        }
      }
    } else {
      dispatch(closeModal());
    }
  }, [cardId, card, lists, dispatch]);

  const handleTitleUpdate = async () => {
    await updateBoardTitle(title);
  };

  const handleBackgroundChange = async (imageUrl: string[]) => {
    await updateBoardBackground(imageUrl);
  };

  const handleAddList = async (listTitle: string) => {
    await createList({ title: listTitle, position: lists.length });
  };

  return (
    <>
      {isLoading && !isOpen && <Loader />}
      {isAuthenticated && <LogoutButton />}
      <BoardHeader title={title} onTitleChange={setTitle} onTitleUpdate={handleTitleUpdate} />

      <BoardContent
        lists={lists}
        boardId={boardId!}
        onListUpdated={fetchBoard}
        onBackgroundChange={handleBackgroundChange}
        currentBackgroundImage={board?.custom?.background?.[0]}
        currentBackgroundColor={board?.custom?.background?.[1]}
        onAddList={handleAddList}
      />

      <CardModal boardId={boardId!} onCardUpdated={fetchBoard} />
    </>
  );
}

export default Board;
