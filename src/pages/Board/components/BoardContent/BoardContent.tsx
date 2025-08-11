import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { IList } from '../../../../common/interfaces/IList';
import { ICard } from '../../../../common/interfaces/ICard';
import { List } from '../List/List';
import { BackgroundSettings } from '../../../../components/BackgroundSettings/BackgroundSettings';
import { AddListModal } from '../AddListModal/AddListModal';
import { boardService, MoveCardData } from '../../../../api/services';
import styles from './BoardContent.module.scss';

interface BoardContentProps {
  lists: IList[];
  boardId: string;
  onListUpdated: () => void;
  onBackgroundChange: (imageUrl: string[]) => void;
  currentBackgroundImage?: string;
  currentBackgroundColor?: string;
  onAddList: (listTitle: string) => void;
  onOpenCard: (card: ICard) => void;
}

export const BoardContent = ({
  lists,
  boardId,
  onListUpdated,
  onBackgroundChange,
  currentBackgroundImage,
  currentBackgroundColor,
  onAddList,
  onOpenCard,
}: BoardContentProps) => {
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [activeCard, setActiveCard] = useState<ICard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

    let activeCard: ICard | undefined;
    let activeListId: number | undefined;
    
    for (const list of lists) {
      const card = list.cards.find(c => c.id === activeId);
      if (card) {
        activeCard = card;
        activeListId = list.id;
        break;
      }
    }

    if (!activeCard || activeListId === undefined) return;

    let targetListId: number | undefined;
    let targetCard: ICard | undefined;
    let isOverList = false;
    
    if (overId.toString().startsWith('list-')) {
      targetListId = parseInt(overId.toString().replace('list-', ''));
      isOverList = true;
    } else {
      for (const list of lists) {
        const card = list.cards.find(c => c.id === overId);
        if (card) {
          targetCard = card;
          targetListId = list.id;
          break;
        }
      }
    }

    if (targetListId === undefined) return;

    if (activeListId !== targetListId) {
      const targetList = lists.find(l => l.id === targetListId);
      if (targetList) {
        let newPosition: number;
        
        if (isOverList) {
          newPosition = targetList.cards.length;
        } else if (targetCard) {
          newPosition = targetList.cards.findIndex(c => c.id === overId);
        } else {
          return;
        }
        
        try {
          const updates: MoveCardData[] = [
            {
              id: activeId,
              list_id: targetListId,
              position: newPosition,
            },
          ];

          targetList.cards.forEach((card, index) => {
            if (index >= newPosition) {
              updates.push({
                id: card.id,
                list_id: targetListId,
                position: index + 1,
              });
            }
          });

          await boardService.moveCards(boardId, updates);
          onListUpdated();
        } catch (error) {
          console.error('Error moving card to new list:', error);
        }
      }
    } else {
      if (targetCard) {
        const oldIndex = lists.find(l => l.id === activeListId)?.cards.findIndex(c => c.id === activeId) ?? -1;
        const newIndex = lists.find(l => l.id === activeListId)?.cards.findIndex(c => c.id === overId) ?? -1;

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const currentList = lists.find(l => l.id === activeListId);
          if (currentList) {
            const updates: MoveCardData[] = [];
            
            updates.push({
              id: activeId,
              list_id: activeListId,
              position: newIndex,
            });

            currentList.cards.forEach((card, index) => {
              if (card.id !== activeId) {
                let newPosition = index;
                if (oldIndex < newIndex && index > oldIndex && index <= newIndex) {
                  newPosition = index - 1;
                } else if (oldIndex > newIndex && index >= newIndex && index < oldIndex) {
                  newPosition = index + 1;
                }
                
                if (newPosition !== index) {
                  updates.push({
                    id: card.id,
                    list_id: activeListId,
                    position: newPosition,
                  });
                }
              }
            });

            try {
              await boardService.moveCards(boardId, updates);
              onListUpdated();
            } catch (error) {
              console.error('Error reordering cards:', error);
            }
          }
        }
      }
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

    let activeCard: ICard | undefined;
    let activeListId: number | undefined;
    
    for (const list of lists) {
      const card = list.cards.find(c => c.id === activeId);
      if (card) {
        activeCard = card;
        activeListId = list.id;
        break;
      }
    }

    if (!activeCard || activeListId === undefined) {
      setActiveCard(null);
      return;
    }

    let targetListId: number | undefined;
    let targetCard: ICard | undefined;
    let isOverList = false;
    
    if (overId.toString().startsWith('list-')) {
      targetListId = parseInt(overId.toString().replace('list-', ''));
      isOverList = true;
    } else {
      for (const list of lists) {
        const card = list.cards.find(c => c.id === overId);
        if (card) {
          targetCard = card;
          targetListId = list.id;
          break;
        }
      }
    }

    if (targetListId === undefined) {
      setActiveCard(null);
      return;
    }

    if (activeListId !== targetListId) {
      const targetList = lists.find(l => l.id === targetListId);
      if (targetList) {
        let newPosition: number;
        
        if (isOverList) {
          newPosition = targetList.cards.length;
        } else if (targetCard) {
          newPosition = targetList.cards.findIndex(c => c.id === overId);
        } else {
          setActiveCard(null);
          return;
        }
        
        try {
          const updates: MoveCardData[] = [
            {
              id: activeId,
              list_id: targetListId,
              position: newPosition,
            },
          ];

          targetList.cards.forEach((card, index) => {
            if (index >= newPosition) {
              updates.push({
                id: card.id,
                list_id: targetListId,
                position: index + 1,
              });
            }
          });

          await boardService.moveCards(boardId, updates);
          onListUpdated();
        } catch (error) {
          console.error('Error moving card to new list:', error);
        }
      }
    }

    setActiveCard(null);
  };

  const handleAddList = async (listTitle: string) => {
    try {
      await onAddList(listTitle);
    } catch (error) {
      console.error('Error adding list:', error);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <main className={styles.board}>
          {lists.map((list) => (
            <List
              key={list.id}
              id={list.id}
              boardId={boardId}
              title={list.title}
              cards={list.cards}
              onListUpdated={onListUpdated}
              onOpenCard={onOpenCard}
            />
          ))}

          <button className={styles.boardAddList} onClick={() => setShowAddListModal(true)}>
            + Add List
          </button>

          <BackgroundSettings
            onBackgroundChange={onBackgroundChange}
            currentImageUrl={currentBackgroundImage ?? ''}
            currentBackgroundColor={currentBackgroundColor ?? ''}
          />

          <div
            key={`${currentBackgroundImage}-${currentBackgroundColor}`}
            className={styles.boardBackground}
            style={{
              backgroundImage: currentBackgroundImage
                ? `url(${currentBackgroundImage})`
                : `linear-gradient(180deg, #fff9 0, ${currentBackgroundColor} 40%, ${currentBackgroundColor} 80%, ${currentBackgroundColor})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </main>

        <DragOverlay>
          {activeCard ? (
            <div className={styles.cardOverlay}>
              <p>{activeCard.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddListModal isOpen={showAddListModal} onClose={() => setShowAddListModal(false)} onAddList={handleAddList} />
    </>
  );
};
