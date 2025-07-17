import React from 'react';
import { faGamepad, faVolumeHigh, faTrophy, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface LandingPageProps {
  onStartGame: () => void;
}

export default function LandingPage({ onStartGame }: LandingPageProps) {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a1b1e',
      color: '#fff',
      padding: '16px',
      gap: '2rem'
    }}>
      <div className="title-container" style={{
        textAlign: 'center',
        animation: 'fadeInDown 0.8s ease-out'
      }}>
        <h1 style={{
          fontSize: '4rem',
          marginBottom: '1rem',
          color: '#61dafb',
          fontWeight: 'bold',
          textShadow: '0 0 20px rgba(97, 218, 251, 0.5)'
        }}>
          EchoMaze
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#8b949e',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Navigate through a dynamically generated maze in this challenging puzzle game
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
        maxWidth: '900px',
        margin: '2rem 0',
        animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
      }}>
        {[
          {
            icon: faGamepad,
            title: 'Intuitive Controls',
            description: 'Use arrow keys or WASD to navigate through the maze'
          },
          {
            icon: faVolumeHigh,
            title: 'Audio Feedback',
            description: 'Listen to spatial audio cues to guide your way'
          },
          {
            icon: faTrophy,
            title: 'Challenge Yourself',
            description: 'Each maze is uniquely generated for a new experience'
          }
        ].map((feature, index) => (
          <div 
            key={index} 
            className="feature-card"
            style={{
              background: '#282c34',
              padding: '2rem',
              borderRadius: '10px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              cursor: 'default'
            }}>
            <FontAwesomeIcon 
              icon={feature.icon} 
              style={{ 
                fontSize: '2.5rem', 
                color: '#61dafb',
                marginBottom: '1rem',
                filter: 'drop-shadow(0 0 10px rgba(97, 218, 251, 0.3))'
              }} 
            />
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '0.5rem',
              color: '#fff'
            }}>
              {feature.title}
            </h3>
            <p style={{
              color: '#8b949e',
              fontSize: '0.9rem'
            }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onStartGame}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #61dafb 0%, #2c5282 100%)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 6px rgba(97, 218, 251, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeInUp 0.8s ease-out 0.4s backwards'
        }}
      >
        Start Game
        <FontAwesomeIcon icon={faArrowRight} />
      </button>

      <style>
        {`
          .feature-card {
            transform: translateY(0);
          }
          .feature-card:hover {
            transform: translateY(-5px);
          }

          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
