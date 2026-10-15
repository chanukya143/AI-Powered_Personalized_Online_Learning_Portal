import React from 'react';

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'raised' | 'inset' | 'flat';
  hoverable?: boolean;
  className?: string;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  children,
  variant = 'raised',
  hoverable = false,
  className = '',
  style,
  ...props
}) => {
  const getShadow = () => {
    if (variant === 'inset') return 'var(--neo-inset)';
    if (variant === 'flat') return 'none';
    return 'var(--neo-raised)';
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--neo-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: getShadow(),
        border: '1px solid rgba(255, 255, 255, 0.45)',
        padding: '1.5rem',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
        cursor: hoverable ? 'pointer' : 'default',
        ...(hoverable && {
          ':hover': {
            transform: 'translateY(-3px)',
            boxShadow: 'var(--neo-raised-hover)',
          },
        }),
        ...style,
      }}
      className={`neo-card ${hoverable ? 'neo-hoverable' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
