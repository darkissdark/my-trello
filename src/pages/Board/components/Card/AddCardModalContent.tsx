import ModalActionContent from '../../../../components/Modal/ModalActionContent';
import { BoardNameInput } from '../common/BoardNameInput';

interface AddCardModalContentProps {
  cardTitle: string;
  setCardTitle: (title: string) => void;
  isTitleValid: boolean;
  setIsTitleValid: (valid: boolean) => void;
  handleAddCard: () => void;
  onClose: () => void;
}

export default function AddCardModalContent({
  cardTitle,
  setCardTitle,
  isTitleValid,
  setIsTitleValid,
  handleAddCard,
  onClose,
}: AddCardModalContentProps) {
  return (
    <ModalActionContent
      title="Нова картка"
      primaryButtonText="Додати"
      onPrimaryAction={handleAddCard}
      isPrimaryButtonDisabled={!isTitleValid}
      secondaryButtonText="Скасувати"
      onSecondaryAction={onClose}
    >
      <BoardNameInput
        value={cardTitle}
        onChange={setCardTitle}
        onSubmit={handleAddCard}
        onValidationChange={setIsTitleValid}
        placeholder="Назва картки"
        autoFocus
      />
    </ModalActionContent>
  );
}
