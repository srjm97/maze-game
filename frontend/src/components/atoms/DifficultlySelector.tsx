import React from 'react';
import { GameButton } from './GameButton';

interface DifficultySelectorProps {
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onDifficultyChange,
}) => {
  const difficulties = [
    { value: 'easy' as const, label: 'Easy (3x4)', color: '#4ade80' },
    { value: 'medium' as const, label: 'Medium (4x4)', color: '#f59e0b' },
    { value: 'hard' as const, label: 'Hard (4x6)', color: '#ef4444' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      marginBottom: '20px',
    }}>
      <span style={{ color: '#8b949e', fontSize: '1rem', marginRight: '10px' }}>
        Difficulty:
      </span>
      {difficulties.map((difficulty) => (
        <button
          key={difficulty.value}
          onClick={() => onDifficultyChange(difficulty.value)}
          style={{
            padding: '8px 16px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            borderRadius: '6px',
            background: selectedDifficulty === difficulty.value 
              ? difficulty.color 
              : '#404258',
            color: '#fff',
            border: `2px solid ${selectedDifficulty === difficulty.value ? difficulty.color : 'transparent'}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {difficulty.label}
        </button>
      ))}
    </div>
  );
};