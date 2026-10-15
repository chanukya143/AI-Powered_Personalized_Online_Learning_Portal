import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { NeoCard } from '../components/common/NeoCard';
import { NeoInput } from '../components/common/NeoInput';
import { NeoButton } from '../components/common/NeoButton';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <PageHeader
        title="Get In Touch"
        subtitle="Have feedback on a course or inquiry regarding our platform? Send our engineering team a message."
      />

      <NeoCard style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--neo-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Message Received!
            </h3>
            <p style={{ color: 'var(--neo-text-secondary)', marginBottom: '1.5rem' }}>
              Thank you for contacting EduPulse AI. Our support team will review your message and reply promptly.
            </p>
            <NeoButton variant="neutral" size="md" onClick={() => setIsSubmitted(false)}>
              Send Another Note
            </NeoButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <NeoInput
              label="Your Full Name"
              placeholder="e.g. Elena Rostova"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <NeoInput
              label="Email Address"
              type="email"
              placeholder="e.g. elena@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={18} />}
              required
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--neo-text)' }}>
                Message or Course Feedback
              </label>
              <textarea
                rows={5}
                placeholder="Share your thoughts, suggestions, or technical questions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--neo-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(163, 177, 198, 0.35)',
                  boxShadow: 'var(--neo-inset)',
                  color: 'var(--neo-text)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
                required
              />
            </div>

            <NeoButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSending}
              icon={<Send size={18} />}
              style={{ alignSelf: 'flex-start' }}
            >
              Submit Message
            </NeoButton>
          </form>
        )}
      </NeoCard>
    </div>
  );
};
