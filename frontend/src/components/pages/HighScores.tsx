import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faMedal,
  faAward,
  faCrown,
  faUser,
  faGamepad,
  faThLarge,
  faRefresh,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import BackButton from '../atoms/BackButton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  created_at: string;
}

interface Score {
  user_email: string;
  score: number;
  user_name?: string;
  user_picture?: string;
}

interface UserScore {
  game_name: string;
  highest_score: number;
}

interface HighScoresProps {
  onBackToLanding: () => void;
}

export default function HighScores({ onBackToLanding }: HighScoresProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mazeLeaderboard, setMazeLeaderboard] = useState<Score[]>([]);
  const [tilesLeaderboards, setTilesLeaderboards] = useState<{
    easy: Score[];
    medium: Score[];
    hard: Score[];
  }>({
    easy: [],
    medium: [],
    hard: [],
  });
  const [userScores, setUserScores] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'global' | 'personal'>('global');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user data from session storage
    const userData = sessionStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchAllScores();
    }
  }, [currentUser]);

  const fetchAllScores = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch global leaderboards
      const [mazeResponse, tilesEasyResponse, tilesMediumResponse, tilesHardResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/score/top10?game_name=maze_easy`).catch(() => ({ data: { top_10_scores: [] } })),
        axios.get(`${API_BASE_URL}/score/top10?game_name=tiles_easy`).catch(() => ({ data: { top_10_scores: [] } })),
        axios.get(`${API_BASE_URL}/score/top10?game_name=tiles_medium`).catch(() => ({ data: { top_10_scores: [] } })),
        axios.get(`${API_BASE_URL}/score/top10?game_name=tiles_hard`).catch(() => ({ data: { top_10_scores: [] } })),
      ]);

      setMazeLeaderboard(mazeResponse.data.top_10_scores || []);
      setTilesLeaderboards({
        easy: tilesEasyResponse.data.top_10_scores || [],
        medium: tilesMediumResponse.data.top_10_scores || [],
        hard: tilesHardResponse.data.top_10_scores || [],
      });

      // Fetch user's personal scores
      const userScorePromises = [
        axios.get(`${API_BASE_URL}/score/highest?user_email=${currentUser.email}&game_name=maze`)
          .then(res => ({ game_name: 'Maze Game', highest_score: res.data.highest_score }))
          .catch(() => null),
        axios.get(`${API_BASE_URL}/score/highest?user_email=${currentUser.email}&game_name=tiles_easy`)
          .then(res => ({ game_name: 'Memory Tiles (Easy)', highest_score: res.data.highest_score }))
          .catch(() => null),
        axios.get(`${API_BASE_URL}/score/highest?user_email=${currentUser.email}&game_name=tiles_medium`)
          .then(res => ({ game_name: 'Memory Tiles (Medium)', highest_score: res.data.highest_score }))
          .catch(() => null),
        axios.get(`${API_BASE_URL}/score/highest?user_email=${currentUser.email}&game_name=tiles_hard`)
          .then(res => ({ game_name: 'Memory Tiles (Hard)', highest_score: res.data.highest_score }))
          .catch(() => null),
      ];

      const userScoreResults = await Promise.all(userScorePromises);
      setUserScores(userScoreResults.filter(score => score !== null) as UserScore[]);

    } catch (error) {
      console.error('Error fetching scores:', error);
      setError('Failed to load scores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <FontAwesomeIcon icon={faCrown} style={{ color: '#ffd700' }} />;
      case 2:
        return <FontAwesomeIcon icon={faTrophy} style={{ color: '#c0c0c0' }} />;
      case 3:
        return <FontAwesomeIcon icon={faMedal} style={{ color: '#cd7f32' }} />;
      default:
        return <span style={{ color: '#8b949e', fontWeight: 'bold' }}>{position}</span>;
    }
  };

  const getGameIcon = (gameName: string) => {
    if (gameName.toLowerCase().includes('maze')) {
      return <FontAwesomeIcon icon={faGamepad} style={{ color: '#61dafb' }} />;
    } else {
      return <FontAwesomeIcon icon={faThLarge} style={{ color: '#ff6b6b' }} />;
    }
  };

  const renderLeaderboard = (scores: Score[], title: string, gameIcon: React.ReactNode) => (
    <div
      style={{
        background: '#282c34',
        borderRadius: '15px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid #404258',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          paddingBottom: '0.5rem',
          borderBottom: '2px solid #404258',
        }}
      >
        {gameIcon}
        <h3 style={{ color: '#fff', margin: 0, fontSize: '1.4rem' }}>{title}</h3>
      </div>
      
      {scores.length === 0 ? (
        <p style={{ color: '#8b949e', textAlign: 'center', margin: '2rem 0' }}>
          No scores recorded yet. Be the first to play!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {scores.map((score, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                background: index < 3 ? '#363842' : '#2c2d31',
                borderRadius: '8px',
                border: score.user_email === currentUser?.email ? '2px solid #61dafb' : '1px solid transparent',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {score.user_email === currentUser?.email && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(97, 218, 251, 0.1) 0%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
                <div style={{ minWidth: '2rem', textAlign: 'center' }}>
                  {getRankIcon(index + 1)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FontAwesomeIcon icon={faUser} style={{ color: '#8b949e' }} />
                  <span style={{ color: score.user_email === currentUser?.email ? '#61dafb' : '#fff' }}>
                    {score.user_email === currentUser?.email ? 'You' : score.user_email.split('@')[0]}
                  </span>
                </div>
              </div>
              
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: index < 3 ? '#ffd700' : '#fff',
                  zIndex: 1,
                }}
              >
                {score.score} {title.includes('Maze') ? 'moves' : 'moves'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPersonalScores = () => (
    <div
      style={{
        background: '#282c34',
        borderRadius: '15px',
        padding: '2rem',
        border: '1px solid #404258',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #404258',
        }}
      >
        {currentUser?.picture && (
          <img
            src={currentUser.picture}
            alt={currentUser.name}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '2px solid #61dafb',
            }}
          />
        )}
        <div>
          <h2 style={{ color: '#61dafb', margin: 0, fontSize: '1.8rem' }}>
            {currentUser?.name}'s Best Scores
          </h2>
          <p style={{ color: '#8b949e', margin: 0, fontSize: '0.9rem' }}>
            Your personal achievements across all games
          </p>
        </div>
      </div>

      {userScores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <FontAwesomeIcon
            icon={faGamepad}
            style={{ fontSize: '3rem', color: '#404258', marginBottom: '1rem' }}
          />
          <p style={{ color: '#8b949e', fontSize: '1.2rem' }}>
            No scores recorded yet. Start playing to see your achievements here!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {userScores.map((userScore, index) => (
            <div
              key={index}
              style={{
                background: '#363842',
                padding: '1.5rem',
                borderRadius: '10px',
                border: '1px solid #404258',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {getGameIcon(userScore.game_name)}
                <div>
                  <h4 style={{ color: '#fff', margin: 0, fontSize: '1.1rem' }}>
                    {userScore.game_name}
                  </h4>
                  <p style={{ color: '#8b949e', margin: 0, fontSize: '0.9rem' }}>
                    Best Performance
                  </p>
                </div>
              </div>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#ffd700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FontAwesomeIcon icon={faAward} />
                {userScore.highest_score}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1b1e',
          color: '#fff',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <FontAwesomeIcon
            icon={faRefresh}
            spin
            style={{ fontSize: '3rem', color: '#61dafb', marginBottom: '1rem' }}
          />
          <p style={{ fontSize: '1.2rem' }}>Loading scores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1b1e',
          color: '#fff',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#ff6b6b', fontSize: '1.2rem', marginBottom: '1rem' }}>{error}</p>
          <button
            onClick={fetchAllScores}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#61dafb',
              color: '#1a1b1e',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1a1b1e',
        color: '#fff',
        padding: '2rem',
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .fade-in {
            animation: fadeIn 0.6s ease-out;
          }
          .slide-in {
            animation: slideIn 0.8s ease-out;
          }
        `}
      </style>

      <BackButton onClick={onBackToLanding} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1
            style={{
              fontSize: '3rem',
              color: '#61dafb',
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(97, 218, 251, 0.5)',
              marginBottom: '0.5rem',
            }}
          >
            <FontAwesomeIcon icon={faTrophy} style={{ marginRight: '1rem' }} />
            High Scores
          </h1>
          <p style={{ color: '#8b949e', fontSize: '1.2rem' }}>
            See how you rank against other players
          </p>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2rem',
            gap: '1rem',
          }}
        >
          {[
            { key: 'global', label: 'Global Leaderboards', icon: faTrophy },
            { key: 'personal', label: 'My Scores', icon: faUser },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as 'global' | 'personal')}
              style={{
                padding: '1rem 2rem',
                background: selectedTab === tab.key ? '#61dafb' : 'transparent',
                color: selectedTab === tab.key ? '#1a1b1e' : '#61dafb',
                border: '2px solid #61dafb',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <FontAwesomeIcon icon={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on selected tab */}
        <div className="slide-in">
          {selectedTab === 'global' ? (
            <div>
              {renderLeaderboard(
                mazeLeaderboard,
                'Maze Game Leaderboard',
                <FontAwesomeIcon icon={faGamepad} style={{ color: '#61dafb' }} />
              )}
              
              <div style={{ marginBottom: '2rem' }}>
                <h2
                  style={{
                    color: '#ff6b6b',
                    textAlign: 'center',
                    marginBottom: '2rem',
                    fontSize: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FontAwesomeIcon icon={faThLarge} />
                  Memory Tiles Leaderboards
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                  {renderLeaderboard(
                    tilesLeaderboards.easy,
                    'Easy',
                    <span style={{ color: '#4ade80', fontWeight: 'bold' }}>🟢</span>
                  )}
                  {renderLeaderboard(
                    tilesLeaderboards.medium,
                    'Medium',
                    <span style={{ color: '#facc15', fontWeight: 'bold' }}>🟡</span>
                  )}
                  {renderLeaderboard(
                    tilesLeaderboards.hard,
                    'Hard',
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>🔴</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            renderPersonalScores()
          )}
        </div>

        {/* Refresh Button */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button
            onClick={fetchAllScores}
            disabled={loading}
            style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #61dafb 0%, #2c5282 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <FontAwesomeIcon icon={faRefresh} spin={loading} />
            {loading ? 'Refreshing...' : 'Refresh Scores'}
          </button>
        </div>
      </div>
    </div>
  );
}