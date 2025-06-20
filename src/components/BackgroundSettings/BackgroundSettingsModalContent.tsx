import css from './BackgroundSettings.module.scss';
import errorCsss from '../../pages/Board/components/common/BoardNameInput.module.scss';
import ModalActionContent from '../../components/Modal/ModalActionContent';

interface BackgroundSettingsModalContentProps {
  imageUrl: string;
  isUrlValid: boolean;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  handleUrlChange: (url: string) => void;
  handleApplyBackground: () => void;
  onClose: () => void;
}

export default function BackgroundSettingsModalContent({
  imageUrl,
  isUrlValid,
  backgroundColor,
  setBackgroundColor,
  handleUrlChange,
  handleApplyBackground,
  onClose,
}: BackgroundSettingsModalContentProps) {
  return (
    <ModalActionContent
      title="Змінити фон"
      primaryButtonText="Застосувати"
      onPrimaryAction={handleApplyBackground}
      isPrimaryButtonDisabled={!isUrlValid && !backgroundColor}
      secondaryButtonText="Скасувати"
      onSecondaryAction={onClose}
    >
      <ImageUrlInput imageUrl={imageUrl} isUrlValid={isUrlValid} onUrlChange={handleUrlChange} />
      <ColorPicker backgroundColor={backgroundColor} onColorChange={setBackgroundColor} />
    </ModalActionContent>
  );
}

interface ImageUrlInputProps {
  imageUrl: string;
  isUrlValid: boolean;
  onUrlChange: (url: string) => void;
}

const ImageUrlInput = ({ imageUrl, isUrlValid, onUrlChange }: ImageUrlInputProps) => (
  <>
    <input
      type="text"
      value={imageUrl}
      onChange={(e) => onUrlChange(e.target.value)}
      placeholder="URL зображення (jpg, png, gif)"
      className={!isUrlValid && imageUrl ? 'error' : ''}
    />
    {!isUrlValid && imageUrl && <div className={errorCsss.error}>Будь ласка, введіть коректний URL зображення</div>}
  </>
);

interface ColorPickerProps {
  backgroundColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker = ({ backgroundColor, onColorChange }: ColorPickerProps) => (
  <div className={css.colorPicker}>
    <label className={css.colorPickerLabel}>
      Виберіть колір:
      <input
        className={css.colorPickerInput}
        type="color"
        value={backgroundColor}
        onChange={(e) => onColorChange(e.target.value)}
      />
    </label>
  </div>
);
