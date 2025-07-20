import React, { useState, useEffect } from 'react';
import { MantineProvider } from '@mantine/core';

import LoginComponent from './components/molecules/LoginComponent';
import LandingPage from './LandingPage';
import MazeGame from './components/pages/MazeGame';
import TilesGame from './components/pages/TilesGame';
import HighScores from './components/pages/HighScores'; // Import the HighScores component

type GameType = 'maze' | 'tiles' | 'highscores' | null;

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  created_at: string;
}

function App() {
  const [currentGame, setCurrentGame] = useState<GameType>(null);
  const [user, setUser] = useState<User | null>(null);

  // On mount, check for logged in user
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user_data');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        sessionStorage.removeItem('user_data');
      }
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentGame(null);
    sessionStorage.removeItem('user_data');
    sessionStorage.removeItem('access_token');
  };

  const handleGameSelect = (gameType: GameType) => {
    setCurrentGame(gameType);
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
  };

  return (
    <MantineProvider>
      <div
        style={{
          minHeight: '100vh',
          background: '#1a1b1e',
          position: 'relative',
        }}
      >
        {!user ? (
          <LoginComponent onLogin={handleLogin} onLogout={handleLogout} />
        ) : currentGame === 'maze' ? (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <MazeGame onBackToLanding={handleBackToMenu} />
          </div>
        ) : currentGame === 'tiles' ? (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <TilesGame onBackToMenu={handleBackToMenu} />
          </div>
        ) : currentGame === 'highscores' ? (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <HighScores onBackToLanding={handleBackToMenu} />
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