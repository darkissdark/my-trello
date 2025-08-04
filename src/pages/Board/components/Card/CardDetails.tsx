import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ICard } from '../../../../common/interfaces/ICard';
import { boardService, UpdateCardData, MoveCardData, UpdateCardUsersData } from '../../../../api/services';
import styles from './CardDetails.module.scss';
import { IList } from '../../../../common/interfaces/IList';
import { IUser } from '../../../../common/interfaces/IUser';
import iziToast from 'izitoast';
import { closeModal, openModal } from '../../../../store/slices/modalSlice';
import { BoardNameInput } from '../common/BoardNameInput';

interface CardDetailsProps {
  card: ICard;
  boardId: string;
  onCardUpdated: () => void;
  currentUser: IUser | null;
}

export function CardDetails({ card, boardId, onCardUpdated, currentUser }: CardDetailsProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [cardUsers, setCardUsers] = useState<IUser[]>([]);
  const [lists, setLists] = useState<IList[]>([]);
  const [showMoveCardDropdown, setShowMoveCardDropdown] = useState(false);

  const isCurrentUserInCard = cardUsers.some((user) => user.id === currentUser?.id);

  const handleClose = useCallback(() => {
    dispatch(closeModal());
    navigate(`/board/${boardId}`);
  }, [dispatch, navigate, boardId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClose]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const board = await boardService.getBoard(boardId);
        setLists(board.lists || []);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    const fetchUsers = () => {
      if (card.users?.length && currentUser) {
        const usersData = card.users.map((id) => ({
          id,
          email: currentUser.email || 'no email',
          username: currentUser.username || 'no username',
        }));
        setCardUsers(usersData);
      }
    };

    fetchLists();
    fetchUsers();
  }, [boardId, card.users, currentUser]);

  const updateCard = async (payload: Partial<ICard>) => {
    try {
      const cardData: UpdateCardData = {
        ...payload,
        list_id: card.list_id,
      };
      await boardService.updateCard(boardId, card.id, cardData);
      onCardUpdated();
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleCopyCard = async () => {
    try {
      await boardService.createCard(boardId, {
        ...card,
        title: `${card.title} - Copy`,
        position: card.position + 1,
      });
      onCardUpdated();
      iziToast.success({ title: 'Card copied', position: 'topRight' });
      handleClose();
    } catch (error) {
      console.error('Error copying card:', error);
    }
  };

  const handleMoveCard = async (listId: number) => {
    try {
      const moveData: MoveCardData[] = [
        {
          id: card.id,
          list_id: listId,
          position: lists.find((l) => l.id === listId)?.cards.length || 0,
        },
      ];
      await boardService.moveCards(boardId, moveData);
      onCardUpdated();
      dispatch(openModal({ ...card, list_id: listId }));
      iziToast.success({ title: 'Card moved', position: 'topRight' });
    } catch (error) {
      console.error('Error moving card:', error);
    }
    setShowMoveCardDropdown(false);
  };

  const handleArchiveCard = async () => {
    try {
      await boardService.deleteCard(boardId, card.id);
      onCardUpdated();
      iziToast.success({ title: 'Card archived', position: 'topRight' });
      handleClose();
    } catch (error) {
      console.error('Error archiving card:', error);
    }
  };

  const toggleCardMembership = async () => {
    if (!currentUser) return;
    const method = isCurrentUserInCard ? 'remove' : 'add';
    try {
      const usersData: UpdateCardUsersData = {
        add: method === 'add' ? [currentUser.id] : [],
        remove: method === 'remove' ? [currentUser.id] : [],
      };
      await boardService.updateCardUsers(boardId, card.id, usersData);
      setCardUsers((prev) =>
        method === 'add' ? [...prev, currentUser] : prev.filter((user) => user.id !== currentUser.id)
      );
      onCardUpdated();
    } catch (error) {
      console.error(`Error ${method === 'add' ? 'joining' : 'leaving'} card:`, error);
    }
  };

  return (
    <div className={styles.cardDetailsOverlay}>
      <div className={styles.cardDetailsModal} ref={modalRef}>
        <button className={styles.cardDetailsClose} onClick={handleClose}>
          ×
        </button>
        <div className={styles.mobileScrollWrapper}>
          <div className={styles.cardDetailsContent}>
            <div className={styles.cardDetailsTitle}>
              <BoardNameInput
                as="textarea"
                value={title}
                additionalClassName={styles.cardDetailsTitleInput}
                onChange={setTitle}
                onBlur={() => updateCard({ title })}
                onSubmit={() => updateCard({ title })}
                placeholder="Card title"
              />
            </div>
            <div className={styles.cardDetailsScrollWrapper}>
              <div>
                In column: {lists.length ? lists.find((l) => l.id === card.list_id)?.title || 'Unknown' : 'Loading...'}
              </div>
              <div className={styles.cardDetailsParticipants}>
                <h3>Participants</h3>
                <div className={styles.cardDetailsParticipantList}>
                  {cardUsers.map((u) => (
                    <div key={u.id} className={styles.cardDetailsParticipantAvatar}>
                      {u.username[0].toUpperCase()}
                    </div>
                  ))}
                  <button onClick={toggleCardMembership} className={styles.cardDetailsJoinButton}>
                    {isCurrentUserInCard ? 'Leave' : 'Join'}
                  </button>
                </div>
              </div>
              <div className={styles.cardDetailsDescription}>
                <h3>Description</h3>
                <BoardNameInput
                  value={description}
                  onChange={setDescription}
                  additionalClassName={styles.cardDetailsTitleInput}
                  onBlur={() => updateCard({ description })}
                  placeholder="Add a description..."
                  as="textarea"
                  disableValidation
                />
              </div>
            </div>
          </div>
          <div className={styles.cardDetailsActions}>
            <h3>Actions</h3>
            <button onClick={handleCopyCard} className={styles.cardDetailsActionButton}>
              Copy
            </button>
            {lists.length > 1 && (
              <div className={styles.cardDetailsMoveButtonWrapper}>
                <button
                  onClick={() => setShowMoveCardDropdown(!showMoveCardDropdown)}
                  className={styles.cardDetailsActionButton}
                >
                  Move
                </button>
                {showMoveCardDropdown && (
                  <div className={styles.cardDetailsMoveDropdown}>
                    {lists
                      .filter((l) => l.id !== card.list_id)
                      .map((l) => (
                        <button key={l.id} onClick={() => handleMoveCard(l.id)}>
                          {l.title}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}
            <button
              onClick={handleArchiveCard}
              className={`${styles.cardDetailsActionButton} ${styles.cardDetailsActionButtonArchive}`}
            >
              Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
