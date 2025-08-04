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
      title="New Board"
      primaryButtonText="Create"
      onPrimaryAction={handleCreateBoard}
      isPrimaryButtonDisabled={!isTitleValid}
      secondaryButtonText="Cancel"
      onSecondaryAction={onClose}
    >
      <BoardNameInput
        value={newBoardTitle}
        onChange={setNewBoardTitle}
        onSubmit={handleCreateBoard}
        onValidationChange={setIsTitleValid}
        placeholder="Board title"
      />
    </ModalActionContent>
  );
}
