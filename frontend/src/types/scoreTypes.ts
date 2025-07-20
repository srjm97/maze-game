export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  created_at: string;
}

export interface Score {
  user_email: string;
  score: number;
  user_name?: string;
  user_picture?: string;
  created_at?: string;
}

export interface UserScore {
  game_name: string;
  highest_score: number;
}

export interface LeaderboardResponse {
  game_name: string;
  top_10_scores: Score[];
}

export interface UserHighScoreResponse {
  user_email: string;
  game_name: string;
  highest_score: number;
}

export interface TilesLeaderboards {
  easy: Score[];
  medium: Score[];
  hard: Score[];
}

export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type GameType = 'maze' | 'tiles';
export type TabType = 'global' | 'personal';

export interface GameConfig {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  scoreUnit: string;
}

export const GAME_CONFIGS: Record<string, GameConfig> = {
  maze: {
    name: 'maze',
    displayName: 'Maze Game',
    icon: 'gamepad',
    color: '#61dafb',
    scoreUnit: 'moves',
  },
  tiles_easy: {
    name: 'tiles_easy',
    displayName: 'Memory Tiles (Easy)',
    icon: 'th-large',
    color: '#4ade80',
    scoreUnit: 'moves',
  },
  tiles_medium: {
    name: 'tiles_medium',
    displayName: 'Memory Tiles (Medium)',
    icon: 'th-large',
    color: '#facc15',
    scoreUnit: 'moves',
  },
  tiles_hard: {
    name: 'tiles_hard',
    displayName: 'Memory Tiles (Hard)',
    icon: 'th-large',
    color: '#ef4444',
    scoreUnit: 'moves',
  },
};
