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
      const card = list.cards.find(c => c.id === active.id);
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

    if (activeCard.list_id !== target.listId) {
      await moveCardBetweenLists(activeId, target.listId, target.position, lists, boardId, onListUpdated);
    } else {
      await reorderCardsInList(activeId, overId, activeCard.list_id, lists, boardId, onListUpdated);
    }
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

    if (activeCard.list_id !== target.listId) {
      await moveCardBetweenLists(activeId, target.listId, target.position, lists, boardId, onListUpdated);
    }

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
    const card = list.cards.find(c => c.id === cardId);
    if (card) return card;
  }
  return undefined;
};

const findTarget = (lists: IList[], overId: number | string): { listId: number; position: number } | null => {
  if (overId.toString().startsWith('list-')) {
    const listId = parseInt(overId.toString().replace('list-', ''));
    const list = lists.find(l => l.id === listId);
    if (list) {
      return { listId, position: list.cards.length };
    }
  } else {
    for (const list of lists) {
      const card = list.cards.find(c => c.id === overId);
      if (card) {
        return { listId: list.id, position: list.cards.findIndex(c => c.id === overId) };
      }
    }
  }
  return null;
};

const moveCardBetweenLists = async (
  cardId: number,
  targetListId: number,
  position: number,
  lists: IList[],
  boardId: string,
  onListUpdated: () => void
) => {
  const targetList = lists.find(l => l.id === targetListId);
  if (!targetList) return;

  try {
    const updates: MoveCardData[] = [
      { id: cardId, list_id: targetListId, position },
    ];

    targetList.cards.forEach((card, index) => {
      if (index >= position) {
        updates.push({ id: card.id, list_id: targetListId, position: index + 1 });
      }
    });

    await boardService.moveCards(boardId, updates);
    onListUpdated();
  } catch (error) {
    console.error('Error moving card to new list:', error);
  }
};

const reorderCardsInList = async (
  activeId: number,
  overId: number,
  listId: number,
  lists: IList[],
  boardId: string,
  onListUpdated: () => void
) => {
  const currentList = lists.find(l => l.id === listId);
  if (!currentList) return;

  const oldIndex = currentList.cards.findIndex(c => c.id === activeId);
  const newIndex = currentList.cards.findIndex(c => c.id === overId);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

  try {
    const updates: MoveCardData[] = [
      { id: activeId, list_id: listId, position: newIndex },
    ];

    currentList.cards.forEach((card, index) => {
      if (card.id !== activeId) {
        let newPosition = index;
        if (oldIndex < newIndex && index > oldIndex && index <= newIndex) {
          newPosition = index - 1;
        } else if (oldIndex > newIndex && index >= newIndex && index < oldIndex) {
          newPosition = index + 1;
        }
        
        if (newPosition !== index) {
          updates.push({ id: card.id, list_id: listId, position: newPosition });
        }
      }
    });

    await boardService.moveCards(boardId, updates);
    onListUpdated();
  } catch (error) {
    console.error('Error reordering cards:', error);
  }
}; 