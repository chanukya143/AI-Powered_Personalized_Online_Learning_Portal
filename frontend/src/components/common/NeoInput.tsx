import React, { forwardRef, useState } from 'react';

export interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const NeoInput = forwardRef<HTMLInputElement, NeoInputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, style, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: error ? 'var(--neo-danger)' : 'var(--neo-text)',
            }}
          >
            {label}
          </label>
        )}

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {leftIcon && (
            <div
              style={{
                position: 'absolute',
                left: '1rem',
                color: error ? 'var(--neo-danger)' : 'var(--neo-text-muted)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: '100%',
              padding: leftIcon
                ? rightIcon
                  ? '0.75rem 2.75rem'
                  : '0.75rem 1rem 0.75rem 2.75rem'
                : rightIcon
                ? '0.75rem 2.75rem 0.75rem 1rem'
                : '0.75rem 1rem',
              backgroundColor: 'var(--neo-surface)',
              borderRadius: 'var(--radius-md)',
              border: error
                ? '1.5px solid var(--neo-danger)'
                : isFocused
                ? '1.5px solid var(--neo-primary)'
                : '1px solid rgba(163, 177, 198, 0.35)',
              boxShadow: isFocused ? 'var(--neo-inset-focus)' : 'var(--neo-inset)',
              color: 'var(--neo-text)',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
              ...style,
            }}
            className={`neo-input ${className}`}
            {...props}
          />

          {rightIcon && (
            <div
              style={{
                position: 'absolute',
                right: '0.85rem',
                color: 'var(--neo-text-muted)',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <span style={{ fontSize: '0.8rem', color: 'var(--neo-danger)', fontWeight: 500 }}>
            {error}
          </span>
        ) : helperText ? (
          <span style={{ fontSize: '0.8rem', color: 'var(--neo-text-secondary)' }}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

NeoInput.displayName = 'NeoInput';
