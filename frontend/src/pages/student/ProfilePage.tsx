import React, { useState } from 'react';
import { User, Mail, Shield, Check, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { getApiErrorMessage } from '../../services/apiClient';
import { PageHeader } from '../../components/common/PageHeader';
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

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.learningInterests
      ? user.learningInterests.split(',').map((s) => s.trim()).filter(Boolean)
      : []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const updated = await authService.updateProfile({
        fullName: fullName.trim(),
        learningInterests: selectedInterests.join(', '),
      });
      updateUser(updated);
      setSuccessMessage('Profile and learning interests updated successfully!');
    } catch (err: unknown) {
      setErrorMessage(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <PageHeader
        title="Learning Profile"
        subtitle="Manage your personal information and adjust topic interests that steer your AI recommendations."
      />

      <NeoCard style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
        {successMessage && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--neo-success)',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
            }}
          >
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--neo-danger)',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Readonly Account Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neo-text-muted)' }}>
                Account Email
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(235, 240, 245, 0.7)',
                  border: '1px solid rgba(163, 177, 198, 0.25)',
                  fontSize: '0.95rem',
                  color: 'var(--neo-text-secondary)',
                  marginTop: '0.35rem',
                }}
              >
                <Mail size={16} />
                <span>{user?.email}</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neo-text-muted)' }}>
                System Role
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(235, 240, 245, 0.7)',
                  border: '1px solid rgba(163, 177, 198, 0.25)',
                  fontSize: '0.95rem',
                  color: 'var(--neo-text-secondary)',
                  marginTop: '0.35rem',
                }}
              >
                <Shield size={16} />
                <span>{user?.role}</span>
              </div>
            </div>
          </div>

          <NeoInput
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<User size={18} />}
            required
          />

          {/* Interests Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--neo-text)' }}>
              Active Learning Interests
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--neo-text-muted)', margin: 0 }}>
              The recommendation engine scores catalog courses against your active tags.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {PRESET_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-full)',
                      border: isSelected
                        ? '1.5px solid var(--neo-primary)'
                        : '1px solid rgba(163, 177, 198, 0.4)',
                      backgroundColor: isSelected ? 'var(--neo-primary)' : 'var(--neo-surface)',
                      color: isSelected ? '#FFFFFF' : 'var(--neo-text-secondary)',
                      boxShadow: isSelected
                        ? '0 2px 6px rgba(91, 103, 241, 0.4)'
                        : 'var(--neo-raised-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isSelected && <Check size={14} />}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <NeoButton
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            icon={<Save size={18} />}
            style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
          >
            Save Changes
          </NeoButton>
        </form>
      </NeoCard>
    </div>
  );
};
