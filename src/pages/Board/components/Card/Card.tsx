import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ICard } from '../../../../common/interfaces/ICard';
import { openModal } from '../../../../store/slices/modalSlice';
import './card.scss';

interface CardProps {
  card: ICard;
  boardId: string;
  listId: number;
}

export function Card({ card, boardId, listId }: CardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(card));
    e.currentTarget.classList.add('card--dragging');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('card--dragging');
  };

  const handleCardClick = (e: React.MouseEvent) => {
    dispatch(openModal({ ...card, list_id: listId }));
    navigate(`/board/${boardId}/card/${card.id}`);
  };

  return (
    <div className="card" draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} onClick={handleCardClick}>
      <p className="card__title">{card.title}</p>
    </div>
  );
}
