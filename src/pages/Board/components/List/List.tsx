import { useState, useRef } from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import { Card } from '../Card/Card';
import { CardSlot } from '../Card/CardSlot';
import { AddCard } from '../Card/AddCard';
import { BoardNameInput } from '../common/BoardNameInput';
import api from '../../../../api/request';
import './list.scss';

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
  const listRef = useRef<HTMLElement>(null);

  const handleUpdateTitle = async () => {
    if (listTitle.trim() === title) {
      return;
    }
    try {
      await api.put(`/board/${boardId}/list/${id}`, {
        title: listTitle,
      });
      onListUpdated();
    } catch (error) {
      console.error('Error updating list title:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cardsContainer = e.currentTarget;
    const rect = cardsContainer.getBoundingClientRect();
    const y = e.clientY - rect.top;

    if (y > rect.height - 50) {
      setDragOverCardId(cards.length);
      return;
    }

    const cardElements = cardsContainer.getElementsByClassName('card');
    for (let i = 0; i < cardElements.length; i++) {
      const cardRect = cardElements[i].getBoundingClientRect();
      const cardMiddle = cardRect.top + cardRect.height / 2;

      if (e.clientY < cardMiddle) {
        setDragOverCardId(i);
        break;
      }
    }
  };

  const handleDragLeave = () => {
    setDragOverCardId(null);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cardData = JSON.parse(e.dataTransfer.getData('text/plain')) as ICard;

    if (cardData.list_id === id && dragOverCardId === null) {
      return;
    }

    try {
      const updatePayload = [
        {
          id: cardData.id,
          list_id: id,
          position: dragOverCardId ?? cards.length,
        },
      ];

      if (cardData.list_id === id) {
        const oldPosition = cardData.position;
        const newPosition = dragOverCardId ?? cards.length;

        cards.forEach((card) => {
          if (card.id !== cardData.id) {
            if (oldPosition < newPosition) {
              if (card.position > oldPosition && card.position <= newPosition) {
                updatePayload.push({
                  id: card.id,
                  list_id: id,
                  position: card.position - 1,
                });
              }
            } else {
              if (card.position >= newPosition && card.position < oldPosition) {
                updatePayload.push({
                  id: card.id,
                  list_id: id,
                  position: card.position + 1,
                });
              }
            }
          }
        });
      }

      await api.put(`/board/${boardId}/card`, updatePayload);
      onListUpdated();
    } catch (error) {
      console.error('Error updating card position:', error);
    }

    setDragOverCardId(null);
  };

  const sortedCards = [...cards].sort((a, b) => a.position - b.position);

  return (
    <section className="list" ref={listRef}>
      <BoardNameInput
        value={listTitle}
        onChange={setListTitle}
        onSubmit={handleUpdateTitle}
        onBlur={handleUpdateTitle}
        onCancel={() => {
          setListTitle(title);
        }}
      />
      <div className="list__cards" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {sortedCards.map((card, index) => (
          <div key={`card-container-${card.id}`}>
            {dragOverCardId === index && <CardSlot key={`slot-${index}`} position={index} />}
            <Card key={card.id} card={card} boardId={boardId} />
          </div>
        ))}
        {dragOverCardId === cards.length && <CardSlot key={`slot-${cards.length}`} position={cards.length} />}
      </div>
      <AddCard listId={id} boardId={boardId} position={cards.length} onCardAdded={onListUpdated} />
    </section>
  );
};
