import axios from 'axios';
import type { GameState } from '../types/gameTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const gameApi = {
  async createGame(width: number, height: number): Promise<string> {
    const response = await axios.post(`${API_BASE_URL}/game`, {
      width,
      height,
    });
    return response.data;
  },

  async getGameState(gameId: string): Promise<GameState> {
    const response = await axios.get(`${API_BASE_URL}/game/${gameId}`);
    return response.data;
  },

  async movePlayer(
    gameId: string,
    direction: string
  ): Promise<GameState | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/game/${gameId}/move`, {
        direction,
      });
      return response.data;
    } catch (error) {
      console.error('Error moving player:', error);
      return null;
    }
  },
};
