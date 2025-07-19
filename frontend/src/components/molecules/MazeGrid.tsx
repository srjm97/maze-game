import React from 'react';
import { MazeCell } from '../atoms/MazeCell';
import type { GameState, Position } from '../../types/gameTypes';

interface MazeGridProps {
  gameState: GameState;
  cellSize: number;
}

export const MazeGrid: React.FC<MazeGridProps> = ({ gameState, cellSize }) => {
  const getCellType = (
    x: number,
    y: number
  ): 'wall' | 'path' | 'player' | 'goal' => {
    const { player_position, goal_position, maze_layout } = gameState;

    if (player_position.x === x && player_position.y === y) return 'player';
    if (goal_position.x === x && goal_position.y === y) return 'goal';
    return maze_layout[y][x] === 1 ? 'wall' : 'path';
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `repeat(${gameState.maze_layout[0].length}, ${cellSize}px)`,
        gap: '1px',
        background: '#2c2d31',
        padding: '16px',
        borderRadius: '10px',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        margin: '20px auto',
        maxWidth: '90vw',
        placeItems: 'center',
        overflow: 'auto',
      }}
    >
      {gameState.maze_layout.map((row, y) =>
        row.map((cell, x) => (
          <MazeCell
            key={`${x}-${y}`}
            cellType={getCellType(x, y)}
            size={cellSize}
          />
        ))
      )}
    </div>
  );
};
