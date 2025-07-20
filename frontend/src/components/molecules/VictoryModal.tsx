import axios from 'axios';
import React, { useEffect } from 'react';

interface VictoryModalProps {
  isVisible: boolean;
  moveCount: number;
  customMessage?: string;
  gameType: 'maze' | 'tiles';
  difficulty?: string;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isVisible,
  moveCount,
  customMessage,
  gameType= 'maze',
  difficulty = 'easy',
}) => {
  if (!isVisible) return null;
  const userEmail = (() => {
    try {
      const userData = sessionStorage.getItem('user_data');
      if (!userData) return 'guest@unknown.local';
      const parsed = JSON.parse(userData);
      return parsed?.email || 'guest@unknown.local';
    } catch {
      return 'guest@unknown.local';
    }
  })();


  useEffect(() => {
  
    axios
      .post('http://localhost:8000/score/add', null, {
        params: {
          user_email: userEmail,
          game_name: `${gameType}_${difficulty || 'easy'}`,
          score: moveCount,
        },
      })
      .then((res) => {
        console.log('Score submitted:', res.data);
      })
      .catch((err) => {
        console.error('Error submitting score:', err);
      });
  }, []);

  return (
    <div className="success-overlay">
      <div className="success-message">
        <div className="victory-text">🎉 You have won the game! 🎉</div>
        <h2
          style={{
            color: '#61dafb',
            marginBottom: '1rem',
            fontSize: '1.8rem',
          }}
        >
          Congratulations!
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#fff' }}>
          You completed the maze in {moveCount} moves!
        </p>
        <p
          style={{
            fontSize: '1rem',
            color: '#8b949e',
            marginTop: '1rem',
          }}
        >
          Starting a new game in a moment...
        </p>
      </div>
    </div>
  );
};
