import ModalActionContent from '../../../components/Modal/ModalActionContent';
import { BoardNameInput } from './common/BoardNameInput';

interface CreateBoardModalContentProps {
  newBoardTitle: string;
  setNewBoardTitle: (title: string) => void;
  isTitleValid: boolean;
  setIsTitleValid: (valid: boolean) => void;
  handleCreateBoard: () => void;
  onClose: () => void;
}

export default function CreateBoardModalContent({
  newBoardTitle,
  setNewBoardTitle,
  isTitleValid,
  setIsTitleValid,
  handleCreateBoard,
  onClose,
}: CreateBoardModalContentProps) {
  return (
    <ModalActionContent
      title="Нова дошка"
      primaryButtonText="Створити"
      onPrimaryAction={handleCreateBoard}
      isPrimaryButtonDisabled={!isTitleValid}
      secondaryButtonText="Скасувати"
      onSecondaryAction={onClose}
    >
      <BoardNameInput
        value={newBoardTitle}
        onChange={setNewBoardTitle}
        onValidationChange={setIsTitleValid}
        onSubmit={handleCreateBoard}
        placeholder="Назва дошки"
      />
    </ModalActionContent>
  );
}
