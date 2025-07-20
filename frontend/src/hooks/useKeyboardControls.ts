import { useEffect } from 'react';
import { KEY_MAPPINGS } from '../constants/gameConstants';

interface UseKeyboardControlsProps {
  onMove: (direction: string) => void;
  onRestart: () => void;
  gameId: string | null;
  gameOver: boolean;
}

export const useKeyboardControls = ({
  onMove,
  onRestart,
  gameId,
  gameOver,
}: UseKeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      event.preventDefault();

      if (event.code === 'Space') {
        onRestart();
        return;
      }

      const direction = KEY_MAPPINGS[event.key as keyof typeof KEY_MAPPINGS];
      if (direction && gameId && !gameOver) {
        onMove(direction);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onMove, onRestart, gameId, gameOver]);
};
