import React, { ButtonHTMLAttributes } from 'react';

interface StyledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | React.ReactNode;
}

const StyledButton: React.FC<StyledButtonProps> = ({ label, ...props }) => {
  return (
    <button
      {...props}
      style={{
        padding: '12px 28px',
        background: 'linear-gradient(135deg, #38cdf6ff, #067799ff)',
        border: 'none',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        ...(props.style || {}), // Allow custom overrides
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          'linear-gradient(135deg, #3fe7ff, #0699cc)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          '0 6px 20px rgba(56, 205, 246, 0.5)';
        (e.currentTarget as HTMLButtonElement).style.transform =
          'translateY(-3px) scale(1.05)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          'linear-gradient(135deg, #38cdf6ff, #067799ff)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          '0 4px 10px rgba(0, 0, 0, 0.3)';
        (e.currentTarget as HTMLButtonElement).style.transform =
          'translateY(0) scale(1)';
      }}
    >
      {label}
    </button>
  );
};

export default StyledButton;
