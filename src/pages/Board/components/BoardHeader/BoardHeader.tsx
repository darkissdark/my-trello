import React from 'react';
import { Link } from 'react-router-dom';
import { BoardNameInput } from '../common/BoardNameInput';
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="38"
            height="38"
            fill="currentColor"
            className="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 1-.5.5H3.707l4.147 4.146a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 0 1 .708.708L3.707 7.5H14.5a.5.5 0 0 1 .5.5z"
            />
          </svg>
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
