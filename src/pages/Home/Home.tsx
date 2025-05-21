import { useState, useEffect } from 'react';
import './home.scss';
import { Link } from 'react-router-dom';
import api from '../../api/request';

export function Home() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const { data } = await api.get('/boards');
        setBoards(data);
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <>
      <header>
        <h1>Мої дошки</h1>
      </header>
      <main className="boards">
        {/* {boards.map((board) => (
          <Link key={board.id} to={`/board/${board.id}`} className="boards__card">
            <span className="boards__card__line" style={{ background: board.custom.background }}></span>
            {board.title}
          </Link>
        ))} */}
        <button className="boards__button boards__card">+ Додати список</button>
      </main>
    </>
  );
}
