import { ICard } from './ICard';

export interface IList {
  id: number;
  position: number;
  title: string;
  cards: ICard[];
}

export interface IUser {
  id: number;
  email: string;
  username: string;
}
