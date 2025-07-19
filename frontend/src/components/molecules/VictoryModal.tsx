import React from 'react';

interface VictoryModalProps {
  isVisible: boolean;
  moveCount: number;
  customMessage?: string;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ isVisible, moveCount,customMessage }) => {
  if (!isVisible) return null;

  return (
    <div className="success-overlay">
      <div className="success-message">
        <div className="victory-text">
          🎉 You have won the game! 🎉
        </div>
        <h2 style={{ 
          color: '#61dafb', 
          marginBottom: '1rem', 
          fontSize: '1.8rem' 
        }}>
          Congratulations!
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#fff' }}>
          You completed the maze in {moveCount} moves!
        </p>
        <p style={{ 
          fontSize: '1rem', 
          color: '#8b949e', 
          marginTop: '1rem' 
        }}>
          Starting a new game in a moment...
        </p>
      </div>
    </div>
  );
};