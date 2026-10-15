import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { loginSchema, LoginFormData } from '../../schemas/authSchemas';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../services/apiClient';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoInput } from '../../components/common/NeoInput';
import { NeoButton } from '../../components/common/NeoButton';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data);
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      const currentUserStr = localStorage.getItem('currentUser');
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

      if (currentUser?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from || '/dashboard');
      }
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err));
    }
  };

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 250px)',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <NeoCard style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--neo-text-secondary)', margin: 0 }}>
              Sign in to resume your personalized learning journey
            </p>
          </div>

          {serverError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--neo-danger)',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <NeoInput
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <NeoInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            <NeoButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              icon={<LogIn size={18} />}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              Sign In
            </NeoButton>
          </form>

          {/* Seed accounts helper hint for testing */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(91, 103, 241, 0.08)',
              fontSize: '0.78rem',
              color: 'var(--neo-text-secondary)',
              lineHeight: 1.4,
            }}
          >
            <strong>Demo Credentials:</strong>
            <br />• Student: <code>student@portal.com</code> / <code>Student123!</code>
            <br />• Admin: <code>admin@portal.com</code> / <code>Admin123!</code>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--neo-text-secondary)' }}>Don't have an account? </span>
            <Link to="/register" style={{ fontWeight: 600 }}>
              Sign Up
            </Link>
          </div>
        </NeoCard>
      </div>
    </div>
  );
};
