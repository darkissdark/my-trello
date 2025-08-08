import styles from './Card.module.scss';
import { ICard } from '../../../../common/interfaces/ICard';

interface CardProps {
  card: ICard;
  boardId: string;
  listId: number;
  onOpenCard: (card: ICard) => void;
}

export function Card({ card, boardId, listId, onOpenCard }: CardProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const cardWithListId = { ...card, list_id: listId };
    e.dataTransfer.setData('text/plain', JSON.stringify(cardWithListId));
    e.currentTarget.classList.add(styles.cardDragging);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove(styles.cardDragging);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    onOpenCard({ ...card, list_id: listId });
  };

  return (
    <div
      className={styles.card}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
    >
      <p className={styles.cardTitle}>{card.title}</p>
    </div>
  );
}
