import React, { useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
import { List } from '../List/List';
import { BackgroundSettings } from '../../../../components/BackgroundSettings/BackgroundSettings';
import { AddListModal } from '../AddListModal/AddListModal';
import styles from './BoardContent.module.scss';

interface BoardContentProps {
  lists: IList[];
  boardId: string;
  onListUpdated: () => void;
  onBackgroundChange: (imageUrl: string[]) => void;
  currentBackgroundImage?: string;
  currentBackgroundColor?: string;
  onAddList: (listTitle: string) => void;
}

export const BoardContent = ({
  lists,
  boardId,
  onListUpdated,
  onBackgroundChange,
  currentBackgroundImage,
  currentBackgroundColor,
  onAddList,
}: BoardContentProps) => {
  const [showAddListModal, setShowAddListModal] = useState(false);

  const handleAddList = async (listTitle: string) => {
    try {
      await onAddList(listTitle);
    } catch (error) {
      console.error('Error adding list:', error);
    }
  };

  return (
    <>
      <main className={styles.board}>
        {lists.map((list) => (
          <List
            key={list.id}
            id={list.id}
            boardId={boardId}
            title={list.title}
            cards={list.cards}
            onListUpdated={onListUpdated}
          />
        ))}
        
        <button className={styles.boardAddList} onClick={() => setShowAddListModal(true)}>
          + Додати список
        </button>

        <BackgroundSettings
          onBackgroundChange={onBackgroundChange}
          currentImageUrl={currentBackgroundImage ?? ''}
          currentBackgroundColor={currentBackgroundColor ?? '#ffffff'}
        />
        
        <div 
          className={styles.boardBackground} 
          style={{
            backgroundImage: currentBackgroundImage ? `url(${currentBackgroundImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </main>

      <AddListModal
        isOpen={showAddListModal}
        onClose={() => setShowAddListModal(false)}
        onAddList={handleAddList}
      />
    </>
  );
}; 