import { useState, useEffect } from 'react';
import './home.scss';
import { Link } from 'react-router-dom';
import api from '../../api/request';
import { IBoard } from '../../common/interfaces/IBoard';
import { CreateBoard } from '../Board/components/CreateBoard';

export function Home() {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const boardEndpoint = '/board';

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const { data } = await api.get(boardEndpoint);
      setBoards(data.boards);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  return (
    <>
      <header>
        <h1>Мої дошки</h1>
      </header>
      <main className="boards">
        {boards?.length > 0 &&
          boards.map((board) => (
            <Link key={board.id} to={`/board/${board.id}`} className="boards__card">
              {board?.custom?.background && (
                <span className="boards__card__line" style={{ background: board.custom.background[1] }}></span>
              )}
              {board.title}
            </Link>
          ))}

        <CreateBoard onCardCreated={fetchBoards} />
      </main>
    </>
  );
}
