import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/request';
import './board.scss';
import { IBoard } from '../../common/interfaces/IBoard';
import { ICard } from '../../common/interfaces/ICard';
import { List } from './components/List/List';
import { IList } from '../../common/interfaces/IList';
import { BoardNameInput } from './components/common/BoardNameInput';
import { ActionModal } from '../../components/ActionModal/ActionModal';
import { BackgroundSettings } from '../../components/BackgroundSettings/BackgroundSettings';
import { CardDetails } from './components/Card/CardDetails';

export function Board() {
  const { boardId, cardId } = useParams();
  const [board, setBoard] = useState<IBoard | null>(null);
  const [title, setTitle] = useState('');
  const [lists, setLists] = useState<IList[]>([]);
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);

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

  useEffect(() => {
    if (cardId && lists.length > 0) {
      for (const list of lists) {
        const card = list.cards.find((c) => c.id === parseInt(cardId));
        if (card) {
          setSelectedCard({
            ...card,
            list_id: list.id,
          });
          break;
        }
      }
    } else {
      setSelectedCard(null);
    }
  }, [cardId, lists]);

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

      {selectedCard && <CardDetails card={selectedCard} boardId={boardId!} onCardUpdated={fetchBoard} />}
    </>
  );
}
