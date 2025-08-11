import { useState } from 'react';
import { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { IList } from '../common/interfaces/IList';
import { ICard } from '../common/interfaces/ICard';
import { boardService, MoveCardData } from '../api/services';

export const useDragAndDrop = (lists: IList[], boardId: string, onListUpdated: () => void) => {
  const [activeCard, setActiveCard] = useState<ICard | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    for (const list of lists) {
      const card = list.cards.find((c) => c.id === active.id);
      if (card) {
        setActiveCard(card);
        break;
      }
    }
  };

  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;
    if (activeId === overId) return;

    const activeCard = findCardInLists(lists, activeId);
    if (!activeCard) return;

    const target = findTarget(lists, overId);
    if (!target) return;

    await moveCard(activeId, target.listId, target.position, lists, boardId, onListUpdated);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveCard(null);
      return;
    }

    const activeId = active.id as number;
    const overId = over.id as number;
    if (activeId === overId) {
      setActiveCard(null);
      return;
    }

    const activeCard = findCardInLists(lists, activeId);
    if (!activeCard) {
      setActiveCard(null);
      return;
    }

    const target = findTarget(lists, overId);
    if (!target) {
      setActiveCard(null);
      return;
    }

    await moveCard(activeId, target.listId, target.position, lists, boardId, onListUpdated);
    setActiveCard(null);
  };

  return {
    activeCard,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

const findCardInLists = (lists: IList[], cardId: number): ICard | undefined => {
  for (const list of lists) {
    const card = list.cards.find((c) => c.id === cardId);
    if (card) return card;
  }
  return undefined;
};

const findTarget = (lists: IList[], overId: number | string): { listId: number; position: number } | null => {
  if (overId.toString().startsWith('list-')) {
    const listId = parseInt(overId.toString().replace('list-', ''));
    const list = lists.find((l) => l.id === listId);
    if (list) {
      return { listId, position: list.cards.length };
    }
  } else {
    for (const list of lists) {
      const card = list.cards.find((c) => c.id === overId);
      if (card) {
        return { listId: list.id, position: list.cards.findIndex((c) => c.id === overId) };
      }
    }
  }
  return null;
};

const moveCard = async (
  cardId: number,
  targetListId: number,
  position: number,
  lists: IList[],
  boardId: string,
  onListUpdated: () => void
) => {
  const targetList = lists.find((l) => l.id === targetListId);
  if (!targetList) return;

  let currentListId: number | undefined;
  let currentPosition: number | undefined;

  for (const list of lists) {
    const cardIndex = list.cards.findIndex((c) => c.id === cardId);
    if (cardIndex !== -1) {
      currentListId = list.id;
      currentPosition = cardIndex;
      break;
    }
  }

  if (currentListId === undefined || currentPosition === undefined) return;

  try {
    const updates: MoveCardData[] = [];

    if (currentListId === targetListId) {
      const oldIndex = currentPosition;
      const newIndex = position;

      if (oldIndex !== newIndex) {
        updates.push({ id: cardId, list_id: targetListId, position: newIndex });

        targetList.cards.forEach((card, index) => {
          if (card.id !== cardId) {
            let newPosition = index;
            if (oldIndex < newIndex && index > oldIndex && index <= newIndex) {
              newPosition = index - 1;
            } else if (oldIndex > newIndex && index >= newIndex && index < oldIndex) {
              newPosition = index + 1;
            }

            if (newPosition !== index) {
              updates.push({ id: card.id, list_id: targetListId, position: newPosition });
            }
          }
        });
      }
    } else {
      updates.push({ id: cardId, list_id: targetListId, position });

      targetList.cards.forEach((card, index) => {
        if (index >= position) {
          updates.push({ id: card.id, list_id: targetListId, position: index + 1 });
        }
      });
    }

    if (updates.length > 0) {
      await boardService.moveCards(boardId, updates);
      onListUpdated();
    }
  } catch (error) {
    console.error('Error moving card:', error);
  }
};
