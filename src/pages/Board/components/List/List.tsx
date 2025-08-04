import { useState, useCallback } from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import { Card } from '../Card/Card';
import { CardSlot } from '../Card/CardSlot';
import { AddCard } from '../Card/AddCard';
import { BoardNameInput } from '../common/BoardNameInput';
import { boardService, UpdateListData, MoveCardData } from '../../../../api/services';
import styles from './List.module.scss';

interface ListProps {
  id: number;
  boardId: string;
  title: string;
  cards: ICard[];
  onListUpdated: () => void;
}

export const List = ({ id, boardId, title, cards, onListUpdated }: ListProps) => {
  const [listTitle, setListTitle] = useState(title);
  const [dragOverCardId, setDragOverCardId] = useState<number | null>(null);

  const sortedCards = cards.toSorted((a, b) => a.position - b.position);

  const handleUpdateTitle = useCallback(async () => {
    if (listTitle.trim() === title) return;

    try {
      const listData: UpdateListData = { title: listTitle };
      await boardService.updateList(boardId, id, listData);
      onListUpdated();
    } catch (error) {
      console.error('Error updating list title:', error);
    }
  }, [listTitle, title, boardId, id, onListUpdated]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = e.currentTarget;
    const y = e.clientY - container.getBoundingClientRect().top;

    if (y > container.clientHeight - 50) {
      setDragOverCardId(cards.length);
      return;
    }

    const cardElements = container.getElementsByClassName(styles.card);
    for (let i = 0; i < cardElements.length; i++) {
      const cardMiddle = cardElements[i].getBoundingClientRect().top + cardElements[i].clientHeight / 2;
      if (e.clientY < cardMiddle) {
        setDragOverCardId(i);
        break;
      }
    }
  };

  const handleDragLeave = () => setDragOverCardId(null);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cardData = JSON.parse(e.dataTransfer.getData('text/plain')) as ICard;

    if (cardData.list_id === id && dragOverCardId === null) {
      return;
    }

    const updates: MoveCardData[] = [
      {
        id: cardData.id,
        list_id: id,
        position: dragOverCardId ?? cards.length,
      },
    ];

    if (cardData.list_id === id) {
      const oldPos = cardData.position;
      const newPos = dragOverCardId ?? cards.length;

      cards.forEach((card) => {
        if (card.id !== cardData.id) {
          const pos = card.position;
          if (oldPos < newPos && pos > oldPos && pos <= newPos) {
            updates.push({ id: card.id, list_id: id, position: pos - 1 });
          } else if (oldPos > newPos && pos >= newPos && pos < oldPos) {
            updates.push({ id: card.id, list_id: id, position: pos + 1 });
          }
        }
      });
    }

    try {
      await boardService.moveCards(boardId, updates);
      onListUpdated();
    } catch (error) {
      console.error('Error updating card position:', error);
    } finally {
      setDragOverCardId(null);
    }
  };

  return (
    <section className={styles.list}>
      <BoardNameInput
        additionalClassName={styles.listTitle}
        as="textarea"
        value={listTitle}
        onChange={setListTitle}
        onSubmit={handleUpdateTitle}
        onBlur={handleUpdateTitle}
        onCancel={() => setListTitle(title)}
      />

      <div className={styles.listCards} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {sortedCards.map((card, index) => (
          <div key={`card-container-${card.id}`}>
            {dragOverCardId === index && <CardSlot key={`slot-${index}`} position={index} />}
            <Card key={card.id} card={card} boardId={boardId} listId={id} />
          </div>
        ))}
        {dragOverCardId === cards.length && <CardSlot key={`slot-${cards.length}`} position={cards.length} />}
      </div>

      <AddCard listId={id} boardId={boardId} position={cards.length} onCardAdded={onListUpdated} />
    </section>
  );
};
