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
  const [isEditing, setIsEditing] = useState(false);
  const [listTitle, setListTitle] = useState(title);
  const [dragOverCardId, setDragOverCardId] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const listRef = useRef<HTMLElement>(null);

  const handleUpdateTitle = async () => {
    if (listTitle.trim() === title) {
      setIsEditing(false);
      return;
    }
    try {
      await api.put(`/board/${boardId}/list/${id}`, {
        title: listTitle,
      });
      onListUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating list title:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cardsContainer = e.currentTarget;
    const rect = cardsContainer.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // If dragging over the bottom area of the list
    if (y > rect.height - 50) {
      setDragOverCardId(cards.length);
      return;
    }

    // Find the card being dragged over
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
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cardData = JSON.parse(e.dataTransfer.getData('text/plain')) as ICard;

    if (cardData.list_id === id && dragOverCardId === null) {
      return;
    }

    try {
      await api.put(`/board/${boardId}/card/${cardData.id}`, {
        list_id: id,
        position: dragOverCardId ?? cards.length,
      });

      onListUpdated();
    } catch (error) {
      console.error('Error updating card position:', error);
    }

    setDragOverCardId(null);
    setIsDraggingOver(false);
  };

  const sortedCards = [...cards].sort((a, b) => a.position - b.position);

  return (
    <section className="list" ref={listRef}>
      {isEditing ? (
        <BoardNameInput
          value={listTitle}
          onChange={setListTitle}
          onSubmit={handleUpdateTitle}
          onBlur={handleUpdateTitle}
          onCancel={() => {
            setIsEditing(false);
            setListTitle(title);
          }}
          autoFocus
        />
      ) : (
        <h2 className="list__title" onClick={() => setIsEditing(true)}>
          {title}
        </h2>
      )}
      <div
        className="list__cards"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        key={id}
      >
        {sortedCards.map((card, index) => (
          <>
            {dragOverCardId === index && <CardSlot position={index} />}
            <Card key={card.id} card={card} boardId={boardId} onCardUpdated={onListUpdated} />
          </>
        ))}
        {dragOverCardId === cards.length && <CardSlot position={cards.length} />}
        <AddCard listId={id} boardId={boardId} position={cards.length} onCardAdded={onListUpdated} />
      </div>
    </section>
  );
};
