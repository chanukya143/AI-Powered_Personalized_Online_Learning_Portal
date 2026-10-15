import React, { forwardRef } from 'react';

export interface NeoSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const NeoSelect = forwardRef<HTMLSelectElement, NeoSelectProps>(
  ({ label, error, options, className = '', id, style, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
        {label && (
          <label
            htmlFor={selectId}
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: error ? 'var(--neo-danger)' : 'var(--neo-text)',
            }}
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--neo-surface)',
            borderRadius: 'var(--radius-md)',
            border: error
              ? '1.5px solid var(--neo-danger)'
              : '1px solid rgba(163, 177, 198, 0.35)',
            boxShadow: 'var(--neo-inset)',
            color: 'var(--neo-text)',
            fontSize: '0.95rem',
            outline: 'none',
            cursor: 'pointer',
            ...style,
          }}
          className={`neo-select ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && (
          <span style={{ fontSize: '0.8rem', color: 'var(--neo-danger)', fontWeight: 500 }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

NeoSelect.displayName = 'NeoSelect';
