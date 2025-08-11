import styles from './CardSlot.module.scss';

interface CardSlotProps {
  position: number;
}

export function CardSlot({ position }: CardSlotProps) {
  return <div className={styles.cardSlot} style={{ order: position }} />;
}
