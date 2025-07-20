import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { User, Score, UserScore, TilesLeaderboards, LeaderboardResponse, UserHighScoreResponse } from '../types/scoreTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface UseHighScoresReturn {
  currentUser: User | null;
  mazeLeaderboard: Score[];
  tilesLeaderboards: TilesLeaderboards;
  userScores: UserScore[];
  loading: boolean;
  error: string | null;
  refreshScores: () => Promise<void>;
}

export const useHighScores = (): UseHighScoresReturn => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mazeLeaderboard, setMazeLeaderboard] = useState<Score[]>([]);
  const [tilesLeaderboards, setTilesLeaderboards] = useState<TilesLeaderboards>({
    easy: [],
    medium: [],
    hard: [],
  });
  const [userScores, setUserScores] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user data from session storage
  useEffect(() => {
    const userData = sessionStorage.getItem('user_data');
    if (userData) {
      try {
        const user: User = JSON.parse(userData);
        setCurrentUser(user);
      } catch (e) {
        console.error('Error parsing user data:', e);
        setError('Failed to load user data');
      }
    }
  }, []);

  const fetchGlobalLeaderboards = useCallback(async (): Promise<{
    maze: Score[];
    tilesEasy: Score[];
    tilesMedium: Score[];
    tilesHard: Score[];
  }> => {
    const requests = [
      axios.get<LeaderboardResponse>(`${API_BASE_URL}/score/top10?game_name=maze`),
      axios.get<LeaderboardResponse>(`${API_BASE_URL}/score/top10?game_name=tiles_easy`),
      axios.get<LeaderboardResponse>(`${API_BASE_URL}/score/top10?game_name=tiles_medium`),
      axios.get<LeaderboardResponse>(`${API_BASE_URL}/score/top10?game_name=tiles_hard`),
    ];

    try {
      const [mazeResponse, tilesEasyResponse, tilesMediumResponse, tilesHardResponse] = await Promise.allSettled(requests);
        console.log("Responses",mazeResponse, tilesEasyResponse, tilesMediumResponse, tilesHardResponse);
      return {
        maze: mazeResponse.status === 'fulfilled' ? mazeResponse.value.data.top_10_scores : [],
        tilesEasy: tilesEasyResponse.status === 'fulfilled' ? tilesEasyResponse.value.data.top_10_scores : [],
        tilesMedium: tilesMediumResponse.status === 'fulfilled' ? tilesMediumResponse.value.data.top_10_scores : [],
        tilesHard: tilesHardResponse.status === 'fulfilled' ? tilesHardResponse.value.data.top_10_scores : [],
      };
    } catch (error) {
      console.error('Error fetching global leaderboards:', error);
      throw new Error('Failed to load global leaderboards');
    }
  }, []);

  const fetchUserScores = useCallback(async (userEmail: string): Promise<UserScore[]> => {
    const gameTypes = [
      { game: 'maze', display: 'Maze Game' },
      { game: 'tiles_easy', display: 'Memory Tiles (Easy)' },
      { game: 'tiles_medium', display: 'Memory Tiles (Medium)' },
      { game: 'tiles_hard', display: 'Memory Tiles (Hard)' },
    ];

    const requests = gameTypes.map(({ game }) =>
      axios.get<UserHighScoreResponse>(`${API_BASE_URL}/score/highest?user_email=${userEmail}&game_name=${game}`)
    );

    try {
      const results = await Promise.allSettled(requests);
      
      return results
        .map((result, index) => {
          if (result.status === 'fulfilled') {
            return {
              game_name: gameTypes[index].display,
              highest_score: result.value.data.highest_score,
            };
          }
          return null;
        })
        .filter((score): score is UserScore => score !== null);
    } catch (error) {
      console.error('Error fetching user scores:', error);
      return [];
    }
  }, []);

  const refreshScores = useCallback(async () => {
    if (!currentUser) {
      setError('No user data available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch both global leaderboards and user scores in parallel
      const [globalData, userScoreData] = await Promise.all([
        fetchGlobalLeaderboards(),
        fetchUserScores(currentUser.email),
      ]);

      // Update state
      setMazeLeaderboard(globalData.maze);
      setTilesLeaderboards({
        easy: globalData.tilesEasy,
        medium: globalData.tilesMedium,
        hard: globalData.tilesHard,
      });
      setUserScores(userScoreData);
    } catch (error) {
      console.error('Error refreshing scores:', error);
      setError(error instanceof Error ? error.message : 'Failed to load scores');
    } finally {
      setLoading(false);
    }
  }, [currentUser, fetchGlobalLeaderboards, fetchUserScores]);

  // Initial load
  useEffect(() => {
    if (currentUser) {
      refreshScores();
    }
  }, [currentUser, refreshScores]);

  return {
    currentUser,
    mazeLeaderboard,
    tilesLeaderboards,
    userScores,
    loading,
    error,
    refreshScores,
  };
};