import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStar, faCube } from '@fortawesome/free-solid-svg-icons';
import { messages } from './constants/messages';
import { speakMessage } from './utils/speakmessage';

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
  const [audioContext] = useState<AudioContext | null>(() => new (window.AudioContext || (window as any).webkitAudioContext)());
  
  

  // Create audio for wall collision
  const playWallHitSound = () => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  // Create victory music - a simple celebratory melody
  const playVictoryMusic = () => {
    if (!audioContext) return;
    
    // Victory melody notes (frequencies in Hz)
    const melody = [
      { freq: 523, duration: 0.3 }, // C5
      { freq: 659, duration: 0.3 }, // E5
      { freq: 784, duration: 0.3 }, // G5
      { freq: 1047, duration: 0.6 }, // C6
      { freq: 784, duration: 0.3 }, // G5
      { freq: 1047, duration: 0.8 }, // C6 (longer)
    ];
    
    let currentTime = audioContext.currentTime + 0.1;
    
    melody.forEach((note) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(note.freq, currentTime);
      
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + note.duration);
      
      currentTime += note.duration;
    });
  };


  // Create beacon sound that changes with distance to goal
  const playBeaconSound = (distance: number) => {
    if (!audioContext || !gameState) return;
    
    const maxDistance = Math.sqrt(
      Math.pow(gameState.maze_layout[0].length, 2) + 
      Math.pow(gameState.maze_layout.length, 2)
    );
    
    const normalizedDistance = distance / maxDistance;
    const frequency = 300 + (1 - normalizedDistance) * 500; // Higher pitch as you get closer
    const volume = 0.05 + (1 - normalizedDistance) * 0.15; // Louder as you get closer
    
    // Calculate horizontal direction to goal
    const xDiff = gameState.goal_position.x - gameState.player_position.x;
    const panValue = Math.max(-1, Math.min(1, xDiff / 5)); // Normalize to -1 to 1 range
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const panner = audioContext.createStereoPanner();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    panner.pan.setValueAtTime(panValue, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
    
    // Calculate direction for audio panning
    const direction = xDiff > 0 ? "right" : xDiff < 0 ? "left" : "straight ahead";
  };

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
      setMoveCount(0); // Reset move count for new game
      const response = await axios.post('http://localhost:8000/game', {
        width: 15,
        height: 15
      });
      setGameId(response.data);
      await fetchGameState(response.data);
      speakMessage(`${messages.startGame},${messages.instructions}`);

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

      // If move was invalid (hit a wall), play wall hit sound
      if (!response.data) {
        playWallHitSound();
        return;
      }

      setGameState(response.data);
      setMoveCount(prev => prev + 1);
      
      if (response.data.game_over) {
        // Play victory music, speak victory message, and show success message
        playVictoryMusic();
        speakMessage(messages.victory)
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          startNewGame();
        }, 4000); // Extended to 4 seconds to let the voice and music complete
      } else {
        // Calculate distance to goal and play beacon sound
        const distance = Math.sqrt(
          Math.pow(response.data.player_position.x - response.data.goal_position.x, 2) +
          Math.pow(response.data.player_position.y - response.data.goal_position.y, 2)
        );
        playBeaconSound(distance);
      }
    } catch (error) {
      console.error('Error moving player:', error);
      playWallHitSound(); // Play wall hit sound on invalid moves
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
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
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
            background: linear-gradient(135deg, #2c5282 0%, #61dafb 100%);
            padding: 3rem;
            border-radius: 15px;
            text-align: center;
            animation: celebrate 0.5s ease;
            box-shadow: 0 0 30px rgba(97, 218, 251, 0.5);
            border: 2px solid #61dafb;
          }
          .victory-text {
            font-size: 2.5rem;
            font-weight: bold;
            background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            animation: sparkle 2s ease-in-out infinite;
            margin-bottom: 1rem;
          }
        `}
      </style>
      
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-message">
            <div className="victory-text">
              🎉 You have won the game! 🎉
            </div>
            <h2 style={{ color: '#61dafb', marginBottom: '1rem', fontSize: '1.8rem' }}>
              Congratulations!
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#fff' }}>
              You completed the maze in {moveCount} moves!
            </p>
            <p style={{ fontSize: '1rem', color: '#8b949e', marginTop: '1rem' }}>
              Starting a new game in a moment...
            </p>
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
        alignItems: 'center',
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
        <div style={{
          fontSize: '1.1rem',
          color: '#61dafb',
          fontWeight: 'bold'
        }}>
          Moves: {moveCount}
        </div>
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