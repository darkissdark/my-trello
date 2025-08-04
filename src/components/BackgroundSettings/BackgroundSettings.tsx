import { useEffect, useState } from 'react';
import { LazyModal } from '../Modal/LazyModal';
import React from 'react';
import css from './BackgroundSettings.module.scss';

const BackgroundSettingsModalContent = React.lazy(() => import('./BackgroundSettingsModalContent'));

interface BackgroundSettingsProps {
  onBackgroundChange: (background: string[]) => void;
  currentBackgroundColor: string;
  currentImageUrl: string;
}

export function BackgroundSettings({
  onBackgroundChange,
  currentBackgroundColor,
  currentImageUrl,
}: BackgroundSettingsProps) {
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return /\.(jpeg|jpg|gif|png)$/.test(url);
    } catch {
      return false;
    }
  };

  useEffect(() => {
    setImageUrl(currentImageUrl);
    setBackgroundColor(currentBackgroundColor);
    setIsUrlValid(validateUrl(currentImageUrl));
  }, [currentImageUrl, currentBackgroundColor]);

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
  };

  return (
    <>
      <button
        className={`${css.buttonAdditionalStyles} ${css.changeBackgroundButton}`}
        onClick={() => setShowModal(true)}
      >
        Змінити фон
      </button>

      <LazyModal
        isOpen={showModal}
        onClose={resetModalState}
        component={BackgroundSettingsModalContent}
        componentProps={{
          imageUrl,
          setImageUrl,
          isUrlValid,
          setIsUrlValid,
          backgroundColor,
          setBackgroundColor,
          handleUrlChange,
          handleApplyBackground,
          onClose: resetModalState,
        }}
      />
    </>
  );
}
