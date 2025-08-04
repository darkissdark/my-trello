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
      title="New Card"
      primaryButtonText="Add"
      onPrimaryAction={handleAddCard}
      isPrimaryButtonDisabled={!isTitleValid}
      secondaryButtonText="Cancel"
      onSecondaryAction={onClose}
    >
      <BoardNameInput
        value={cardTitle}
        onChange={setCardTitle}
        onSubmit={handleAddCard}
        onValidationChange={setIsTitleValid}
        placeholder="Card title"
        autoFocus
      />
    </ModalActionContent>
  );
}
