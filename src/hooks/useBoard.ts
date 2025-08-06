import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { IBoard } from '../common/interfaces/IBoard';
import { IList } from '../common/interfaces/IList';
import { boardService, UpdateBoardData, CreateListData } from '../api/services';
import { setLoading } from '../store/slices/loadingSlice';

export const useBoard = (boardId: string) => {
  const [board, setBoard] = useState<IBoard | null>(null);
  const [lists, setLists] = useState<IList[]>([]);
  const dispatch = useDispatch();

  const fetchBoard = useCallback(
    async (showLoader: boolean = false) => {
      dispatch(setLoading(showLoader));
      try {
        const data = await boardService.getBoard(boardId);
        setBoard(data);
        setLists(data.lists || []);
      } catch (error) {
        console.error('Error fetching board:', error);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [boardId, dispatch]
  );

  const updateBoard = useCallback(
    async (boardData: UpdateBoardData) => {
      try {
        const updatedBoard = await boardService.updateBoard(boardId, boardData);
        setBoard(updatedBoard);
        return updatedBoard;
      } catch (error) {
        console.error('Error updating board:', error);
        throw error;
      }
    },
    [boardId]
  );

  const updateBoardTitle = useCallback(
    async (title: string) => {
      const trimmedTitle = title.trim();
      if (trimmedTitle === '' || board?.title === trimmedTitle) {
        return;
      }
      await updateBoard({ title: trimmedTitle });
    },
    [board?.title, updateBoard]
  );

  const updateBoardBackground = useCallback(
    async (background: string[]) => {
      if (!board) return;
      const updatedBoard = { ...board, custom: { ...board.custom, background } };
      await updateBoard({ custom: updatedBoard.custom });
    },
    [board, updateBoard]
  );

  const createList = useCallback(
    async (listData: CreateListData) => {
      try {
        await boardService.createList(boardId, listData);
        await fetchBoard();
      } catch (error) {
        console.error('Error creating list:', error);
        throw error;
      }
    },
    [boardId, fetchBoard]
  );

  return {
    board,
    lists,
    fetchBoard,
    updateBoard,
    updateBoardTitle,
    updateBoardBackground,
    createList,
  };
};
