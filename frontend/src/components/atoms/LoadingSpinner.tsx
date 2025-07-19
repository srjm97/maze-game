import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      color: '#61dafb',
      fontSize: '1.2rem',
    }}>
      Loading maze...
    </div>
  );
};