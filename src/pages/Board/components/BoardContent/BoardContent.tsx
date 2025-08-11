import React, { useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
import { ICard } from '../../../../common/interfaces/ICard';
import { List } from '../List/List';
import { BackgroundSettings } from '../../../../components/BackgroundSettings/BackgroundSettings';
import { AddListModal } from '../AddListModal/AddListModal';
import { DragDropContext } from './DragDropContext';
import { useDragAndDrop } from '../../../../hooks/useDragAndDrop';
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
  const { activeCard, dragOverInfo, handleDragStart, handleDragOver, handleDragEnd } = useDragAndDrop(
    lists,
    boardId,
    onListUpdated
  );

  const handleAddList = async (listTitle: string) => {
    try {
      await onAddList(listTitle);
    } catch (error) {
      console.error('Error adding list:', error);
    }
  };

  return (
    <>
      <DragDropContext
        activeCard={activeCard}
        dragOverInfo={dragOverInfo}
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
              dragOverInfo={dragOverInfo}
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
      </DragDropContext>

      <AddListModal isOpen={showAddListModal} onClose={() => setShowAddListModal(false)} onAddList={handleAddList} />
    </>
  );
};
