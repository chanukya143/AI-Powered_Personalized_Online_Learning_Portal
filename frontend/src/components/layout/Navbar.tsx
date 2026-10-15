import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  BotMessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NeoButton } from '../common/NeoButton';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(233, 237, 242, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(163, 177, 198, 0.3)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--neo-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(91, 103, 241, 0.4)',
            }}
          >
            <GraduationCap size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--neo-text)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              EduPulse<span style={{ color: 'var(--neo-primary)' }}>AI</span>
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--neo-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Adaptive Learning
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav"
        >
          <Link
            to="/courses"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/courses') ? 'var(--neo-primary)' : 'var(--neo-text)',
            }}
          >
            Course Catalog
          </Link>

          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <>
                  <Link
                    to="/dashboard"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: isActive('/dashboard') ? 'var(--neo-primary)' : 'var(--neo-text)',
                    }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-courses"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: isActive('/my-courses') ? 'var(--neo-primary)' : 'var(--neo-text)',
                    }}
                  >
                    My Courses
                  </Link>
                  <Link
                    to="/recommendations"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: isActive('/recommendations') ? 'var(--neo-primary)' : 'var(--neo-text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Sparkles size={16} color="var(--neo-primary)" />
                    Recommendations
                  </Link>
                  <Link
                    to="/ai-assistant"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: isActive('/ai-assistant') ? 'var(--neo-primary)' : 'var(--neo-text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <BotMessageSquare size={16} color="var(--neo-secondary)" />
                    AI Tutor
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: isActive('/admin') ? 'var(--neo-primary)' : 'var(--neo-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <ShieldAlert size={16} color="var(--neo-danger)" />
                  Admin Console
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/about"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive('/about') ? 'var(--neo-primary)' : 'var(--neo-text)',
                }}
              >
                About
              </Link>
              <Link
                to="/contact"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive('/contact') ? 'var(--neo-primary)' : 'var(--neo-text)',
                }}
              >
                Contact
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions / Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  textDecoration: 'none',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--neo-surface)',
                  boxShadow: 'var(--neo-raised-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--neo-primary-light)',
                    color: 'var(--neo-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UserIcon size={16} />
                </div>
                <div style={{ display: 'none', flexDirection: 'column' }} className="user-text-pill">
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neo-text)' }}>
                    {user?.fullName.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--neo-text-muted)' }}>
                    {user?.role}
                  </span>
                </div>
              </Link>

              <NeoButton
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                aria-label="Logout"
                style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem' }}
              >
                <LogOut size={18} color="var(--neo-text-secondary)" />
              </NeoButton>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login">
                <NeoButton variant="neutral" size="sm">
                  Log In
                </NeoButton>
              </Link>
              <Link to="/register">
                <NeoButton variant="primary" size="sm">
                  Register
                </NeoButton>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
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
              color: 'var(--neo-text)',
              cursor: 'pointer',
            }}
            className="mobile-hamburger-btn"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid rgba(163, 177, 198, 0.3)',
            backgroundColor: 'var(--neo-surface)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'fadeIn 0.2s ease-out',
          }}
          className="mobile-nav-drawer"
        >
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <BookOpen size={18} /> Course Catalog
          </Link>

          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ fontWeight: 600, padding: '0.5rem 0' }}
                  >
                    Student Dashboard
                  </Link>
                  <Link
                    to="/my-courses"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ fontWeight: 600, padding: '0.5rem 0' }}
                  >
                    My Enrolled Courses
                  </Link>
                  <Link
                    to="/recommendations"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ fontWeight: 600, padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Sparkles size={18} color="var(--neo-primary)" /> Recommendations
                  </Link>
                  <Link
                    to="/ai-assistant"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ fontWeight: 600, padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <BotMessageSquare size={18} color="var(--neo-secondary)" /> AI Tutor
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontWeight: 600, padding: '0.5rem 0', color: 'var(--neo-danger)' }}
                >
                  Admin Console
                </Link>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: 600, padding: '0.5rem 0' }}
              >
                Profile & Interests
              </Link>
              <NeoButton variant="danger" size="sm" onClick={handleLogout} style={{ marginTop: '0.5rem' }}>
                Logout
              </NeoButton>
            </>
          ) : (
            <>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.5rem 0' }}>
                About Platform
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.5rem 0' }}>
                Contact & Feedback
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 868px) {
          .desktop-nav { display: flex !important; }
          .mobile-hamburger-btn { display: none !important; }
          .mobile-nav-drawer { display: none !important; }
          .user-text-pill { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
