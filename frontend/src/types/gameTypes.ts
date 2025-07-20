export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  player_position: Position;
  goal_position: Position;
  maze_layout: number[][];
  game_over: boolean;
}

export interface GameConfig {
  width: number;
  height: number;
  minCellSize: number;
  maxCellSize: number;
}

export interface AudioNote {
  freq: number;
  duration: number;
}
