import { ICard } from '../../../../common/interfaces/ICard';
import { Card } from '../Card/Card';
import './list.scss';

interface ListProps {
  title: string;
  cards: ICard[];
}

export const List = ({ title, cards }: ListProps) => {
  return (
    <section className="list">
      <h2 className="list__title">{title}</h2>
      <div className="list__cards">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      <button className="list__add-card">+ Додати картку</button>
    </section>
  );
};
