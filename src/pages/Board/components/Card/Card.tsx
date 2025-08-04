import { useNavigate } from 'react-router-dom';
import styles from './Card.module.scss';
import { ICard } from '../../../../common/interfaces/ICard';

interface CardProps {
  card: ICard;
  boardId: string;
  listId: number;
}

export function Card({ card, boardId, listId }: CardProps) {
  const navigate = useNavigate();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const cardWithListId = { ...card, list_id: listId };
    e.dataTransfer.setData('text/plain', JSON.stringify(cardWithListId));
    e.currentTarget.classList.add(styles.cardDragging);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove(styles.cardDragging);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    navigate(`/board/${boardId}/card/${card.id}`);
  };

  return (
    <div className={styles.card} draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} onClick={handleCardClick}>
      <p className={styles.cardTitle}>{card.title}</p>
    </div>
  );
}
