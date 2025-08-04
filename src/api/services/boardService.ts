import api from '../request';
import { IBoard } from '../../common/interfaces/IBoard';
import { IList } from '../../common/interfaces/IList';
import { ICard } from '../../common/interfaces/ICard';

export interface CreateBoardData {
  title: string;
  custom?: {
    background?: string[];
  };
}

export interface UpdateBoardData {
  title?: string;
  custom?: {
    background?: string[];
  };
}

export interface CreateListData {
  title: string;
  position: number;
}

export interface UpdateListData {
  title: string;
}

export interface CreateCardData {
  title: string;
  list_id: number;
  position: number;
  description?: string;
}

export interface UpdateCardData {
  title?: string;
  description?: string;
  list_id?: number;
  position?: number;
}

export interface MoveCardData {
  id: number;
  list_id: number;
  position: number;
}

export interface UpdateCardUsersData {
  add: number[];
  remove: number[];
}

class BoardService {
  // Board operations
  async getBoards(): Promise<{ boards: IBoard[] }> {
    const { data } = await api.get('/board');
    return data;
  }

  async getBoard(boardId: string): Promise<IBoard> {
    const { data } = await api.get(`/board/${boardId}`);
    return data;
  }

  async createBoard(boardData: CreateBoardData): Promise<IBoard> {
    const { data } = await api.post('/board', boardData);
    return data;
  }

  async updateBoard(boardId: string, boardData: UpdateBoardData): Promise<IBoard> {
    const { data } = await api.put(`/board/${boardId}`, boardData);
    return data;
  }

  // List operations
  async createList(boardId: string, listData: CreateListData): Promise<IList> {
    const { data } = await api.post(`/board/${boardId}/list`, listData);
    return data;
  }

  async updateList(boardId: string, listId: number, listData: UpdateListData): Promise<IList> {
    const { data } = await api.put(`/board/${boardId}/list/${listId}`, listData);
    return data;
  }

  // Card operations
  async createCard(boardId: string, cardData: CreateCardData): Promise<ICard> {
    const { data } = await api.post(`/board/${boardId}/card`, cardData);
    return data;
  }

  async updateCard(boardId: string, cardId: number, cardData: UpdateCardData): Promise<ICard> {
    const { data } = await api.put(`/board/${boardId}/card/${cardId}`, cardData);
    return data;
  }

  async moveCards(boardId: string, cardsData: MoveCardData[]): Promise<void> {
    const { data } = await api.put(`/board/${boardId}/card`, cardsData);
    return data;
  }

  async deleteCard(boardId: string, cardId: number): Promise<void> {
    const { data } = await api.delete(`/board/${boardId}/card/${cardId}`);
    return data;
  }

  async updateCardUsers(boardId: string, cardId: number, usersData: UpdateCardUsersData): Promise<void> {
    const { data } = await api.put(`/board/${boardId}/card/${cardId}/users`, usersData);
    return data;
  }
}

export const boardService = new BoardService(); 