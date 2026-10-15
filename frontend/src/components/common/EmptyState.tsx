import React from 'react';
import { FolderOpen } from 'lucide-react';
import { NeoCard } from './NeoCard';
import { NeoButton } from './NeoButton';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
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
          color: 'var(--neo-text-muted)',
          marginBottom: '0.5rem',
        }}
      >
        {icon || <FolderOpen size={32} />}
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{title}</h3>
      <p style={{ maxWidth: '420px', margin: 0, fontSize: '0.9rem', color: 'var(--neo-text-secondary)' }}>
        {description}
      </p>

      {actionText && onAction && (
        <NeoButton variant="primary" size="md" onClick={onAction} style={{ marginTop: '0.75rem' }}>
          {actionText}
        </NeoButton>
      )}
    </NeoCard>
  );
};
