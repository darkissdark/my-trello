import { useState } from 'react';
import './home.scss';
import { Link } from 'react-router-dom';

export function Home() {
  const [boards] = useState([
    { id: 1, title: 'покупки', custom: { background: 'red' } },
    { id: 2, title: 'підготовка до весілля', custom: { background: 'green' } },
    { id: 3, title: 'розробка інтернет-магазину', custom: { background: 'blue' } },
    { id: 4, title: 'курс по просуванню у соцмережах', custom: { background: 'grey' } },
  ]);

  return (
    <>
      <header>
        <h1>Мої дошки</h1>
      </header>
      <main className="boards">
        {boards.map((board) => (
          <Link key={board.id} to={`/board/${board.id}`} className="boards__card">
            <span className="boards__card__line" style={{ background: board.custom.background }}></span>
            {board.title}
          </Link>
        ))}
        <button className="boards__button boards__card">+ Додати список</button>
      </main>
    </>
  );
}
