import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/request';
import './board.scss';
import { IBoard } from '../../common/interfaces/IBoard';
import { List } from './components/List/List';
import { BoardNameInput } from './components/common/BoardNameInput';

export function Board() {
  const { boardId } = useParams();
  const [board, setBoard] = useState<IBoard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [lists] = useState([
    {
      id: 1,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 2,
      title: 'В процесі',
      cards: [{ id: 4, title: 'подивитися серіал' }],
    },
    {
      id: 3,
      title: 'Зроблено',
      cards: [
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
      ],
    },
  ]);

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  const fetchBoard = async () => {
    try {
      const { data } = await api.get(`/board/${boardId}`);
      setBoard(data);
      setTitle(data.title);
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  };

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
        <button className="board__add-list list">+ Додати список</button>
      </main>
    </>
  );
}
