export interface ICard {
  id: number;
  title: string;
  position: number;
  list_id: number;
  description?: string;
  custom?: {
    deadline?: string;
  };
  color?: string;
  users?: number[];
}
