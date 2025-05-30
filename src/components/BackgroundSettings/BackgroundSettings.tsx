import { useState } from 'react';
import { ActionModal } from '../ActionModal/ActionModal';
import './background-settings.scss';

interface BackgroundSettingsProps {
  onBackgroundChange: (background: string[]) => void;
}

export function BackgroundSettings({ onBackgroundChange }: BackgroundSettingsProps) {
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return /\.(jpeg|jpg|gif|png)$/.test(url);
    } catch {
      return false;
    }
  };

  const handleUrlChange = (url: string): void => {
    setImageUrl(url);
    setIsUrlValid(validateUrl(url));
  };

  const handleApplyBackground = (): void => {
    const background = [imageUrl, backgroundColor];
    onBackgroundChange(background);
    resetModalState();
  };

  const resetModalState = (): void => {
    setShowModal(false);
    setImageUrl('');
  };

  return (
    <>
      <button className="background-settings__button" onClick={() => setShowModal(true)}>
        Змінити фон
      </button>

      <ActionModal
        isOpen={showModal}
        onClose={resetModalState}
        title="Змінити фон"
        primaryButtonText="Застосувати"
        onPrimaryAction={handleApplyBackground}
        isPrimaryButtonDisabled={!isUrlValid && !backgroundColor}
        onSecondaryAction={resetModalState}
      >
        <div className="background-settings__input-group">
          <ImageUrlInput imageUrl={imageUrl} isUrlValid={isUrlValid} onUrlChange={handleUrlChange} />
          <ColorPicker backgroundColor={backgroundColor} onColorChange={setBackgroundColor} />
        </div>
      </ActionModal>
    </>
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
    {!isUrlValid && imageUrl && <div className="input-board-error">Будь ласка, введіть коректний URL зображення</div>}
  </>
);

interface ColorPickerProps {
  backgroundColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker = ({ backgroundColor, onColorChange }: ColorPickerProps) => (
  <div className="background-settings__color-picker">
    <label className="background-settings__color-picker-label">
      Виберіть колір:
      <input
        className="background-settings__color-picker-input"
        type="color"
        value={backgroundColor}
        onChange={(e) => onColorChange(e.target.value)}
      />
    </label>
  </div>
);
