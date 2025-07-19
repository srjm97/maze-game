import React from 'react';

interface GameStatsProps {
  moveCount: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ moveCount }) => {
  return (
    <div
      style={{
        fontSize: '1.1rem',
        color: '#61dafb',
        fontWeight: 'bold',
      }}
    >
      Moves: {moveCount}
    </div>
  );
};
