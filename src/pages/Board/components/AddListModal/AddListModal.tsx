import React, { useState } from 'react';
import { LazyModal } from '../../../../components/Modal/LazyModal';
import { useTitleValidation } from '../../../../hooks/useTitleValidation';
import styles from './AddListModal.module.scss';

interface AddListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddList: (title: string) => void;
}

export const AddListModal = ({ isOpen, onClose, onAddList }: AddListModalProps) => {
  const [listTitle, setListTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);
  const { error, validate } = useTitleValidation(listTitle, setIsTitleValid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        <div className={styles.addListModal}>
          <h3>Додати новий список</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="listTitle">Назва списку:</label>
              <input
                type="text"
                id="listTitle"
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                onBlur={() => validate(listTitle, true)}
                className={error ? styles.error : ''}
                placeholder="Введіть назву списку"
                required
              />
              {error && <div className={styles.errorMessage}>{error}</div>}
            </div>
            <div className={styles.actions}>
              <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                Скасувати
              </button>
              <button type="submit" disabled={!isTitleValid} className={styles.submitButton}>
                Додати
              </button>
            </div>
          </form>
        </div>
      )}
    />
  );
}; 