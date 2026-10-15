import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Code2, Globe, Share2, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--neo-surface)',
        borderTop: '1px solid rgba(163, 177, 198, 0.35)',
        marginTop: 'auto',
        padding: '3.5rem 0 2rem 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--neo-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 8px rgba(91, 103, 241, 0.35)',
                }}
              >
                <GraduationCap size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--neo-text)' }}>
                EduPulse<span style={{ color: 'var(--neo-primary)' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--neo-text-secondary)', lineHeight: 1.6 }}>
              An enterprise full-stack adaptive learning portal driven by Java 21 Spring Boot, MySQL, and tactile Neumorphic design physics.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--neo-surface)',
                  boxShadow: 'var(--neo-raised-sm)',
                  color: 'var(--neo-text)',
                }}
                aria-label="GitHub"
              >
                <Code2 size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--neo-surface)',
                  boxShadow: 'var(--neo-raised-sm)',
                  color: 'var(--neo-text)',
                }}
                aria-label="Twitter"
              >
                <Globe size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--neo-surface)',
                  boxShadow: 'var(--neo-raised-sm)',
                  color: 'var(--neo-text)',
                }}
                aria-label="LinkedIn"
              >
                <Share2 size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--neo-text)' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/courses" style={{ fontSize: '0.875rem', color: 'var(--neo-text-secondary)' }}>
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ fontSize: '0.875rem', color: 'var(--neo-text-secondary)' }}>
                  About Platform
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ fontSize: '0.875rem', color: 'var(--neo-text-secondary)' }}>
                  Feedback & Support
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ fontSize: '0.875rem', color: 'var(--neo-text-secondary)' }}>
                  Student Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Curriculums */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--neo-text)' }}>
              Curriculums
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li style={{ fontSize: '0.875rem', color: 'var(--neo-text-secondary)' }}>
                Modern Java 21 & Spring Boot 3
              </li>
              <li style={{ fontSize: '0.875rem', color: 'var(--neo-text-secondary)' }}>
                React 18 & Neumorphism Design
              </li>
              <li style={{ fontSize: '0.875rem', color: 'var(--neo-text-secondary)' }}>
                Cloud Architecture & Render/Vercel
              </li>
              <li style={{ fontSize: '0.875rem', color: 'var(--neo-text-secondary)' }}>
                Flyway & Aiven MySQL Production
              </li>
            </ul>
          </div>

          {/* Security & Tech */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--neo-text)' }}>
              Stack & Infrastructure
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="badge badge-primary">Java 21</span>
              <span className="badge badge-primary">Spring Boot 3</span>
              <span className="badge badge-secondary">MySQL Aiven</span>
              <span className="badge badge-secondary">React 18</span>
              <span className="badge">TypeScript</span>
              <span className="badge">JWT Auth</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(163, 177, 198, 0.25)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--neo-text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} EduPulse AI Online Learning Portal. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={14} color="var(--neo-accent-coral)" /> for lifelong learners
          </div>
        </div>
      </div>
    </footer>
  );
};
