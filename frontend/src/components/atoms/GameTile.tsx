import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface GameTileProps {
  icon: IconDefinition;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

const GameTile: React.FC<GameTileProps> = ({
  icon,
  title,
  description,
  color,
  onClick,
}) => {
  return (
    <div
      className="game-card"
      onClick={onClick}
      style={{
        background: '#282c34',
        padding: '3rem 2rem',
        borderRadius: '15px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: `2px solid transparent`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${color}15 0%, transparent 100%)`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
        className="game-card-bg"
      />

      <FontAwesomeIcon
        icon={icon}
        style={{
          fontSize: '3rem',
          color: color,
          marginBottom: '1.5rem',
          filter: `drop-shadow(0 0 15px ${color}50)`,
          position: 'relative',
          zIndex: 1,
        }}
      />
      <h3
        style={{
          fontSize: '1.8rem',
          marginBottom: '1rem',
          color: '#fff',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: '#8b949e',
          fontSize: '1rem',
          marginBottom: '1.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {description}
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          color: color,
          fontSize: '1rem',
          fontWeight: 'bold',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Play Now
        <FontAwesomeIcon icon={faArrowRight} />
      </div>
    </div>
  );
};

export default GameTile;
