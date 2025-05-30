import { useState } from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import { Card } from '../Card/Card';
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
  // const [isTitleValid, setIsTitleValid] = useState(true);

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

  return (
    <section className="list">
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
          // onValidationChange={setIsTitleValid}
          autoFocus
        />
      ) : (
        <h2 className="list__title" onClick={() => setIsEditing(true)}>
          {title}
        </h2>
      )}
      <div className="list__cards">
        {cards.map((card) => (
          <Card key={card.id} card={card} boardId={boardId} onCardUpdated={onListUpdated} />
        ))}
        <AddCard listId={id} boardId={boardId} position={cards.length} onCardAdded={onListUpdated} />
      </div>
    </section>
  );
};
