import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICard } from '../../../../common/interfaces/ICard';
import api from '../../../../api/request';
import './cardDetails.scss';
import { IList, IUser } from '../../../../common/interfaces/IList';
import iziToast from 'izitoast';

interface CardDetailsProps {
  card: ICard;
  boardId: string;
  onCardUpdated: () => void;
  currentUserId: number;
}

export function CardDetails({ card, boardId, onCardUpdated, currentUserId }: CardDetailsProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [cardUsers, setCardUsers] = useState<IUser[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [showMoveCardDropdown, setShowMoveCardDropdown] = useState(false);
  const [lists, setLists] = useState<IList[]>([]);
  const [selectedColor, setSelectedColor] = useState(card.color || '');
  const modalRef = useRef<HTMLDivElement>(null);

  const availableColors = ['#F44336', '#4CAF50', '#2196F3']; // Red, Green, Blue

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditingTitle || isEditingDescription || showMoveCardDropdown) {
          setTitle(card.title);
          setDescription(card.description || '');
          setIsEditingTitle(false);
          setIsEditingDescription(false);
          setShowMoveCardDropdown(false);
        } else {
          navigate(`/board/${boardId}`);
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        navigate(`/board/${boardId}`);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [boardId, card.title, card.description, isEditingTitle, isEditingDescription, showMoveCardDropdown, navigate]);

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
      if (card.users && card.users.length > 0) {
        try {
          const usersData = await Promise.all(card.users.map((userId) => api.get(`/board/${boardId}/user/${userId}`)));
          setCardUsers(usersData.map((res) => res.data));
        } catch (error) {
          console.error('Error fetching card users:', error);
        }
      }
    };

    fetchLists();
    fetchUsers();
  }, [boardId, card.users]);

  const handleTitleUpdate = async () => {
    if (title.trim() === '') {
      setTitle(card.title);
      setIsEditingTitle(false);
      return;
    }

    if (title.trim() === card.title) {
      setIsEditingTitle(false);
      return;
    }

    try {
      const response = await api.put(`/board/${boardId}/card/${card.id}`, {
        title: title.trim(),
        description: card.description || '',
        list_id: card.list_id,
        color: selectedColor,
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
        color: selectedColor,
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

  const handleColorUpdate = async (color: string) => {
    try {
      const response = await api.put(`/board/${boardId}/card/${card.id}`, {
        color: color,
      });

      if (response.data.result === 'Updated') {
        setSelectedColor(color);
        onCardUpdated();
      }
    } catch (error) {
      console.error('Error updating card color:', error);
    }
  };

  const handleJoinCard = async () => {
    if (cardUsers.some((user) => user.id === currentUserId)) {
      return;
    }

    try {
      const response = await api.put(`/board/${boardId}/card/${card.id}/users`, {
        add: [currentUserId],
      });

      if (response.data.result === 'Updated') {
        const userResponse = await api.get(`/board/${boardId}/user/${currentUserId}`);
        setCardUsers([...cardUsers, userResponse.data]);
        onCardUpdated();
      }
    } catch (error) {
      console.error('Error joining card:', error);
    }
  };

  const handleCopyCard = async () => {
    try {
      const response = await api.post(`/board/${boardId}/card`, {
        title: `${card.title} (Copy)`,
        list_id: card.list_id,
        position: card.position + 1,
        description: card.description,
        color: card.color,
        custom: card.custom,
      });

      if (response.data.result === 'Created') {
        onCardUpdated();
        navigate(`/board/${boardId}`);
        iziToast.success({
          title: 'Картку успішно скопійовано',
          position: 'topRight',
        });
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
        iziToast.success({
          title: 'Картку успішно архівовано',
          position: 'topRight',
        });
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
        navigate(`/board/${boardId}`);
        iziToast.success({
          title: 'Картку успішно переміщено',
          position: 'topRight',
        });
      }
    } catch (error) {
      console.error('Error moving card:', error);
    }
    setShowMoveCardDropdown(false);
  };

  return (
    <div className="card-details-overlay">
      <div className="card-details-modal" ref={modalRef}>
        <button className="card-details-close" onClick={() => navigate(`/board/${boardId}`)}>
          ×
        </button>

        <div className="card-details-content">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleUpdate}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
          />

          <div className="card-details-participants">
            <h3>Учасники</h3>
            <div className="card-details-participant-list">
              {cardUsers.map((user) => (
                <div key={user.id} className="card-details-participant-avatar" style={{ backgroundColor: card.color }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
              ))}
              <button className="card-details-join-button" onClick={handleJoinCard}>
                Приєднатися
              </button>
            </div>
          </div>

          <div className="card-details-color-picker">
            <h3>Колір</h3>
            <div className="card-details-color-options">
              {availableColors.map((color) => (
                <div
                  key={color}
                  className={`card-details-color-circle ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorUpdate(color)}
                ></div>
              ))}
              <div className="card-details-color-circle card-details-color-circle--add">+</div>
            </div>
          </div>

          <div className="card-details-description">
            <h3>Описание</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionUpdate}
              placeholder="Add a more detailed description..."
            />
          </div>
        </div>

        <div className="card-details-actions">
          <h3>Дії</h3>
          <button className="card-details-action-button" onClick={handleCopyCard}>
            Копіювати
          </button>
          <div className="card-details-move-button-wrapper">
            <button
              className="card-details-action-button"
              onClick={() => setShowMoveCardDropdown(!showMoveCardDropdown)}
            >
              Переміщення
            </button>
            {showMoveCardDropdown && (
              <div className="card-details-move-dropdown">
                {lists.map((list) => (
                  <button key={list.id} onClick={() => handleMoveCard(list.id)}>
                    {list.title}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className="card-details-action-button card-details-action-button--archive"
            onClick={handleArchiveCard}
          >
            Архівація
          </button>
        </div>
      </div>
    </div>
  );
}
