import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ICard } from '../../../../common/interfaces/ICard';
import { Card } from '../Card/Card';
import styles from './List.module.scss';

interface SortableListProps {
  cards: ICard[];
  listId: number;
  boardId: string;
  onOpenCard: (card: ICard) => void;
  onCardsReordered: () => void;
}

export function SortableList({ cards, listId, boardId, onOpenCard, onCardsReordered }: SortableListProps) {
  const sortedCards = cards.toSorted((a, b) => a.position - b.position);

  return (
    <div className={styles.listCards}>
      <SortableContext items={sortedCards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        {sortedCards.map((card) => (
          <Card
            key={card.id}
            card={card}
            boardId={boardId}
            listId={listId}
            onOpenCard={onOpenCard}
            onCardMoved={onCardsReordered}
          />
        ))}
      </SortableContext>
    </div>
  );
}
