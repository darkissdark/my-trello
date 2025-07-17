import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ICard } from '../../../../common/interfaces/ICard';
import api from '../../../../api/request';
import './cardDetails.scss';
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
        const res = await api.get(`/board/${boardId}`);
        setLists(res.data.lists || []);
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
      const res = await api.put(`/board/${boardId}/card/${card.id}`, {
        ...card,
        ...payload,
      });
      if (res.data.result === 'Updated') {
        onCardUpdated();
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleCopyCard = async () => {
    try {
      const res = await api.post(`/board/${boardId}/card`, {
        ...card,
        title: `${card.title} - Copy`,
        position: card.position + 1,
      });
      if (res.data.result === 'Created') {
        onCardUpdated();
        iziToast.success({ title: 'Картку скопійовано', position: 'topRight' });
        handleClose();
      }
    } catch (error) {
      console.error('Error copying card:', error);
    }
  };

  const handleMoveCard = async (listId: number) => {
    try {
      const res = await api.put(`/board/${boardId}/card`, [
        {
          id: card.id,
          list_id: listId,
          position: lists.find((l) => l.id === listId)?.cards.length || 0,
        },
      ]);
      if (res.data.result === 'Updated') {
        onCardUpdated();
        dispatch(openModal({ ...card, list_id: listId }));
        iziToast.success({ title: 'Картку переміщено', position: 'topRight' });
      }
    } catch (error) {
      console.error('Error moving card:', error);
    }
    setShowMoveCardDropdown(false);
  };

  const handleArchiveCard = async () => {
    try {
      const res = await api.delete(`/board/${boardId}/card/${card.id}`);
      if (res.data.result === 'Deleted') {
        onCardUpdated();
        iziToast.success({ title: 'Картку архівовано', position: 'topRight' });
        handleClose();
      }
    } catch (error) {
      console.error('Error archiving card:', error);
    }
  };

  const toggleCardMembership = async () => {
    if (!currentUser) return;
    const method = isCurrentUserInCard ? 'remove' : 'add';
    try {
      const res = await api.put(`/board/${boardId}/card/${card.id}/users`, {
        add: method === 'add' ? [currentUser.id] : [],
        remove: method === 'remove' ? [currentUser.id] : [],
      });
      if (res.data.result === 'Updated') {
        setCardUsers((prev) =>
          method === 'add' ? [...prev, currentUser] : prev.filter((user) => user.id !== currentUser.id)
        );
        onCardUpdated();
      }
    } catch (error) {
      console.error(`Error ${method === 'add' ? 'joining' : 'leaving'} card:`, error);
    }
  };

  return (
    <div className="card-details-overlay">
      <div className="card-details-modal" ref={modalRef}>
        <button className="card-details-close" onClick={handleClose}>
          ×
        </button>
        <div className="mobile-scroll-wrapper">
          <div className="card-details-content">
            <div className="card-details-title">
              <BoardNameInput
                as="textarea"
                value={title}
                onChange={setTitle}
                onBlur={() => updateCard({ title })}
                onSubmit={() => updateCard({ title })}
                placeholder="Назва картки"
              />
            </div>
            <div className="card-details-scroll-wrapper">
              <div>
                В колонці:{' '}
                {lists.length ? lists.find((l) => l.id === card.list_id)?.title || 'Невідомо' : 'Завантаження...'}
              </div>
              <div className="card-details-participants">
                <h3>Учасники</h3>
                <div className="card-details-participant-list">
                  {cardUsers.map((u) => (
                    <div key={u.id} className="card-details-participant-avatar">
                      {u.username[0].toUpperCase()}
                    </div>
                  ))}
                  <button onClick={toggleCardMembership} className="card-details-join-button">
                    {isCurrentUserInCard ? 'Покинути' : 'Приєднатися'}
                  </button>
                </div>
              </div>
              <div className="card-details-description">
                <h3>Опис</h3>
                <BoardNameInput
                  value={description}
                  onChange={setDescription}
                  onBlur={() => updateCard({ description })}
                  placeholder="Додайте опис..."
                  as="textarea"
                  disableValidation
                />
              </div>
            </div>
          </div>
          <div className="card-details-actions">
            <h3>Дії</h3>
            <button onClick={handleCopyCard} className="card-details-action-button">
              Копіювати
            </button>
            {lists.length > 1 && (
              <div className="card-details-move-button-wrapper">
                <button
                  onClick={() => setShowMoveCardDropdown(!showMoveCardDropdown)}
                  className="card-details-action-button"
                >
                  Переміщення
                </button>
                {showMoveCardDropdown && (
                  <div className="card-details-move-dropdown">
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
              className="card-details-action-button card-details-action-button--archive"
            >
              Архівувати
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
