import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStar, faCube } from '@fortawesome/free-solid-svg-icons';

// Cell size will be dynamic based on screen size
const MIN_CELL_SIZE = 25;
const MAX_CELL_SIZE = 40;

interface Position {
  x: number;
  y: number;
}

interface GameState {
  player_position: Position;
  goal_position: Position;
  maze_layout: number[][];
  game_over: boolean;
}

export default function MazeGame() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [cellSize, setCellSize] = useState(MIN_CELL_SIZE);
  const [showSuccess, setShowSuccess] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  // Calculate cell size based on window size and maze dimensions
  useEffect(() => {
    const calculateCellSize = () => {
      if (!gameState) return;
      
      const padding = 64; // 32px padding on each side
      const availableWidth = Math.min(window.innerWidth - padding, window.innerHeight - 300);
      const availableHeight = availableWidth; // Keep it square
      
      const maxCellWidth = (availableWidth * 0.8) / gameState.maze_layout[0].length;
      const maxCellHeight = (availableHeight * 0.8) / gameState.maze_layout.length;
      
      let newSize = Math.min(maxCellWidth, maxCellHeight);
      newSize = Math.min(Math.max(newSize, MIN_CELL_SIZE), MAX_CELL_SIZE);
      
      setCellSize(newSize);
    };

    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);
    return () => window.removeEventListener('resize', calculateCellSize);
  }, [gameState]);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/game', {
        width: 15,
        height: 15
      });
      setGameId(response.data);
      await fetchGameState(response.data);
    } catch (error) {
      console.error('Error starting new game:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGameState = async (currentGameId: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/game/${currentGameId}`);
      setGameState(response.data);
    } catch (error) {
      console.error('Error fetching game state:', error);
    }
  };

  const movePlayer = async (direction: string) => {
    if (!gameId || gameState?.game_over) return;

    try {
      const response = await axios.post(`http://localhost:8000/game/${gameId}/move`, {
        direction
      });
      setGameState(response.data);

      setMoveCount(prev => prev + 1);
      
      if (response.data.game_over) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          startNewGame();
        }, 2000);
      }
    } catch (error) {
      console.error('Error moving player:', error);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      event.preventDefault(); // Prevent default keyboard behavior
      
      const keyMap: { [key: string]: string } = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'w': 'up',
        's': 'down',
        'a': 'left',
        'd': 'right'
      };

      const direction = keyMap[event.key];
      if (direction) {
        movePlayer(direction);
      }
    };

    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        startNewGame();
        return;
      }
      handleKeyPress(e);
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, [gameId, gameState]);

  if (loading || !gameState) {
    return <div>Loading...</div>;
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
      padding: '16px'
    }}>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes celebrate {
            0% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.2) rotate(-5deg); }
            75% { transform: scale(1.2) rotate(5deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          .success-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            animation: fadeIn 0.3s ease;
          }
          .success-message {
            background: #2c5282;
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            animation: celebrate 0.5s ease;
          }
        `}
      </style>
      
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-message">
            <h2 style={{ color: '#61dafb', marginBottom: '1rem' }}>
              Congratulations!
            </h2>
            <p>You completed the maze in {moveCount} moves!</p>
          </div>
        </div>
      )}
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '1rem',
        color: '#61dafb',
        fontWeight: 'bold',
        textShadow: '0 0 10px rgba(97, 218, 251, 0.5)'
      }}>
        EchoMaze
      </h1>
      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `repeat(${gameState.maze_layout[0].length}, ${cellSize}px)`,
        gap: '1px',
        background: '#2c2d31',
        padding: '16px',
        borderRadius: '10px',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        margin: '20px auto',
        maxWidth: '90vw',
        placeItems: 'center',
        overflow: 'auto'
      }}>
        {gameState.maze_layout.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: cellSize,
                height: cellSize,
                background: cell === 1 ? '#404258' : '#282c34',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${cellSize * 0.6}px`,
                transition: 'all 0.3s ease',
                border: cell === 0 ? '1px solid #363842' : 'none',
                borderRadius: '2px'
              }}
            >
              {gameState.player_position.x === x && gameState.player_position.y === y ? (
                <FontAwesomeIcon icon={faUser} color="#61dafb" style={{ filter: 'drop-shadow(0 0 5px rgba(97, 218, 251, 0.5))' }} />
              ) : gameState.goal_position.x === x && gameState.goal_position.y === y ? (
                <FontAwesomeIcon icon={faStar} color="#ffd700" style={{ filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))' }} />
              ) : cell === 1 ? (
                <FontAwesomeIcon icon={faCube} color="#6b7280" style={{ 
                  opacity: 1,
                  filter: 'drop-shadow(0 0 3px rgba(107, 114, 128, 0.5))'
                }} />
              ) : null}
            </div>
          ))
        )}
      </div>
      <div style={{
        display: 'flex',
        gap: '20px',
        marginTop: '20px'
      }}>
        <button
          onClick={startNewGame}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #61dafb 0%, #2c5282 100%)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(97, 218, 251, 0.2)'
          }}
        >
          New Game
        </button>
      </div>
      <div style={{
        marginTop: '20px',
        color: '#8b949e',
        fontSize: '0.9rem',
        textAlign: 'center'
      }}>
        Use arrow keys or WASD to move • Press spacebar to restart
      </div>
    </div>
  );
}
