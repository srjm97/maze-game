import { useState, useCallback } from 'react';
import {
  TILES_CONFIG,
  TILE_COLORS,
  TILE_SYMBOLS,
} from '../constants/tilesConstants';
import { TileData } from '../types/tilesTypes';

export type Difficulty = keyof typeof TILES_CONFIG.DIFFICULTIES;

export const useTilesGame = () => {
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [isProcessing, setIsProcessing] = useState(false);

  /** Build a shuffled tile deck given grid width/height. */
  const createTiles = useCallback(
    (width: number, height: number): TileData[] => {
      const totalTiles = width * height;

      // Guard: ensure an even number of cells; if odd, last cell is dropped.
      const evenTotal = totalTiles - (totalTiles % 2);
      const pairs = evenTotal / 2;

      const newTiles: TileData[] = [];

      for (let i = 0; i < pairs; i++) {
        const color = TILE_COLORS[i % TILE_COLORS.length];
        const symbolData = TILE_SYMBOLS[i % TILE_SYMBOLS.length];
        const symbol = symbolData.symbol;
        const symbolName = symbolData.name;
        newTiles.push(
          { color, symbol, symbolName, isRevealed: false, isMatched: false, pairId: i },
          { color, symbol, symbolName, isRevealed: false, isMatched: false, pairId: i }
        );
      }

      // Fisher–Yates shuffle in-place.
      for (let i = newTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
      }

      return newTiles;
    },
    []
  );

  /** Reset everything and create a new deck for the current difficulty. */
  const initializeGame = useCallback(() => {
    const { width, height } = TILES_CONFIG.DIFFICULTIES[difficulty];
    const newTiles = createTiles(width, height);
    setTiles(newTiles);
    setSelectedTiles([]);
    setMoveCount(0);
    setMatchCount(0);
    setGameWon(false);
    setIsProcessing(false);
  }, [difficulty, createTiles]);

  /**
   * Handle a tile click. Returns true if the click was accepted (i.e., resulted in a flip);
   * false if ignored (invalid click, already matched, processing wait, etc.).
   */
  const handleTileClick = useCallback(
    (index: number): boolean => {
      // Block actions while animating flip-back, or after win.
      if (isProcessing || gameWon) return false;

      const tile = tiles[index];
      if (!tile) return false; // out-of-bounds safety
      if (tile.isMatched || tile.isRevealed) return false; // already open or matched
      if (selectedTiles.includes(index)) return false; // shouldn't happen but guard
      if (selectedTiles.length >= 2) return false; // shouldn't happen; processing guard

      // Flip this tile face-up immediately.
      setTiles((prev) =>
        prev.map((t, i) => (i === index ? { ...t, isRevealed: true } : t))
      );

      const newSelected = [...selectedTiles, index];
      setSelectedTiles(newSelected);

      // If this is the 2nd tile, evaluate match after FLIP_DELAY.
      if (newSelected.length === 2) {
        setIsProcessing(true);
        setMoveCount((prev) => prev + 1);

        const [firstIndex, secondIndex] = newSelected;
        // Capture pairIds now to avoid stale/changed state reads later.
        const firstPair = tiles[firstIndex]?.pairId;
        const secondPair = tiles[secondIndex]?.pairId;

        window.setTimeout(() => {
          if (firstPair != null && firstPair === secondPair) {
            // Match!
            setTiles((prev) =>
              prev.map((t, i) =>
                i === firstIndex || i === secondIndex
                  ? { ...t, isMatched: true, isRevealed: true }
                  : t
              )
            );

            setMatchCount((prev) => {
              const updated = prev + 1;
              const totalPairs = tiles.length / 2; // safe: tiles length stable between inits
              if (updated === totalPairs) {
                setGameWon(true);
              }
              return updated;
            });
          } else {
            // Not a match: flip both back face-down.
            setTiles((prev) =>
              prev.map((t, i) =>
                i === firstIndex || i === secondIndex
                  ? { ...t, isRevealed: false }
                  : t
              )
            );
          }

          // Clear selection & processing lock.
          setSelectedTiles([]);
          setIsProcessing(false);
        }, TILES_CONFIG.FLIP_DELAY);
      }

      return true;
    },
    [tiles, selectedTiles, gameWon, isProcessing]
  );

  return {
    tiles,
    selectedTiles,
    moveCount,
    matchCount,
    gameWon,
    difficulty,
    initializeGame,
    handleTileClick,
    setDifficulty,
  } as const;
};
