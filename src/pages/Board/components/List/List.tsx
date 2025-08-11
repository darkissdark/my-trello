import { useState, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ICard } from '../../../../common/interfaces/ICard';
import { SortableList } from './SortableList';
import { AddCard } from '../Card/AddCard';
import { BoardNameInput } from '../common/BoardNameInput';
import { boardService, UpdateListData } from '../../../../api/services';
import styles from './List.module.scss';

interface ListProps {
  id: number;
  boardId: string;
  title: string;
  cards: ICard[];
  dragOverInfo: {
    cardId: number;
    targetListId: number;
    position: number;
  } | null;
  onListUpdated: () => void;
  onOpenCard: (card: ICard) => void;
}

export const List = ({ id, boardId, title, cards, dragOverInfo, onListUpdated, onOpenCard }: ListProps) => {
  const [listTitle, setListTitle] = useState(title);
  const { setNodeRef } = useDroppable({
    id: `list-${id}`,
  });

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

  return (
    <section ref={setNodeRef} className={styles.list}>
      <BoardNameInput
        additionalClassName={styles.listTitle}
        as="textarea"
        value={listTitle}
        onChange={setListTitle}
        onSubmit={handleUpdateTitle}
        onBlur={handleUpdateTitle}
        onCancel={() => setListTitle(title)}
      />

      <SortableList cards={sortedCards} listId={id} dragOverInfo={dragOverInfo} onOpenCard={onOpenCard} />

      <AddCard listId={id} boardId={boardId} position={cards.length} onCardAdded={onListUpdated} />
    </section>
  );
};
