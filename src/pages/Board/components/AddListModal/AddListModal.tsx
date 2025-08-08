import React, { useState } from 'react';
import { LazyModal } from '../../../../components/Modal/LazyModal';
import { BoardNameInput } from '../common/BoardNameInput';
import ModalActionContent from '../../../../components/Modal/ModalActionContent';

interface AddListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddList: (title: string) => void;
}

export const AddListModal = ({ isOpen, onClose, onAddList }: AddListModalProps) => {
  const [listTitle, setListTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);

  const handleSubmit = async () => {
    if (!isTitleValid || listTitle.trim() === '') {
      return;
    }

    try {
      await onAddList(listTitle.trim());
      setListTitle('');
      onClose();
    } catch (error) {
      console.error('Error adding list:', error);
    }
  };

  const handleCancel = () => {
    setListTitle('');
    onClose();
  };

  return (
    <LazyModal
      isOpen={isOpen}
      onClose={handleCancel}
      component={() => (
        <ModalActionContent
          title="Add New List"
          primaryButtonText="Add"
          onPrimaryAction={handleSubmit}
          isPrimaryButtonDisabled={!isTitleValid}
          secondaryButtonText="Cancel"
          onSecondaryAction={handleCancel}
        >
          <BoardNameInput
            value={listTitle}
            onChange={setListTitle}
            onSubmit={handleSubmit}
            onValidationChange={setIsTitleValid}
            placeholder="Enter list name"
            autoFocus
          />
        </ModalActionContent>
      )}
    />
  );
};
