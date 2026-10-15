import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { NeoCard } from '../components/common/NeoCard';
import { ShieldCheck, Cpu, Database, Cloud } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <PageHeader
        title="About EduPulse AI"
        subtitle="Empowering technical learners through intelligent personalization and modern web engineering"
      />

      <NeoCard style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1rem' }}>Our Mission</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--neo-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          EduPulse AI was founded on the principle that online technical education should not be one-size-fits-all. Every engineer has different interests, prior experience, and pace. By integrating real server-side progress telemetry with an adaptive rule-based recommendation engine, our platform surfaces the right concepts at the right time.
        </p>
        <p style={{ fontSize: '1.05rem', color: 'var(--neo-text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Unlike superficial tutorial portals, we enforce strict server-side evaluation of quizzes, persistent database records via Aiven MySQL, and clean architectural separation between Spring Boot 3 backends and React 18 clients.
        </p>
      </NeoCard>

      <div className="grid-cols-4">
        {[
          { icon: <Cpu size={26} color="var(--neo-primary)" />, title: 'Java 21 Enterprise', desc: 'Spring Boot 3.3, virtual threads, and production Actuator health monitoring.' },
          { icon: <ShieldCheck size={26} color="var(--neo-secondary)" />, title: 'Stateless Security', desc: 'Spring Security 6 with HMAC-signed JWTs, refresh tokens, and BCrypt.' },
          { icon: <Database size={26} color="var(--neo-accent-coral)" />, title: 'Aiven MySQL', desc: 'Managed cloud database with Flyway repeatable migrations V1 through V5.' },
          { icon: <Cloud size={26} color="var(--neo-primary)" />, title: 'Cloud-Native DevOps', desc: 'Vercel static client hosting and Render Docker multi-stage containers.' },
        ].map((item, idx) => (
          <NeoCard key={idx} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--neo-surface)',
                boxShadow: 'var(--neo-raised-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </div>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{item.title}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--neo-text-secondary)', lineHeight: 1.5 }}>
              {item.desc}
            </p>
          </NeoCard>
        ))}
      </div>
    </div>
  );
};
