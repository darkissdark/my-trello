import './card.scss';

interface CardSlotProps {
    position: number;
}

export function CardSlot({ position }: CardSlotProps) {
    return (
        <div
            className="card card--slot"
            style={{ order: position }}
        />
    );
} 