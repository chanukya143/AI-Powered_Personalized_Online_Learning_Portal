import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { NeoCard } from '../components/common/NeoCard';
import { NeoButton } from '../components/common/NeoButton';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="container" style={{ maxWidth: '600px', textAlign: 'center', padding: '4rem 1rem' }}>
      <NeoCard style={{ padding: '3.5rem 2rem', borderRadius: 'var(--radius-xl)' }}>
        <h1
          style={{
            fontSize: '5rem',
            fontWeight: 900,
            color: 'var(--neo-primary)',
            margin: '0 0 0.5rem 0',
            lineHeight: 1,
          }}
        >
          404
        </h1>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--neo-text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
          The page or curriculum module you are attempting to access does not exist or has been relocated.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/">
            <NeoButton variant="primary" size="md" icon={<Home size={16} />}>
              Return Home
            </NeoButton>
          </Link>
          <Link to="/courses">
            <NeoButton variant="neutral" size="md" icon={<Compass size={16} />}>
              Explore Catalog
            </NeoButton>
          </Link>
        </div>
      </NeoCard>
    </div>
  );
};
