import { useState, useEffect } from 'react';
import './home.scss';
import { Link } from 'react-router-dom';
import api from '../../api/request';
import { IBoard } from '../../common/interfaces/IBoard';
import { Modal } from '../../components/Modal/Modal';

export function Home() {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [titleError, setTitleError] = useState('');

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

  const validateTitle = (title: string): boolean => {
    if (!title.trim()) {
      setTitleError('Назва дошки не може бути порожньою');
      return false;
    }

    const regex = /^[a-zA-Zа-яА-ЯґҐєЄіІїЇ0-9 ._-]+$/;
    if (!regex.test(title)) {
      setTitleError('Назва може містити тільки літери, цифри, пробіли, тире, крапки та нижні підкреслення');
      return false;
    }

    setTitleError('');
    return true;
  };

  const handleCreateBoard = () => {
    if (!validateTitle(newBoardTitle)) return;

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewBoardTitle(value);
    if (value) {
      validateTitle(value);
    } else {
      setTitleError('');
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
              <span className="boards__card__line" style={{ background: board.custom.background }}></span>
              {board.title}
            </Link>
          ))}

        <button className="boards__button boards__card" onClick={() => setShowModal(true)}>
          + Додати дошку
        </button>
      </main>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>Нова дошка</h2>
        <div className="modal__content__input-group">
          <input
            type="text"
            placeholder="Назва дошки"
            value={newBoardTitle}
            onChange={handleTitleChange}
            className={titleError ? 'error' : ''}
          />
          {titleError && <div className="modal__content__error">{titleError}</div>}
        </div>
        <div className="modal__content__actions">
          <button className="button__add" onClick={handleCreateBoard} disabled={!newBoardTitle || !!titleError}>
            Створити
          </button>
          <button className="button__cancel" onClick={() => setShowModal(false)}>
            Скасувати
          </button>
        </div>
      </Modal>
    </>
  );
}
