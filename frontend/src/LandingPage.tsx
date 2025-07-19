import React from 'react';
import {
  faGamepad,
  faThLarge,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface LandingPageProps {
  onGameSelect: (gameType: 'maze' | 'tiles') => void;
}

export default function LandingPage({ onGameSelect }: LandingPageProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1b1e',
        color: '#fff',
        padding: '16px',
        gap: '2rem',
      }}
    >
      <div
        className="title-container"
        style={{
          textAlign: 'center',
          animation: 'fadeInDown 0.8s ease-out',
        }}
      >
        <h1
          style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            color: '#61dafb',
            fontWeight: 'bold',
            textShadow: '0 0 20px rgba(97, 218, 251, 0.5)',
          }}
        >
          Game Console
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            color: '#8b949e',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          Choose your adventure: Navigate mazes or improve memory with colorful
          tiles
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '3rem',
          maxWidth: '800px',
          margin: '2rem 0',
          animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
        }}
      >
        {[
          {
            icon: faGamepad,
            title: 'Maze Game',
            description:
              'Navigate through dynamically generated mazes with audio feedback',
            color: '#61dafb',
            gameType: 'maze' as const,
          },
          {
            icon: faThLarge,
            title: 'Memory Tiles',
            description:
              'Improve memory and cognitive skills with colorful pattern matching',
            color: '#ff6b6b',
            gameType: 'tiles' as const,
          },
        ].map((game, index) => (
          <div
            key={index}
            className="game-card"
            onClick={() => onGameSelect(game.gameType)}
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
                background: `linear-gradient(135deg, ${game.color}15 0%, transparent 100%)`,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
              className="game-card-bg"
            />

            <FontAwesomeIcon
              icon={game.icon}
              style={{
                fontSize: '3rem',
                color: game.color,
                marginBottom: '1.5rem',
                filter: `drop-shadow(0 0 15px ${game.color}50)`,
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
              {game.title}
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
              {game.description}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: game.color,
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
        ))}
      </div>

      <style>
        {`
          .game-card {
            transform: translateY(0);
          }
          .game-card:hover {
            transform: translateY(-10px);
            border-color: #61dafb50;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          }
          .game-card:hover .game-card-bg {
            opacity: 1;
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
