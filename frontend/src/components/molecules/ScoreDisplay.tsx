import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faMedal } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface ScoreDisplayProps {
  currentScore: number;
  bestScore: number | null;
  isNewRecord?: boolean;
  gameType: 'maze' | 'tiles';
  difficulty?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  currentScore,
  bestScore,
  isNewRecord = false,
  gameType,
  difficulty="",
}) => {
  const formatScore = (score: number) =>
    `${score} move${score === 1 ? '' : 's'}`;
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
          score: currentScore,
        },
      })
      .then((res) => {
        console.log('Score submitted:', res.data);
      })
      .catch((err) => {
        console.error('Error submitting score:', err);
      });
  }, [userEmail, gameType, currentScore]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        border: isNewRecord
          ? '2px solid #ffd700'
          : '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isNewRecord
          ? '0 0 20px rgba(255, 215, 0, 0.3)'
          : '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      {isNewRecord && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#ffd700',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            animation: 'sparkle 2s ease-in-out infinite',
          }}
        >
          <FontAwesomeIcon icon={faTrophy} />
          NEW RECORD!
        </div>
      )}

      <div
        style={{
          fontSize: '1.1rem',
          color: '#61dafb',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <FontAwesomeIcon icon={faMedal} />
        Current: {formatScore(currentScore)}
      </div>

      {bestScore !== null && (
        <div
          style={{
            fontSize: '0.95rem',
            color: currentScore <= bestScore ? '#ffd700' : '#8b949e',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FontAwesomeIcon icon={faTrophy} />
          Best: {formatScore(bestScore)}
          {difficulty && ` (${difficulty})`}
        </div>
      )}

      {bestScore === null && (
        <div
          style={{
            fontSize: '0.9rem',
            color: '#8b949e',
          }}
        >
          First game! 🎉
        </div>
      )}
    </div>
  );
};
