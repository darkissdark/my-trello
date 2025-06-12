import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICard } from '../../../../common/interfaces/ICard';
import api from '../../../../api/request';
import './cardDetails.scss';

interface CardDetailsProps {
  card: ICard;
  boardId: string;
  onCardUpdated: () => void;
}

export function CardDetails({ card, boardId, onCardUpdated }: CardDetailsProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditingTitle || isEditingDescription) {
          setTitle(card.title);
          setDescription(card.description || '');
          setIsEditingTitle(false);
          setIsEditingDescription(false);
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
  }, [boardId, card.title, card.description, isEditingTitle, isEditingDescription, navigate]);

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

          <div className="card-details-description">
            <h3>Опис</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionUpdate}
              placeholder="Add a more detailed description..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
