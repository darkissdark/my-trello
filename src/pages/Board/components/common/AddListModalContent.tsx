import ModalActionContent from '../../../../components/Modal/ModalActionContent';
import { BoardNameInput } from './BoardNameInput';

interface AddListModalContentProps {
  newListTitle: string;
  setNewListTitle: (title: string) => void;
  isTitleValid: boolean;
  setIsTitleValid: (valid: boolean) => void;
  handleAddList: () => void;
  onClose: () => void;
}

export default function AddListModalContent({
  newListTitle,
  setNewListTitle,
  isTitleValid,
  setIsTitleValid,
  handleAddList,
  onClose,
}: AddListModalContentProps) {
  return (
    <ModalActionContent
      title="Новий список"
      primaryButtonText="Додати"
      onPrimaryAction={handleAddList}
      isPrimaryButtonDisabled={!isTitleValid}
      secondaryButtonText="Скасувати"
      onSecondaryAction={onClose}
    >
      <BoardNameInput
        value={newListTitle}
        onChange={setNewListTitle}
        onSubmit={handleAddList}
        onValidationChange={setIsTitleValid}
        placeholder="Назва списку"
        autoFocus
      />
    </ModalActionContent>
  );
}
