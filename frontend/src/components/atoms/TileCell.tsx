import React from 'react';

interface TileCellProps {
  color: string;
  isRevealed: boolean;
  isMatched: boolean;
  isSelected: boolean;
  onClick: () => void;
  size: number;
  symbol?: string;
}

export const TileCell: React.FC<TileCellProps> = ({
  color,
  isRevealed,
  isMatched,
  isSelected,
  onClick,
  size,
  symbol,
}) => {
  const getCellStyle = () => ({
    width: size,
    height: size,
    background:
      isRevealed || isMatched
        ? `linear-gradient(135deg, ${color}, ${color}dd)`
        : '#404258',
    border: `3px solid ${isSelected ? '#61dafb' : 'transparent'}`,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isMatched ? 'default' : 'pointer',
    transition: 'all 0.3s ease',
    fontSize: `${size * 0.4}px`,
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    boxShadow:
      isRevealed || isMatched
        ? `0 4px 15px ${color}40, inset 0 1px 0 rgba(255,255,255,0.2)`
        : '0 2px 8px rgba(0,0,0,0.3)',
    transform: isSelected ? 'scale(0.95)' : 'scale(1)',
    opacity: isMatched ? 0.7 : 1,
  });

  return (
    <div style={getCellStyle()} onClick={!isMatched ? onClick : undefined}>
      {(isRevealed || isMatched) && (symbol || '●')}
    </div>
  );
};
