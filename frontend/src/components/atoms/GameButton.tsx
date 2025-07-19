import React from 'react';

interface GameButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const GameButton: React.FC<GameButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
}) => {
  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '8px',
    background:
      variant === 'primary'
        ? 'linear-gradient(135deg, #61dafb 0%, #2c5282 100%)'
        : '#404258',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(97, 218, 251, 0.2)',
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};
