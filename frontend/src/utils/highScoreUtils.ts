
export interface GameScore {
  score: number;
  date: string;
  difficulty?: string;
}

export interface HighScores {
  maze: GameScore[];
  tiles: {
    easy: GameScore[];
    medium: GameScore[];
    hard: GameScore[];
  };
}

const HIGH_SCORES_KEY = 'gameHighScores';
const MAX_SCORES_PER_CATEGORY = 5;

// Get all high scores from localStorage
export const getHighScores = (): HighScores => {
  try {
    const stored = localStorage.getItem(HIGH_SCORES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading high scores:', error);
  }
  
  // Return default structure if nothing stored or error occurred
  return {
    maze: [],
    tiles: {
      easy: [],
      medium: [],
      hard: []
    }
  };
};

// Save high scores to localStorage
const saveHighScores = (scores: HighScores): void => {
  try {
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
  } catch (error) {
    console.error('Error saving high scores:', error);
  }
};

// Add a new maze score (lower moves = better)
export const addMazeScore = (moves: number): { isNewRecord: boolean; position: number } => {
  const scores = getHighScores();
  const newScore: GameScore = {
    score: moves,
    date: new Date().toISOString()
  };
  
  scores.maze.push(newScore);
  scores.maze.sort((a, b) => a.score - b.score); // Sort by moves (ascending - lower is better)
  
  const position = scores.maze.findIndex(score => score.date === newScore.date) + 1;
  const isNewRecord = position === 1;
  
  // Keep only top scores
  scores.maze = scores.maze.slice(0, MAX_SCORES_PER_CATEGORY);
  
  saveHighScores(scores);
  
  return { isNewRecord, position };
};

// Add a new tiles score (lower moves = better)
export const addTilesScore = (moves: number, difficulty: 'easy' | 'medium' | 'hard'): { isNewRecord: boolean; position: number } => {
  const scores = getHighScores();
  const newScore: GameScore = {
    score: moves,
    date: new Date().toISOString(),
    difficulty
  };
  
  scores.tiles[difficulty].push(newScore);
  scores.tiles[difficulty].sort((a, b) => a.score - b.score); // Sort by moves (ascending - lower is better)
  
  const position = scores.tiles[difficulty].findIndex(score => score.date === newScore.date) + 1;
  const isNewRecord = position === 1;
  
  // Keep only top scores
  scores.tiles[difficulty] = scores.tiles[difficulty].slice(0, MAX_SCORES_PER_CATEGORY);
  
  saveHighScores(scores);
  
  return { isNewRecord, position };
};

// Get best score for maze
export const getBestMazeScore = (): number | null => {
  const scores = getHighScores();
  return scores.maze.length > 0 ? scores.maze[0].score : null;
};

// Get best score for tiles by difficulty
export const getBestTilesScore = (difficulty: 'easy' | 'medium' | 'hard'): number | null => {
  const scores = getHighScores();
  return scores.tiles[difficulty].length > 0 ? scores.tiles[difficulty][0].score : null;
};

// Clear all high scores (useful for testing)
export const clearHighScores = (): void => {
  try {
    localStorage.removeItem(HIGH_SCORES_KEY);
  } catch (error) {
    console.error('Error clearing high scores:', error);
  }
};

// Format score display
export const formatScore = (score: number): string => {
  return `${score} move${score === 1 ? '' : 's'}`;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (error) {
    return 'Unknown date';
  }
};