import { useState, useEffect } from 'react';
import './home.scss';
import '../../components/Modal/modal.scss';
import { Link } from 'react-router-dom';
import api from '../../api/request';
import { IBoard } from '../../common/interfaces/IBoard';

export function Home() {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const { data } = await api.get('/board');
        setBoards(data);
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };

    fetchBoards();
  }, []);

  const handleCreateBoard = () => {
    if (!newBoardTitle.trim()) return;

    const newBoard = {
      id: Date.now(),
      title: newBoardTitle,
      custom: {
        background: 'blue',
      },
    };

    setBoards((prev = []) => [...prev, newBoard]);
    setNewBoardTitle('');
    setShowModal(false);
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
              <span className="boards__card__line" style={{ background: board.custom.background }}></span>
              {board.title}
            </Link>
          ))}

        <button className="boards__button boards__card" onClick={() => setShowModal(true)}>
          + Додати дошку
        </button>
      </main>

      {showModal && (
        <div className="modal">
          <div className="modal__content">
            <h2>Нова дошка</h2>
            <input
              type="text"
              placeholder="Назва дошки"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
            />
            <div className="modal__content__modal__actions">
              <button className="button__add" onClick={handleCreateBoard}>
                Створити
              </button>
              <button className="button__cancel" onClick={() => setShowModal(false)}>
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
