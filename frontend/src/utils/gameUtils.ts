import type { GameState } from '../types/gameTypes';
import { GAME_CONFIG } from '../constants/gameConstants';

export const calculateDistance = (pos1: { x: number; y: number }, pos2: { x: number; y: number }): number => {
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
  );
};

export const calculateCellSize = (gameState: GameState | null): number => {
  if (!gameState) return GAME_CONFIG.MIN_CELL_SIZE;

  const padding = GAME_CONFIG.PADDING;
  const availableWidth = Math.min(window.innerWidth - padding, window.innerHeight - 300);
  const availableHeight = availableWidth;

  const maxCellWidth = (availableWidth * 0.8) / gameState.maze_layout[0].length;
  const maxCellHeight = (availableHeight * 0.8) / gameState.maze_layout.length;

  let newSize = Math.min(maxCellWidth, maxCellHeight);
  return Math.min(Math.max(newSize, GAME_CONFIG.MIN_CELL_SIZE), GAME_CONFIG.MAX_CELL_SIZE);
};