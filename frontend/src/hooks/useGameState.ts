import { useState, useCallback } from 'react';
import { gameApi } from '../services/gameApi';
import type { GameState } from '../types/gameTypes';

export const useGameState = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [moveCount, setMoveCount] = useState(0);

  const createNewGame = useCallback(async (width: number, height: number) => {
    try {
      setLoading(true);
      setMoveCount(0);
      const newGameId = await gameApi.createGame(width, height);
      setGameId(newGameId);
      const newGameState = await gameApi.getGameState(newGameId);
      setGameState(newGameState);
    } catch (error) {
      console.error('Error creating new game:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const movePlayer = useCallback(
    async (direction: string): Promise<GameState | null> => {
      if (!gameId || gameState?.game_over) return null;

      const newGameState = await gameApi.movePlayer(gameId, direction);
      if (newGameState) {
        setGameState(newGameState);
        setMoveCount((prev) => prev + 1);
      }
      return newGameState;
    },
    [gameId, gameState]
  );

  return {
    gameId,
    gameState,
    loading,
    moveCount,
    createNewGame,
    movePlayer,
  };
};
