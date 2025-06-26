import { useState, useEffect, useCallback } from 'react';
import './home.scss';
import { Link } from 'react-router-dom';
import api from '../../api/request';
import { IBoard } from '../../common/interfaces/IBoard';
import { CreateBoard } from '../Board/components/CreateBoard';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/slices/loadingSlice';

export function Home() {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const boardEndpoint = '/board';
  const dispatch = useDispatch();

  const fetchBoards = useCallback(
    async (showLoader: boolean = false) => {
      dispatch(setLoading(showLoader));
      try {
        const { data } = await api.get(boardEndpoint);
        setBoards(data.boards);
      } catch (error) {
        console.error('Error fetching boards:', error);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, boardEndpoint]
  );

  useEffect(() => {
    fetchBoards(true);
  }, [fetchBoards]);

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

export default Home;
