import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TilesGrid } from '../molecules/TilesGrid';
import { TilesControls } from '../molecules/TilesControls';
import { VictoryModal } from '../molecules/VictoryModal';
import { useTilesGame } from '../../hooks/useTilesGame';
import { useAudio } from '../../hooks/useAudio';
import { TILES_CONFIG } from '../../constants/tilesConstants';
import { addTilesScore, getBestTilesScore } from '../../utils/highScoreUtils';
import '../../styles/animations.css';
import { ScoreDisplay } from '../molecules/ScoreDisplay';

interface TilesGameProps {
  onBackToMenu: () => void;
}
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export default function TilesGame({ onBackToMenu }: TilesGameProps) {
  const {
    tiles,
    selectedTiles,
    moveCount,
    matchCount,
    gameWon,
    difficulty,
    initializeGame,
    handleTileClick,
    setDifficulty,
  } = useTilesGame();

  const { playWallHit, playVictory } = useAudio();
  const [cellSize, setCellSize] = useState(TILES_CONFIG.MIN_CELL_SIZE);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const victoryTriggeredRef = useRef(false);

  const gridDimensions = TILES_CONFIG.DIFFICULTIES[difficulty];
  const totalPairs = (gridDimensions.width * gridDimensions.height) / 2;

  // Calculate cell size based on window size and grid dimensions
  useEffect(() => {
    const updateCellSize = () => {
      const maxWidth = window.innerWidth * 0.9; // 90% of viewport width
      const maxHeight = window.innerHeight * 0.8; // 80% of viewport height
      const width = Math.min(
        maxWidth / gridDimensions.width,
        TILES_CONFIG.MAX_CELL_SIZE
      );
      const height = Math.min(
        maxHeight / gridDimensions.height,
        TILES_CONFIG.MAX_CELL_SIZE
      );
      setCellSize(100);
    };
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, [gridDimensions]);

  // Initialize game on component mount
  useEffect(() => {
    startNewGame();
    // Load best score for current difficulty
    setBestScore(getBestTilesScore(difficulty));
  }, []);

  // Update best score when difficulty changes and restart game
  useEffect(() => {
    setBestScore(getBestTilesScore(difficulty));
    // Reset victory flag and restart game when difficulty changes
    victoryTriggeredRef.current = false;
    setShowSuccess(false);
    setIsNewRecord(false);
    initializeGame();
  }, [difficulty, initializeGame]);

  // Handle game won - fixed to prevent infinite loop
  useEffect(() => {
    if (gameWon && !victoryTriggeredRef.current) {
      victoryTriggeredRef.current = true;

      // Add score to high scores and check if it's a new record
      const scoreResult = addTilesScore(moveCount, difficulty);
      setIsNewRecord(scoreResult.isNewRecord);

      // Update best score
      setBestScore(getBestTilesScore(difficulty));

      playVictory();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsNewRecord(false);
      }, TILES_CONFIG.VICTORY_DELAY);
    }
  }, [gameWon, moveCount, matchCount, difficulty, playVictory]);

  const startNewGame = useCallback(() => {
    // Reset the victory flag when starting a new game
    victoryTriggeredRef.current = false;
    setShowSuccess(false);
    setIsNewRecord(false);
    initializeGame();
    // Update best score for current difficulty
    setBestScore(getBestTilesScore(difficulty));
  }, [initializeGame, difficulty]);

  const handleTileClickWithAudio = useCallback(
    (index: number) => {
      const success = handleTileClick(index);
      if (!success) {
        playWallHit();
      }
    },
    [handleTileClick, playWallHit]
  );

  const handleDifficultyChange = useCallback(
    (newDifficulty: 'easy' | 'medium' | 'hard') => {
      setDifficulty(newDifficulty);
      // The game will restart automatically via the useEffect above
    },
    [setDifficulty]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        startNewGame();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onBackToMenu();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [startNewGame, onBackToMenu]);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1b1e',
        color: '#fff',
        padding: '16px',
      }}
    >
      <VictoryModal
        isVisible={showSuccess}
        moveCount={moveCount}
        customMessage={
          isNewRecord
            ? `🏆 NEW RECORD! You found all ${matchCount} pairs! 🏆`
            : `You found all ${matchCount} pairs!`
        }
      />

      <h1
        style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          color: '#ff6b6b',
          fontWeight: 'bold',
          textShadow: '0 0 15px rgba(255, 107, 107, 0.5)',
        }}
      >
        Memory Tiles
      </h1>

      <ScoreDisplay
        currentScore={moveCount}
        bestScore={bestScore}
        isNewRecord={isNewRecord && gameWon}
        gameType="tiles"
        difficulty={difficulty}
      />

      <TilesGrid
        tiles={tiles}
        gridDimensions={gridDimensions}
        cellSize={cellSize}
        onTileClick={handleTileClickWithAudio}
        selectedTiles={selectedTiles}
      />

      <TilesControls
        onNewGame={startNewGame}
        onBackToMenu={onBackToMenu}
        moveCount={moveCount}
        matchCount={matchCount}
        totalPairs={totalPairs}
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
      />
    </div>
  );
}