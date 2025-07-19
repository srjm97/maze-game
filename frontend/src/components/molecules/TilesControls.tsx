import React from 'react';
import { GameButton } from '../atoms/GameButton';
import { GameStats } from '../atoms/GameStats';
import { DifficultySelector } from '../atoms/DifficultlySelector';

interface TilesControlsProps {
  onNewGame: () => void;
  onBackToMenu: () => void;
  moveCount: number;
  matchCount: number;
  totalPairs: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export const TilesControls: React.FC<TilesControlsProps> = ({
  onNewGame,
  onBackToMenu,
  moveCount,
  matchCount,
  totalPairs,
  difficulty,
  onDifficultyChange,
}) => {
  return (
    <>
      <DifficultySelector
        selectedDifficulty={difficulty}
        onDifficultyChange={onDifficultyChange}
      />

      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          marginTop: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <GameButton onClick={onNewGame}>New Game</GameButton>
        <GameButton onClick={onBackToMenu} variant="secondary">
          Back to Menu
        </GameButton>
        <GameStats moveCount={moveCount} />
        <div
          style={{
            fontSize: '1.1rem',
            color: '#ff6b6b',
            fontWeight: 'bold',
          }}
        >
          Matches: {matchCount}/{totalPairs}
        </div>
      </div>

      <div
        style={{
          marginTop: '20px',
          color: '#8b949e',
          fontSize: '0.9rem',
          textAlign: 'center',
        }}
      >
        Click tiles to reveal them • Match pairs to win • Press spacebar to
        restart
      </div>
    </>
  );
};
