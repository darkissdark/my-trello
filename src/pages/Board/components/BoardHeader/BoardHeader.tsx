import React from 'react';
import { Link } from 'react-router-dom';
import { BoardNameInput } from '../common/BoardNameInput';
import { ArrowLeftIcon } from './ArrowLeftIcon';
import styles from './BoardHeader.module.scss';

interface BoardHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onTitleUpdate: () => void;
  onTitleCancel?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const BoardHeader = ({
  title,
  onTitleChange,
  onTitleUpdate,
  onTitleCancel,
  onValidationChange,
}: BoardHeaderProps) => {
  return (
    <header className={styles.boardHeader}>
      <div>
        <Link to={'/'} className={styles.boardBackLink}>
          <ArrowLeftIcon />
        </Link>
      </div>
      <BoardNameInput
        as="textarea"
        value={title}
        additionalClassNameWrapper={styles.headerTextAreaWrapper}
        additionalClassName={styles.headerTextArea}
        onChange={onTitleChange}
        onSubmit={onTitleUpdate}
        onBlur={onTitleUpdate}
        onCancel={onTitleCancel}
        onValidationChange={onValidationChange}
      />
    </header>
  );
};
