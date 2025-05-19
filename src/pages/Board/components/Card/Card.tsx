import { ICard } from '../../../../common/interfaces/ICard';
import './card.scss';

interface CardProps {
  card: ICard;
}

export function Card({ card }: CardProps) {
  return (
    <div className="card">
      <p className="card__title">{card.title}</p>
    </div>
  );
}
