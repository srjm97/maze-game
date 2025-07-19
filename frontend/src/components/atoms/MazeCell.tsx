import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStar, faCube } from '@fortawesome/free-solid-svg-icons';

interface MazeCellProps {
  cellType: 'wall' | 'path' | 'player' | 'goal';
  size: number;
}

export const MazeCell: React.FC<MazeCellProps> = ({ cellType, size }) => {
  const getCellStyle = () => ({
    width: size,
    height: size,
    background: cellType === 'wall' ? '#404258' : '#282c34',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${size * 0.6}px`,
    transition: 'all 0.3s ease',
    border: cellType !== 'wall' ? '1px solid #363842' : 'none',
    borderRadius: '2px',
  });

  const renderIcon = () => {
    switch (cellType) {
      case 'player':
        return (
          <FontAwesomeIcon 
            icon={faUser} 
            color="#61dafb" 
            style={{ filter: 'drop-shadow(0 0 5px rgba(97, 218, 251, 0.5))' }} 
          />
        );
      case 'goal':
        return (
          <FontAwesomeIcon 
            icon={faStar} 
            color="#ffd700" 
            style={{ filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))' }} 
          />
        );
      case 'wall':
        return (
          <FontAwesomeIcon 
            icon={faCube} 
            color="#6b7280" 
            style={{ 
              opacity: 1,
              filter: 'drop-shadow(0 0 3px rgba(107, 114, 128, 0.5))'
            }} 
          />
        );
      default:
        return null;
    }
  };

  return <div style={getCellStyle()}>{renderIcon()}</div>;
};