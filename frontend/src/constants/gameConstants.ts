export const GAME_CONFIG = {
  MIN_CELL_SIZE: 25,
  MAX_CELL_SIZE: 40,
  DEFAULT_WIDTH: 15,
  DEFAULT_HEIGHT: 15,
  VICTORY_DELAY: 4000,
  PADDING: 64,
} as const;

export const AUDIO_CONFIG = {
  WALL_HIT_FREQUENCY: 150,
  WALL_HIT_DURATION: 0.2,
  BEACON_BASE_FREQUENCY: 300,
  BEACON_RANGE: 500,
  MATCH_SOUND_FREQUENCY: 440,
  MATCH_SOUND_DURATION: 0.3,
  VICTORY_MELODY: [
    { freq: 523, duration: 0.3 }, // C5
    { freq: 659, duration: 0.3 }, // E5
    { freq: 784, duration: 0.3 }, // G5
    { freq: 1047, duration: 0.6 }, // C6
    { freq: 784, duration: 0.3 }, // G5
    { freq: 1047, duration: 0.8 }, // C6
  ],
} as const;

export const KEY_MAPPINGS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
} as const;