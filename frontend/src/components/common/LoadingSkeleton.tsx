import React from 'react';

interface LoadingSkeletonProps {
  height?: string;
  width?: string;
  borderRadius?: string;
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  height = '20px',
  width = '100%',
  borderRadius = 'var(--radius-md)',
  count = 1,
  className = '',
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            height,
            width,
            borderRadius,
            backgroundColor: 'var(--neo-surface)',
            boxShadow: 'var(--neo-inset-sm)',
            border: '1px solid rgba(163, 177, 198, 0.2)',
          }}
          className={`animate-pulse ${className}`}
        />
      ))}
    </div>
  );
};
