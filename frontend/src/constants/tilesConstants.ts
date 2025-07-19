export const TILES_CONFIG = {
  MIN_CELL_SIZE: 60,
  MAX_CELL_SIZE: 120,
  VICTORY_DELAY: 4000,
  FLIP_DELAY: 1000,
  PADDING: 100,
  DIFFICULTIES: {
    easy: { width: 3, height: 4 }, // 6 pairs
    medium: { width: 4, height: 4 }, // 8 pairs
    hard: { width: 4, height: 6 }, // 12 pairs
  },
} as const;

export const TILE_COLORS = [
  '#ff6b6b', // Red
  '#4ecdc4', // Teal
  '#45b7d1', // Blue
  '#96ceb4', // Green
  '#ffeaa7', // Yellow
  '#dda0dd', // Plum
  '#98d8c8', // Mint
  '#f7dc6f', // Gold
  '#bb8fce', // Purple
  '#85c1e9', // Light Blue
  '#f8c471', // Orange
  '#82e0aa', // Light Green
  '#f1948a', // Pink
  '#85929e', // Gray
  '#d7bde2', // Lavender
] as const;

export const TILE_SYMBOLS = [
  { symbol: '♠', name: 'Spade' },
  { symbol: '♣', name: 'Club' },
  { symbol: '♥', name: 'Heart' },
  { symbol: '♦', name: 'Diamond' },
  { symbol: '★', name: 'Star' },
  { symbol: '●', name: 'Circle' },
  { symbol: '▲', name: 'Triangle' },
  { symbol: '■', name: 'Square' },
  { symbol: '♪', name: 'Note' },
  { symbol: '☀', name: 'Sun' },
  { symbol: '☽', name: 'Moon' },
  { symbol: '❀', name: 'Flower' },
  { symbol: '⚡', name: 'Lightning' },
  { symbol: '☁', name: 'Cloud' },
  { symbol: '❄', name: 'Snowflake' },
  { symbol: '🔥', name: 'Fire' },
] as const;
