import React, { useState } from 'react';

import LandingPage from './LandingPage';
import { MantineProvider } from '@mantine/core';
import MazeGame from './components/pages/MazeGame';
import TilesGame from './components/pages/TilesGame';

type GameType = 'maze' | 'tiles' | null;

function App() {
  const [currentGame, setCurrentGame] = useState<GameType>(null);

  const handleGameSelect = (gameType: GameType) => {
    setCurrentGame(gameType);
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
  };

  return (
    <MantineProvider>
      <div style={{
        minHeight: '100vh',
        background: '#1a1b1e'
      }}>
        {currentGame === 'maze' ? (
          <div style={{
            animation: 'fadeIn 0.5s ease'
          }}>
            <MazeGame onBackToLanding={handleBackToMenu} />
          </div>
        ) : currentGame === 'tiles' ? (
          <div style={{
            animation: 'fadeIn 0.5s ease'
          }}>
            <TilesGame onBackToMenu={handleBackToMenu} />
          </div>
        ) : (
          <LandingPage onGameSelect={handleGameSelect} />
        )}
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </MantineProvider>
  );
}

export default App;