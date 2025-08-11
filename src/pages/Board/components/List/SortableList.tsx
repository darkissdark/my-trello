import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ICard } from '../../../../common/interfaces/ICard';
import { Card } from '../Card/Card';
import styles from './List.module.scss';

interface SortableListProps {
  cards: ICard[];
  listId: number;
  boardId: string;
  dragOverInfo: {
    cardId: number;
    targetListId: number;
    position: number;
  } | null;
  onOpenCard: (card: ICard) => void;
  onCardsReordered: () => void;
}

export function SortableList({
  cards,
  listId,
  boardId,
  dragOverInfo,
  onOpenCard,
  onCardsReordered,
}: SortableListProps) {
  const sortedCards = cards.toSorted((a, b) => a.position - b.position);

  const isTargetList = dragOverInfo?.targetListId === listId;
  const targetPosition = dragOverInfo?.position ?? -1;

  const renderCards = () => {
    if (!isTargetList || targetPosition === -1) {
      return sortedCards.map((card) => (
        <Card
          key={card.id}
          card={card}
          boardId={boardId}
          listId={listId}
          onOpenCard={onOpenCard}
          onCardMoved={onCardsReordered}
        />
      ));
    }

    const result = [];

    for (let i = 0; i < targetPosition && i < sortedCards.length; i++) {
      const card = sortedCards[i];
      result.push(
        <Card
          key={card.id}
          card={card}
          boardId={boardId}
          listId={listId}
          onOpenCard={onOpenCard}
          onCardMoved={onCardsReordered}
        />
      );
    }

    result.push(
      <div key="preview" className={styles.cardPreview}>
        <div className={styles.cardPreviewContent}>
          <p>Drop card here</p>
        </div>
      </div>
    );

    for (let i = targetPosition; i < sortedCards.length; i++) {
      const card = sortedCards[i];
      result.push(
        <Card
          key={card.id}
          card={card}
          boardId={boardId}
          listId={listId}
          onOpenCard={onOpenCard}
          onCardMoved={onCardsReordered}
        />
      );
    }

    return result;
  };

  return (
    <div className={styles.listCards}>
      <SortableContext items={sortedCards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        {renderCards()}
      </SortableContext>
    </div>
  );
}
