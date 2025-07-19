
export interface TileData {
  color: string;       // Tile background color
  symbol: string;      // Symbol displayed on the tile
  isRevealed: boolean; // Whether the tile is currently flipped face-up
  isMatched: boolean;  // Whether the tile has been matched with its pair
  pairId: number;      // ID to identify which tiles form a pair
}
