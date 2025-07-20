import React, { useState, useEffect } from 'react';
import { Grid } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faStar,
  faCube,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { messages } from '../../constants/messages';
import { speakMessage } from '../../utils/speakmessage';
import { ScoreDisplay } from '../molecules/ScoreDisplay';
import { getBestMazeScore, addMazeScore } from '../../utils/highScoreUtils';
import BackButton from '../atoms/BackButton';
import { VictoryModal } from '../molecules/VictoryModal';


// Maze game logic moved from backend to frontend
class MazeGameEngine {
  width: number;
  height: number;
  maze_layout: number[][];
  player_position: { x: number; y: number };
  goal_position: { x: number; y: number };
  game_over: boolean;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.maze_layout = this.generateMaze(width, height);
    this.player_position = { x: 0, y: 0 };
    this.goal_position = { x: width - 1, y: height - 1 };
    this.game_over = false;
  }

  generateMaze(width: number, height: number): number[][] {
    // Proper maze generation: randomized DFS (same as backend)
    const maze: number[][] = Array.from({ length: height }, () => Array(width).fill(1));

    function carvePath(x: number, y: number) {
      maze[y][x] = 0; // Mark current cell as path
      // Define possible directions (up, right, down, left)
      const directions = [
        [0, -2], // up
        [2, 0],  // right
        [0, 2],  // down
        [-2, 0], // left
      ];
      // Shuffle directions
      for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
      }
      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (
          newX >= 0 && newX < width &&
          newY >= 0 && newY < height &&
          maze[newY][newX] === 1
        ) {
          maze[y + dy / 2][x + dx / 2] = 0;
          maze[newY][newX] = 0;
          carvePath(newX, newY);
        }
      }
    }

    // Start from (0,0)
    carvePath(0, 0);

    // Ensure the goal is accessible
    maze[height - 1][width - 1] = 0;
    // Make sure there's a path to the goal
    if (width > 2 && height > 2) {
      maze[height - 1][width - 2] = 0; // Path to goal horizontally
      maze[height - 2][width - 1] = 0; // Path to goal vertically
    }
    return maze;
  }

  movePlayer(direction: string): boolean {
    if (this.game_over) return false;
    const { x, y } = this.player_position;
    let newX = x;
    let newY = y;
    if (direction === 'up') newY--;
    else if (direction === 'down') newY++;
    else if (direction === 'left') newX--;
    else if (direction === 'right') newX++;

    // Check bounds
    if (
      newX < 0 ||
      newY < 0 ||
      newX >= this.width ||
      newY >= this.height ||
      this.maze_layout[newY][newX] === 1
    ) {
      return false; // Hit wall or out of bounds
    }
    this.player_position = { x: newX, y: newY };
    if (newX === this.goal_position.x && newY === this.goal_position.y) {
      this.game_over = true;
    }
    return true;
  }

  get_game_state() {
    return {
      player_position: this.player_position,
      goal_position: this.goal_position,
      maze_layout: this.maze_layout,
      game_over: this.game_over,
    };
  }

  get_nearby_walls() {
    // Returns walls around the player (up, down, left, right)
    const { x, y } = this.player_position;
    return {
      up: y > 0 ? this.maze_layout[y - 1][x] === 1 : true,
      down: y < this.height - 1 ? this.maze_layout[y + 1][x] === 1 : true,
      left: x > 0 ? this.maze_layout[y][x - 1] === 1 : true,
      right: x < this.width - 1 ? this.maze_layout[y][x + 1] === 1 : true,
    };
  }
}

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

interface MazeGameProps {
  onBackToLanding: () => void;
}

