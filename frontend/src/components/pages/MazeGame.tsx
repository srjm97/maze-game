import React, { useState, useEffect, useCallback } from 'react';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { MazeGrid } from '../molecules/MazeGrid';
import { GameControls } from '../molecules/GameControls';
import { VictoryModal } from '../molecules/VictoryModal';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';

import { calculateDistance, calculateCellSize } from '../../utils/gameUtils';
import { messages } from '../../constants/messages';
import { GAME_CONFIG } from '../../constants/gameConstants';
import '../../styles/animations.css';
import { speakMessage } from '../../utils/speakmessage';

export default function MazeGame() {
  const { gameState, loading, moveCount, createNewGame, movePlayer } = useGameState();
  const { playWallHit, playVictory, playBeacon } = useAudio();
  const [cellSize, setCellSize] = useState(GAME_CONFIG.MIN_CELL_SIZE);
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate cell size based on window size and maze dimensions
  useEffect(() => {
    const updateCellSize = () => {
      setCellSize(calculateCellSize(gameState));
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, [gameState]);

  // Start new game on component mount
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = useCallback(async () => {
    await createNewGame(GAME_CONFIG.DEFAULT_WIDTH, GAME_CONFIG.DEFAULT_HEIGHT);
    speakMessage(`${messages.startGame} ${messages.instructions}`);
  }, [createNewGame]);

  const handleMove = useCallback(async (direction: string) => {
    const result = await movePlayer(direction);
    
    if (!result) {
      playWallHit();
      return;
    }

    if (result.game_over) {
      playVictory();
      speakMessage(messages.victory);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        startNewGame();
      }, GAME_CONFIG.VICTORY_DELAY);
    } else {
      const distance = calculateDistance(result.player_position, result.goal_position);
      playBeacon(result, distance);
    }
  }, [movePlayer, playWallHit, playVictory, playBeacon, startNewGame]);

  useKeyboardControls({
    onMove: handleMove,
    onRestart: startNewGame,
    gameId: gameState ? 'active' : null,
    gameOver: gameState?.game_over ?? false,
  });

  if (loading || !gameState) {
    return <LoadingSpinner />;
  }

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
      <VictoryModal isVisible={showSuccess} moveCount={moveCount} />
      
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '1rem',
        color: '#61dafb',
        fontWeight: 'bold',
        textShadow: '0 0 10px rgba(97, 218, 251, 0.5)',
      }}>
        EchoMaze
      </h1>

      <MazeGrid gameState={gameState} cellSize={cellSize} />
      <GameControls onNewGame={startNewGame} moveCount={moveCount} />
    </div>
  );
}