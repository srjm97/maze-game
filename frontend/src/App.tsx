import React, { useState } from 'react';
import MazeGame from './MazeGame';
import LandingPage from './LandingPage';
import { MantineProvider } from '@mantine/core';

function App() {
  const [showGame, setShowGame] = useState(false);

  return (
    <MantineProvider>
      <div style={{
        minHeight: '100vh',
        background: '#1a1b1e'
      }}>
        {showGame ? (
          <div style={{
            animation: 'fadeIn 0.5s ease'
          }}>
            <MazeGame />
          </div>
        ) : (
          <LandingPage onStartGame={() => setShowGame(true)} />
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
