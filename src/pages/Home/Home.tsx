import { useEffect } from 'react';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import { CreateBoard } from '../Board/components/CreateBoard';
import { useBoards } from '../../hooks/useBoards';
import Loader from '../../components/Loader';
import { LogoutButton } from '../../components/LogoutButton/LogoutButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export function Home() {
  const { boards, fetchBoards } = useBoards();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const { isOpen } = useSelector((state: RootState) => state.modal);

  useEffect(() => {
    fetchBoards(true);
  }, [fetchBoards]);

  return (
    <>
      <header className={styles.boardsHeader}>
        <h1>My Boards</h1>
      </header>
      {isLoading && !isOpen && <Loader />}
      {isAuthenticated && <LogoutButton />}
      <main className={styles.boards}>
        {boards?.length > 0 &&
          boards.map((board) => (
            <Link key={board.id} to={`/board/${board.id}`} className={styles.boardsCard}>
              {board?.custom?.background && (
                <span className={styles.boardsCardLine} style={{ background: board.custom.background[1] }}></span>
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
