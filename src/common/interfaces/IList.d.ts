import { ICard } from './ICard';

export interface IList {
  id: number;
  title: string;
  position: number;
  cards: ICard[];
}
