import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const BackButton = ({ onClick, label = 'Back to Games' }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '10px 15px',
        fontSize: '1rem',
        fontWeight: 'bold',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#61dafb',
        border: '2px solid #61dafb',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backdropFilter: 'blur(10px)',
      }}
    >
      <FontAwesomeIcon icon={faArrowLeft} />
      {label}
    </button>
  );
};

export default BackButton;
