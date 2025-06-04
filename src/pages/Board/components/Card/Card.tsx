import { useState } from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import { BoardNameInput } from '../common/BoardNameInput';
import api from '../../../../api/request';
import './card.scss';

interface CardProps {
  card: ICard;
  boardId: string;
  onCardUpdated: () => void;
}

export function Card({ card, boardId, onCardUpdated }: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [cardTitle, setCardTitle] = useState(card.title);

  const handleUpdateTitle = async () => {
    if (cardTitle.trim() === card.title) {
      setIsEditing(false);
      return;
    }
    try {
      await api.put(`/board/${boardId}/card/${card.id}`, {
        title: cardTitle,
      });
      onCardUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating card title:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(card));
    e.currentTarget.classList.add('card--dragging');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('card--dragging');
  };

  return (
    <div
      className="card"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {isEditing ? (
        <BoardNameInput
          value={cardTitle}
          onChange={setCardTitle}
          onSubmit={handleUpdateTitle}
          onBlur={handleUpdateTitle}
          onCancel={() => {
            setIsEditing(false);
            setCardTitle(card.title);
          }}
          autoFocus
        />
      ) : (
        <p className="card__title" onClick={() => setIsEditing(true)}>
          {card.title}
        </p>
      )}
    </div>
  );
}
