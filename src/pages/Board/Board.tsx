import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { List } from './components/List/List';
import './board.scss';

export function Board() {
  const { boardId } = useParams();
  const [title] = useState('Моя тестова дошка');
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

  return (
    <>
      <header>
        <h1>
          {title} (ID: {boardId})
        </h1>
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
