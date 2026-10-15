import React from 'react';
import { NeoCard } from './NeoCard';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'var(--neo-primary)',
  trend,
}) => {
  return (
    <NeoCard style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--neo-text-secondary)' }}>
          {title}
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--neo-surface)',
            boxShadow: 'var(--neo-raised-sm)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            color: iconColor,
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--neo-text)' }}>
          {value}
        </h2>
        {trend && (
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: trend.isPositive ? 'var(--neo-success)' : 'var(--neo-danger)',
            }}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <span style={{ fontSize: '0.8rem', color: 'var(--neo-text-muted)' }}>
          {subtitle}
        </span>
      )}
    </NeoCard>
  );
};
