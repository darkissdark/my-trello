import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ICard } from '../../../../common/interfaces/ICard';
import api from '../../../../api/request';
import './cardDetails.scss';
import { IList, IUser } from '../../../../common/interfaces/IList';
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [cardUsers, setCardUsers] = useState<IUser[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [showMoveCardDropdown, setShowMoveCardDropdown] = useState(false);
  const [lists, setLists] = useState<IList[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  const currentUserId = currentUser?.id;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditingTitle) {
          setTitle(card.title);
          setIsEditingTitle(false);
        }

        if (isEditingDescription) {
          setDescription(card.description || '');
          setIsEditingDescription(false);
        }

        if (showMoveCardDropdown) {
          setShowMoveCardDropdown(false);
        }

        if (!isEditingTitle && !isEditingDescription && !showMoveCardDropdown) {
          dispatch(closeModal());
          navigate(`/board/${boardId}`);
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        dispatch(closeModal());
        navigate(`/board/${boardId}`);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    boardId,
    card.title,
    card.description,
    dispatch,
    navigate,
    isEditingTitle,
    isEditingDescription,
    showMoveCardDropdown,
  ]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await api.get(`/board/${boardId}`);
        setLists(response.data.lists || []);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    const fetchUsers = async () => {
      if (card.users && card.users.length > 0 && currentUser) {
        const usersData = card.users.map((userId) => ({
          id: userId,
          email: currentUser.email || 'no email',
          username: currentUser.username || 'no username',
        }));
        setCardUsers(usersData);
      }
    };

    fetchLists();
    fetchUsers();
  }, [boardId, card.users, currentUser]);

  const handleTitleUpdate = async () => {
    if (title.trim() === card.title || !title.trim()) {
      setTitle(card.title);
      setIsEditingTitle(false);
      return;
    }

    try {
      const response = await api.put(`/board/${boardId}/card/${card.id}`, {
        title: title.trim(),
        description: card.description || '',
        list_id: card.list_id,
      });

      if (response.data.result === 'Updated') {
        onCardUpdated();
        setIsEditingTitle(false);
      }
    } catch (error) {
      console.error('Error updating card title:', error);
      setTitle(card.title);
    }
  };

  const handleDescriptionUpdate = async () => {
    if (description.trim() === card.description) {
      setIsEditingDescription(false);
      return;
    }

    try {
      const response = await api.put(`/board/${boardId}/card/${card.id}`, {
        title: card.title,
        description: description.trim(),
        list_id: card.list_id,
      });

      if (response.data.result === 'Updated') {
        onCardUpdated();
        setIsEditingDescription(false);
      }
    } catch (error) {
      console.error('Error updating card description:', error);
      setDescription(card.description || '');
    }
  };

  const handleJoinCard = async () => {
    if (!currentUser || cardUsers.some((user) => user.id === currentUser.id)) return;

    try {
      const response = await api.put(`/board/${boardId}/card/${card.id}/users`, {
        add: [currentUser.id],
      });

      if (response.data.result === 'Updated') {
        setCardUsers([...cardUsers, currentUser]);
        onCardUpdated();
      }
    } catch (error) {
      console.error('Error joining card:', error);
    }
  };

  const handleLeaveCard = async () => {
    if (!currentUser || !cardUsers.some((user) => user.id === currentUser.id)) return;

    try {
      const response = await api.put(`/board/${boardId}/card/${card.id}/users`, {
        remove: [currentUser.id],
      });

      if (response.data.result === 'Updated') {
        setCardUsers(cardUsers.filter((user) => user.id !== currentUser.id));
        onCardUpdated();
      }
    } catch (error) {
      console.error('Error leaving card:', error);
    }
  };

  const handleCopyCard = async () => {
    console.log('Copying card:', card);
    try {
      const response = await api.post(`/board/${boardId}/card`, {
        title: `${card.title} - Copy`,
        list_id: card.list_id,
        position: card.position + 1,
        description: card.description,
        custom: card.custom,
      });

      if (response.data.result === 'Created') {
        onCardUpdated();
        navigate(`/board/${boardId}`);
        iziToast.success({ title: 'Картку скопійовано', position: 'topRight' });
      }
    } catch (error) {
      console.error('Error copying card:', error);
    }
  };

  const handleArchiveCard = async () => {
    try {
      const response = await api.delete(`/board/${boardId}/card/${card.id}`);

      if (response.data.result === 'Deleted') {
        onCardUpdated();
        navigate(`/board/${boardId}`);
        iziToast.success({ title: 'Картку архівовано', position: 'topRight' });
      }
    } catch (error) {
      console.error('Error archiving card:', error);
    }
  };

  const handleMoveCard = async (newListId: number) => {
    try {
      const response = await api.put(`/board/${boardId}/card`, [
        {
          id: card.id,
          list_id: newListId,
          position: lists.find((list) => list.id === newListId)?.cards.length || 0,
        },
      ]);

      if (response.data.result === 'Updated') {
        onCardUpdated();
        dispatch(openModal({ ...card, list_id: newListId }));
        iziToast.success({ title: 'Картку переміщено', position: 'topRight' });
      }
    } catch (error) {
      console.error('Error moving card:', error);
    }
    setShowMoveCardDropdown(false);
  };

  const handleClose = () => {
    dispatch(closeModal());
    navigate(`/board/${boardId}`);
  };

  return (
    <div className="card-details-overlay">
      <div className="card-details-modal" ref={modalRef}>
        <button className="card-details-close" onClick={handleClose}>
          ×
        </button>
        <div className="card-details-content">
          <div className="card-details-title">
            <BoardNameInput
              as="textarea"
              value={title}
              onChange={setTitle}
              onBlur={handleTitleUpdate}
              onSubmit={handleTitleUpdate}
              placeholder="Назва картки"
              autoFocus={false}
            />
          </div>
          <div>
            В колонці:
            {lists.length === 0
              ? 'Завантаження...'
              : lists.find((list) => list.id === card.list_id)?.title || 'Невідомо'}
          </div>
          <div className="card-details-participants">
            <h3>Учасники</h3>
            <div className="card-details-participant-list">
              {cardUsers.map((user) => (
                <div key={user.id} className="card-details-participant-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              ))}
              <button
                className="card-details-join-button"
                onClick={cardUsers.some((user) => user.id === currentUserId) ? handleLeaveCard : handleJoinCard}
              >
                {cardUsers.some((user) => user.id === currentUserId) ? 'Покинути' : 'Приєднатися'}
              </button>
            </div>
          </div>
          <div className="card-details-description">
            <h3>Опис</h3>
            <BoardNameInput
              value={description}
              onChange={setDescription}
              onBlur={handleDescriptionUpdate}
              placeholder="Додайте опис..."
              as="textarea"
              disableValidation={true}
            />
          </div>
        </div>

        <div className="card-details-actions">
          <h3>Дії</h3>
          <button onClick={handleCopyCard} className="card-details-action-button">
            Копіювати
          </button>
          {lists.filter((list) => list.id !== card.list_id).length > 0 && (
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
                    .filter((list) => list.id !== card.list_id)
                    .map((list) => (
                      <button key={list.id} onClick={() => handleMoveCard(list.id)}>
                        {list.title}
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
  );
}
