import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { NeoCard } from './NeoCard';
import { NeoButton } from './NeoButton';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while communicating with the server. Please verify your connection or try again.',
  onRetry,
}) => {
  return (
    <NeoCard
      style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        border: '1px solid rgba(239, 68, 68, 0.25)',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--neo-surface)',
          boxShadow: 'var(--neo-raised-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--neo-danger)',
          marginBottom: '0.5rem',
        }}
      >
        <AlertTriangle size={32} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--neo-danger)' }}>
        {title}
      </h3>
      <p style={{ maxWidth: '440px', margin: 0, fontSize: '0.9rem', color: 'var(--neo-text-secondary)' }}>
        {message}
      </p>

      {onRetry && (
        <NeoButton variant="neutral" size="md" onClick={onRetry} icon={<RotateCcw size={16} />} style={{ marginTop: '0.75rem' }}>
          Retry Request
        </NeoButton>
      )}
    </NeoCard>
  );
};
