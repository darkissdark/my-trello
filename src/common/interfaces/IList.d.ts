import { ICard } from './ICard';

export interface IList {
  id: number;
  position: number;
  title: string;
  cards: ICard[];
}
