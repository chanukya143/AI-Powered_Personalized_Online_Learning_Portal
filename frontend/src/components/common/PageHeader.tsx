import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.95rem', color: 'var(--neo-text-secondary)', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
