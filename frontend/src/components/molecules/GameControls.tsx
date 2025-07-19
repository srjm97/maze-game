import React from 'react';
import { GameButton } from '../atoms/GameButton';
import { GameStats } from '../atoms/GameStats';

interface GameControlsProps {
  onNewGame: () => void;
  moveCount: number;
}

export const GameControls: React.FC<GameControlsProps> = ({ onNewGame, moveCount }) => {
  return (
    <>
      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        marginTop: '20px',
      }}>
        <GameButton onClick={onNewGame}>New Game</GameButton>
        <GameStats moveCount={moveCount} />
      </div>
      <div style={{
        marginTop: '20px',
        color: '#8b949e',
        fontSize: '0.9rem',
        textAlign: 'center',
      }}>
        Use arrow keys or WASD to move • Press spacebar to restart
      </div>
    </>
  );
};