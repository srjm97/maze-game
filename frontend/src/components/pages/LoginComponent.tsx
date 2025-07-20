import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import {
  faSpinner,
  faUser,
  faSignOutAlt,
  faGamepad,
} from '@fortawesome/free-solid-svg-icons';
import StyledButton from '../atoms/StyledButton';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  created_at: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface LoginComponentProps {
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export default function LoginComponent({
  onLogin,
  onLogout,
}: LoginComponentProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check if user is already logged in (using in-memory storage)
    const storedUser = sessionStorage.getItem('user_data');
    const storedToken = sessionStorage.getItem('access_token');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        onLogin(parsedUser);
      } catch (err) {
        // Clear invalid data
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('user_data');
      }
    }

    // Handle OAuth callback - check for token or error in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (token) {
      handleTokenFromCallback(token);
    } else if (error) {
      setError('Login failed. Please try again.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [onLogin]);

  const handleTokenFromCallback = async (token: string) => {
    setLoading(true);
    setError('');

    try {
      // Decode the JWT token to get user info
      // Or make a simple API call to verify the token and get user data
      const response = await fetch('http://localhost:8000/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user data');
      }

      const userData = await response.json();

      // Store tokens and user data in sessionStorage
      sessionStorage.setItem('access_token', token);
      sessionStorage.setItem('user_data', JSON.stringify(userData));

      setUser(userData);
      onLogin(userData);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Token processing error:', err);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/auth/google/login');
      if (!response.ok) {
        throw new Error('Failed to get login URL');
      }

      const data = await response.json();
      window.location.href = data.auth_url;
    } catch (err) {
      setError('Failed to initiate login. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('access_token');
      if (token) {
        await fetch('http://localhost:8000/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear session storage regardless of API call success
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('user_data');
      setUser(null);
      onLogout();
    }
  };

  // User profile display when logged in
  if (user) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: '#282c34',
          borderRadius: '12px',
          padding: '16px',
          border: '2px solid #61dafb20',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#fff',
          }}
        >
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid #61dafb',
              }}
            />
          ) : (
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#61dafb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1a1b1e',
              }}
            >
              <FontAwesomeIcon icon={faUser} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
              {user.name}
            </div>
            <div style={{ color: '#8b949e', fontSize: '12px' }}>
              {user.email}
            </div>
          </div>
          <StyledButton
            onClick={handleLogout}
            label={<FontAwesomeIcon icon={faSignOutAlt} />}
          />
        </div>
      </div>
    );
  }

  // Login screen when not authenticated
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
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
          animation: 'fadeInDown 0.8s ease-out',
        }}
      >
        <div
          style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            color: '#61dafb',
          }}
        >
          <FontAwesomeIcon icon={faGamepad} />
        </div>
        <h1
          style={{
            fontSize: '3rem',
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
            maxWidth: '400px',
            margin: '0 auto',
          }}
        >
          Sign in with your Google account to start playing games and save your
          progress
        </p>
      </div>

      <div
        style={{
          background: '#282c34',
          padding: '3rem 2rem',
          borderRadius: '15px',
          border: '2px solid #61dafb20',
          width: '25%',
          textAlign: 'center',
          animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
        }}
      >
        {error && (
          <div
            style={{
              background: '#ff6b6b20',
              color: '#ff6b6b',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #ff6b6b30',
            }}
          >
            {error}
          </div>
        )}

        <StyledButton
        style={{ width: '100%' }}
          label={
            loading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <>
                <FontAwesomeIcon icon={faGoogle} />{' '}
                {loading ? 'Signing in...' : 'Continue with Google'}
              </>
            )
          }
          onClick={handleGoogleLogin}
        />

        <div
          style={{
            marginTop: '20px',
            fontSize: '12px',
            color: '#8b949e',
            lineHeight: '1.4',
          }}
        >
          By signing in, you agree to our terms of service and privacy policy.
          Your game progress and achievements will be saved to your account.
        </div>
      </div>

      <style>
        {`
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
