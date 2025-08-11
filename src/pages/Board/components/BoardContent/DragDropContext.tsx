import React from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { ICard } from '../../../../common/interfaces/ICard';
import styles from './BoardContent.module.scss';

interface DragDropContextProps {
  children: React.ReactNode;
  activeCard: ICard | null;
  dragOverInfo: {
    cardId: number;
    targetListId: number;
    position: number;
  } | null;
  onDragStart: (event: any) => void;
  onDragOver: (event: any) => void;
  onDragEnd: (event: any) => void;
}

export const DragDropContext = ({
  children,
  activeCard,
  dragOverInfo,
  onDragStart,
  onDragOver,
  onDragEnd,
}: DragDropContextProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
      {children}

      <DragOverlay>
        {activeCard ? (
          <div className={styles.cardOverlay}>
            <p>{activeCard.title}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
