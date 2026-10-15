import React from 'react';

interface NeoProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const NeoProgress: React.FC<NeoProgressProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'primary',
  size = 'md',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const height = {
    sm: '8px',
    md: '14px',
    lg: '20px',
  }[size];

  const getColorGradient = () => {
    switch (color) {
      case 'secondary':
        return 'linear-gradient(90deg, #16A6A1, #2FD5CE)';
      case 'success':
        return 'linear-gradient(90deg, #10B981, #34D399)';
      case 'primary':
      default:
        return 'linear-gradient(90deg, #5B67F1, #8B95FC)';
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {(label || showPercentage) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--neo-text-secondary)',
          }}
        >
          {label && <span>{label}</span>}
          {showPercentage && <span style={{ color: 'var(--neo-text)' }}>{percentage}%</span>}
        </div>
      )}

      {/* Progress Track */}
      <div
        style={{
          width: '100%',
          height,
          backgroundColor: 'var(--neo-surface)',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--neo-inset-sm)',
          border: '1px solid rgba(163, 177, 198, 0.25)',
          overflow: 'hidden',
          padding: '2px',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: getColorGradient(),
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 6px rgba(91, 103, 241, 0.4)',
          }}
        />
      </div>
    </div>
  );
};
