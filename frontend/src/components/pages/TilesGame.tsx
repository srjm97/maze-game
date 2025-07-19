import React, { useState, useEffect, useCallback } from 'react';
import { TilesGrid } from '../molecules/TilesGrid';
import { TilesControls } from '../molecules/TilesControls';
import { VictoryModal } from '../molecules/VictoryModal';
import { useTilesGame } from '../../hooks/useTilesGame';
import { useAudio } from '../../hooks/useAudio';
import { TILES_CONFIG } from '../../constants/tilesConstants';
import { speakMessage } from '../../utils/speakmessage';
import '../../styles/animations.css';

interface TilesGameProps {
  onBackToMenu: () => void;
}

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
    setDifficulty 
  } = useTilesGame();

  const { playWallHit, playVictory } = useAudio();
  const [cellSize, setCellSize] = useState(TILES_CONFIG.MIN_CELL_SIZE);
  const [showSuccess, setShowSuccess] = useState(false);

  const gridDimensions = TILES_CONFIG.DIFFICULTIES[difficulty];
  const totalPairs = (gridDimensions.width * gridDimensions.height) / 2;

  // Calculate cell size based on window size and grid dimensions
  useEffect(() => {
    const updateCellSize = () => {
      const maxWidth = window.innerWidth * 0.9; // 90% of viewport width
      const maxHeight = window.innerHeight * 0.8; // 80% of viewport height
      const width = Math.min(maxWidth / gridDimensions.width, TILES_CONFIG.MAX_CELL_SIZE);
      const height = Math.min(maxHeight / gridDimensions.height, TILES_CONFIG.MAX_CELL_SIZE);
      setCellSize(100);
    };
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, [gridDimensions]);

  // Initialize game on component mount
  useEffect(() => {
    startNewGame();
  }, []);

  // Handle game won
  useEffect(() => {
    if (gameWon && !showSuccess) {
      playVictory();
      speakMessage(`Congratulations! You completed the memory game in ${moveCount} moves with ${matchCount} matches!`);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, TILES_CONFIG.VICTORY_DELAY);
    }
  }, [gameWon, moveCount, matchCount, playVictory, showSuccess]);

  const startNewGame = useCallback(() => {
    initializeGame();
    speakMessage(`Memory tiles game started! ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty. Find matching pairs by clicking tiles.`);
  }, [initializeGame, difficulty]);

  const handleTileClickWithAudio = useCallback((index: number) => {
    const success = handleTileClick(index);
    if (!success) {
      playWallHit();
    }
  }, [handleTileClick, playWallHit]);

  const handleDifficultyChange = useCallback((newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
    setTimeout(() => {
      startNewGame();
    }, 100);
  }, [setDifficulty, startNewGame]);

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
    <div style={{
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
    }}>
      <VictoryModal 
        isVisible={showSuccess} 
        moveCount={moveCount}
        customMessage={`You found all ${matchCount} pairs!`}
      />
      
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '1rem',
        color: '#ff6b6b',
        fontWeight: 'bold',
        textShadow: '0 0 15px rgba(255, 107, 107, 0.5)',
      }}>
        Memory Tiles
      </h1>

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