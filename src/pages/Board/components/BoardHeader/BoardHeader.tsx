import React from 'react';
import { Link } from 'react-router-dom';
import { BoardNameInput } from '../common/BoardNameInput';
import { ArrowLeftIcon } from './ArrowLeftIcon';
import styles from './BoardHeader.module.scss';

interface BoardHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onTitleUpdate: () => void;
}

export const BoardHeader = ({ title, onTitleChange, onTitleUpdate }: BoardHeaderProps) => {
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
      />
    </header>
  );
};
