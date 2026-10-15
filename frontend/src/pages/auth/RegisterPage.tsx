import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, UserPlus, AlertCircle, Check } from 'lucide-react';
import { registerSchema, RegisterFormData } from '../../schemas/authSchemas';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../services/apiClient';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoInput } from '../../components/common/NeoInput';
import { NeoButton } from '../../components/common/NeoButton';

const PRESET_INTERESTS = [
  'Java',
  'Spring Boot',
  'React',
  'Microservices',
  'Cloud Architecture',
  'DevOps & Docker',
  'AI & Machine Learning',
  'Database Design',
  'Web Security',
];

export const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();

  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Java', 'Spring Boot']);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      learningInterests: 'Java, Spring Boot',
    },
  });

  const toggleInterest = (interest: string) => {
    let updated: string[];
    if (selectedInterests.includes(interest)) {
      updated = selectedInterests.filter((i) => i !== interest);
    } else {
      updated = [...selectedInterests, interest];
    }
    setSelectedInterests(updated);
    setValue('learningInterests', updated.join(', '));
  };

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerAuth({
        ...data,
        learningInterests: selectedInterests.join(', '),
      });
      navigate('/dashboard');
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
        padding: '2rem 1rem',
        minHeight: 'calc(100vh - 250px)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <NeoCard style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Create Your Account
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--neo-text-secondary)', margin: 0 }}>
              Join EduPulse AI for personalized technical learning paths
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
              label="Full Name"
              placeholder="e.g. Alex Chen"
              leftIcon={<UserIcon size={18} />}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

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
              type="password"
              placeholder="At least 6 characters"
              leftIcon={<Lock size={18} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <NeoInput
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              leftIcon={<Lock size={18} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* Learning Interests Picker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--neo-text)' }}>
                Your Primary Learning Interests (Helps AI recommendations)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {PRESET_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-full)',
                        border: isSelected
                          ? '1px solid var(--neo-primary)'
                          : '1px solid rgba(163, 177, 198, 0.4)',
                        backgroundColor: isSelected ? 'var(--neo-primary)' : 'var(--neo-surface)',
                        color: isSelected ? '#FFFFFF' : 'var(--neo-text-secondary)',
                        boxShadow: isSelected
                          ? '0 2px 6px rgba(91, 103, 241, 0.4)'
                          : 'var(--neo-raised-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isSelected && <Check size={12} />}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <NeoButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              icon={<UserPlus size={18} />}
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              Complete Registration
            </NeoButton>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--neo-text-secondary)' }}>Already have an account? </span>
            <Link to="/login" style={{ fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </NeoCard>
      </div>
    </div>
  );
};
