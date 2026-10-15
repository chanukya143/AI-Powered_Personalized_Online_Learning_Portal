import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'neutral' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  variant = 'neutral',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Size styles
  const sizeStyles = {
    sm: { padding: '0.45rem 0.9rem', fontSize: '0.85rem', gap: '0.4rem', borderRadius: 'var(--radius-md)' },
    md: { padding: '0.65rem 1.4rem', fontSize: '0.95rem', gap: '0.5rem', borderRadius: 'var(--radius-lg)' },
    lg: { padding: '0.85rem 1.8rem', fontSize: '1.05rem', gap: '0.65rem', borderRadius: 'var(--radius-xl)' },
  }[size];

  // Variant color styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #6C77F5, #4A56E2)',
          color: '#FFFFFF',
          boxShadow: isPressed
            ? 'inset 3px 3px 6px rgba(0, 0, 0, 0.3)'
            : '4px 4px 12px rgba(91, 103, 241, 0.4), -4px -4px 12px rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
        };
      case 'secondary':
        return {
          background: 'linear-gradient(135deg, #1DB8B2, #128E8A)',
          color: '#FFFFFF',
          boxShadow: isPressed
            ? 'inset 3px 3px 6px rgba(0, 0, 0, 0.3)'
            : '4px 4px 12px rgba(22, 166, 161, 0.4), -4px -4px 12px rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #F87171, #EF4444)',
          color: '#FFFFFF',
          boxShadow: isPressed
            ? 'inset 3px 3px 6px rgba(0, 0, 0, 0.3)'
            : '4px 4px 12px rgba(239, 68, 68, 0.4), -4px -4px 12px rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--neo-text)',
          boxShadow: 'none',
          border: '1px solid transparent',
        };
      case 'neutral':
      default:
        return {
          background: 'var(--neo-surface)',
          color: 'var(--neo-text)',
          boxShadow: isPressed ? 'var(--neo-inset)' : 'var(--neo-raised-sm)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
        };
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all var(--transition-fast)',
        transform: isPressed ? 'scale(0.98)' : 'none',
        ...sizeStyles,
        ...getVariantStyles(),
        ...style,
      }}
      className={`neo-btn ${className}`}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 18} /> : icon}
      {children}
    </button>
  );
};
