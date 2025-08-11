import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './Card.module.scss';
import { ICard } from '../../../../common/interfaces/ICard';

interface CardProps {
  card: ICard;
  listId: number;
  onOpenCard: (card: ICard) => void;
}

export function Card({ card, listId, onOpenCard }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
      listId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCardClick = (e: React.MouseEvent) => {
    onOpenCard({ ...card, list_id: listId });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
      onClick={handleCardClick}
      {...attributes}
      {...listeners}
    >
      <p className={styles.cardTitle}>{card.title}</p>
    </div>
  );
}
