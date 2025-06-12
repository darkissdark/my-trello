import { useNavigate } from 'react-router-dom';
import { ICard } from '../../../../common/interfaces/ICard';
import './card.scss';

interface CardProps {
  card: ICard;
  boardId: string;
}

export function Card({ card, boardId }: CardProps) {
  const navigate = useNavigate();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(card));
    e.currentTarget.classList.add('card--dragging');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('card--dragging');
  };

  const handleCardClick = (e: React.MouseEvent) => {
    navigate(`/board/${boardId}/card/${card.id}`);
  };

  return (
    <div className="card" draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} onClick={handleCardClick}>
      <p className="card__title">{card.title}</p>
    </div>
  );
}