export default function MazeGame({ onBackToLanding }: MazeGameProps) {
  const [mazeGame, setMazeGame] = useState<MazeGameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [cellSize, setCellSize] = useState(MIN_CELL_SIZE);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [audioContext] = useState<AudioContext | null>(
    () => new (window.AudioContext || (window as any).webkitAudioContext)()
  );

  // Create audio for wall collision
  const playWallHitSound = () => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.2
    );

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
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        currentTime + note.duration
      );

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
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );
    panner.pan.setValueAtTime(panValue, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // Calculate cell size based on window size and maze dimensions
  useEffect(() => {
    const calculateCellSize = () => {
      if (!gameState) return;

      const padding = 64; // 32px padding on each side
      const availableWidth = Math.min(
        window.innerWidth - padding,
        window.innerHeight - 300
      );
      const availableHeight = availableWidth; // Keep it square

      const maxCellWidth =
        (availableWidth * 0.8) / gameState.maze_layout[0].length;
      const maxCellHeight =
        (availableHeight * 0.8) / gameState.maze_layout.length;

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

  // Load best score when component mounts
  useEffect(() => {
    setBestScore(getBestMazeScore());
  }, []);

  const startNewGame = () => {
    setLoading(true);
    setMoveCount(0);
    setIsNewRecord(false);
    setShowSuccess(false);
    const newMazeGame = new MazeGameEngine(15, 15);
    setMazeGame(newMazeGame);
    setGameState(newMazeGame.get_game_state());
    speakMessage(`${messages.startGame},${messages.instructions}`);
    setLoading(false);
  };

  const movePlayer = (direction: string) => {
    if (!mazeGame || gameState?.game_over) return;
    const success = mazeGame.movePlayer(direction);
    if (!success) {
      playWallHitSound();
      return;
    }
    const newState = mazeGame.get_game_state();
    setGameState(newState);
    const newMoveCount = moveCount + 1;
    setMoveCount(newMoveCount);
    if (newState.game_over) {
      const scoreResult = addMazeScore(newMoveCount);
      setIsNewRecord(scoreResult.isNewRecord);
      setBestScore(getBestMazeScore());
      playVictoryMusic();
      speakMessage(
        scoreResult.isNewRecord
          ? `${messages.victory} New record with ${newMoveCount} moves!`
          : messages.victory
      );
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        startNewGame();
      }, 4000);
    } else {
      // Calculate distance to goal and play beacon sound
      const distance = Math.sqrt(
        Math.pow(
          newState.player_position.x - newState.goal_position.x,
          2
        ) +
          Math.pow(
            newState.player_position.y - newState.goal_position.y,
            2
          )
      );
      playBeaconSound(distance);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      event.preventDefault(); // Prevent default keyboard behavior

      const keyMap: { [key: string]: string } = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
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
  }, [mazeGame, gameState, moveCount]);

  if (loading || !gameState) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1b1e',
        color: '#fff',
        padding: '16px',
      }}
    >
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

      <BackButton onClick={onBackToLanding} />

      {showSuccess && (
        <VictoryModal
          isVisible={showSuccess}
          moveCount={moveCount}
          customMessage={
            isNewRecord
              ? `🏆 NEW RECORD! You reached in  ${moveCount} pairs! 🏆`
              : `You found all ${moveCount} pairs!`
          }
          gameType="maze"
          difficulty="easy"
        />
      )}

      <h1
        style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          color: '#61dafb',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(97, 218, 251, 0.5)',
        }}
      >
        EchoMaze
      </h1>

      {/* Score Display */}
      <ScoreDisplay
        currentScore={moveCount}
        bestScore={bestScore}
        isNewRecord={isNewRecord && showSuccess}
        gameType="maze"
        difficulty=""
      />

      <div
        style={{
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
          overflow: 'auto',
        }}
      >
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
                borderRadius: '2px',
              }}
            >
              {gameState.player_position.x === x &&
              gameState.player_position.y === y ? (
                <FontAwesomeIcon
                  icon={faUser}
                  color="#61dafb"
                  style={{
                    filter: 'drop-shadow(0 0 5px rgba(97, 218, 251, 0.5))',
                  }}
                />
              ) : gameState.goal_position.x === x &&
                gameState.goal_position.y === y ? (
                <FontAwesomeIcon
                  icon={faStar}
                  color="#ffd700"
                  style={{
                    filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))',
                  }}
                />
              ) : cell === 1 ? (
                <FontAwesomeIcon
                  icon={faCube}
                  color="#6b7280"
                  style={{
                    opacity: 1,
                    filter: 'drop-shadow(0 0 3px rgba(107, 114, 128, 0.5))',
                  }}
                />
              ) : null}
            </div>
          ))
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
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
            boxShadow: '0 4px 6px rgba(97, 218, 251, 0.2)',
          }}
        >
          New Game
        </button>
      </div>

      <div
        style={{
          marginTop: '20px',
          color: '#8b949e',
          fontSize: '0.9rem',
          textAlign: 'center',
        }}
      >
        Use arrow keys or WASD to move • Press spacebar to restart
      </div>
    </div>
  );
}
