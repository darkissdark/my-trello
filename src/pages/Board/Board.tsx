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
  const [originalTitle, setOriginalTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(true);

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const { isOpen } = useSelector((state: RootState) => state.modal);

  useEffect(() => {
    if (board && board.title) {
      setTitle(board.title);
      setOriginalTitle(board.title);
    }
  }, [board]);

  useEffect(() => {
    fetchBoard(true);
  }, [fetchBoard]);

  const card = useMemo(() => {
    return lists.flatMap((list) => list.cards).find((card) => String(card.id) === String(cardId));
  }, [lists, cardId]);

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
    const trimmedTitle = title.trim();
    if (trimmedTitle && isTitleValid) {
      await updateBoardTitle(trimmedTitle);
      setOriginalTitle(trimmedTitle);
    } else if (!trimmedTitle) {
      setTitle(originalTitle);
    }
  };

  const handleTitleCancel = () => {
    setTitle(originalTitle);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleBackgroundChange = async (imageUrl: string[]) => {
    await updateBoardBackground(imageUrl);
    await fetchBoard();
  };

  const handleAddList = async (listTitle: string) => {
    await createList({ title: listTitle, position: lists.length });
  };

  return (
    <>
      {isLoading && !isOpen && <Loader />}
      {isAuthenticated && <LogoutButton />}
      <BoardHeader
        title={title}
        onTitleChange={setTitle}
        onTitleUpdate={handleTitleUpdate}
        onTitleCancel={handleTitleCancel}
        onValidationChange={setIsTitleValid}
      />

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
