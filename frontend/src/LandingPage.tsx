import {
  faGamepad,
  faThLarge,
} from '@fortawesome/free-solid-svg-icons';

import GameTile from './components/atoms/GameTile';

interface LandingPageProps {
  onGameSelect: (gameType: 'maze' | 'tiles' | 'highscores') => void;
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
           <GameTile
            key={index}
            icon={game.icon}
            title={game.title}
            description={game.description}
            color={game.color}
            onClick={() => onGameSelect(game.gameType)}
          />
        ))}
      </div>
      <button onClick={() => onGameSelect('highscores')}>
        View High Scores
      </button>

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
