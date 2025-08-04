import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { IBoard } from '../common/interfaces/IBoard';
import { boardService, CreateBoardData } from '../api/services';
import { setLoading } from '../store/slices/loadingSlice';

export const useBoards = () => {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const dispatch = useDispatch();

  const fetchBoards = useCallback(
    async (showLoader: boolean = false) => {
      dispatch(setLoading(showLoader));
      try {
        const { boards } = await boardService.getBoards();
        setBoards(boards);
      } catch (error) {
        console.error('Error fetching boards:', error);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const createBoard = useCallback(
    async (boardData: CreateBoardData) => {
      try {
        const newBoard = await boardService.createBoard(boardData);
        setBoards((prev) => [...prev, newBoard]);
        return newBoard;
      } catch (error) {
        console.error('Error creating board:', error);
        throw error;
      }
    },
    []
  );

  return {
    boards,
    fetchBoards,
    createBoard,
  };
}; 