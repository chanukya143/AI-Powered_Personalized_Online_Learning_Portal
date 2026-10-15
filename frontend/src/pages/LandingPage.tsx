import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  BrainCircuit,
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { Course } from '../types';
import { courseService } from '../services/courseService';
import { NeoCard } from '../components/common/NeoCard';
import { NeoButton } from '../components/common/NeoButton';
import { CourseCard } from '../components/common/CourseCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const LandingPage: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const courses = await courseService.getFeaturedCourses();
        setFeaturedCourses(courses);
      } catch (err) {
        console.error('Failed to load featured courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
      {/* Hero Section */}
      <section className="container" style={{ paddingTop: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '3rem',
          }}
        >
          {/* Left Column: Headlines & CTAs */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--neo-surface)',
                boxShadow: 'var(--neo-raised-sm)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                marginBottom: '1.5rem',
              }}
            >
              <Sparkles size={16} color="var(--neo-primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neo-primary)' }}>
                Intelligent Adaptive Learning Engine
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                letterSpacing: '-0.03em',
              }}
            >
              Master Engineering with{' '}
              <span style={{ color: 'var(--neo-primary)' }}>Personalized</span> Precision.
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--neo-text-secondary)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '540px',
              }}
            >
              An educational ecosystem tailored to your goals. Progress through interactive curriculums, test your skills with server-graded assessments, and receive customized course recommendations powered by rule-based intelligence.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/courses">
                <NeoButton variant="primary" size="lg" icon={<BookOpen size={18} />}>
                  Explore Courses
                </NeoButton>
              </Link>
              <Link to="/register">
                <NeoButton variant="neutral" size="lg" icon={<ArrowRight size={18} />}>
                  Start Free Trial
                </NeoButton>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2.5rem',
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(163, 177, 198, 0.3)',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--neo-text)' }}>
                  100%
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--neo-text-muted)', fontWeight: 500 }}>
                  Active Server Persistence
                </span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--neo-secondary)' }}>
                  Java 21
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--neo-text-muted)', fontWeight: 500 }}>
                  High-Throughput Backend
                </span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--neo-primary)' }}>
                  AI-Powered
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--neo-text-muted)', fontWeight: 500 }}>
                  Adaptive Rationale
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div>
            <NeoCard
              style={{
                position: 'relative',
                padding: '2rem',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(145deg, #EBF0F5, #E5E9EE)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#EF4444',
                    }}
                  />
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#F59E0B',
                    }}
                  />
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                    }}
                  />
                </div>
                <span className="badge badge-primary">Adaptive Preview</span>
              </div>

              {/* Sample Interactive Course Snapshot */}
              <div
                style={{
                  backgroundColor: 'var(--neo-surface)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--neo-inset)',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  border: '1px solid rgba(163, 177, 198, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <BrainCircuit size={24} color="var(--neo-primary)" />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>Recommendation Engine</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--neo-text-muted)' }}>
                      Personalized Match Score: 95%
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--neo-text-secondary)', lineHeight: 1.5 }}>
                  "Recommended because you selected Java as an interest and recently completed a programming fundamentals course."
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--neo-surface)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--neo-raised-sm)',
                    padding: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--neo-text-muted)' }}>Quiz Pass Rate</span>
                  <h4 style={{ fontSize: '1.25rem', margin: '0.25rem 0 0 0', color: 'var(--neo-success)' }}>
                    87.4%
                  </h4>
                </div>
                <div
                  style={{
                    backgroundColor: 'var(--neo-surface)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--neo-raised-sm)',
                    padding: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--neo-text-muted)' }}>Weekly Streak</span>
                  <h4 style={{ fontSize: '1.25rem', margin: '0.25rem 0 0 0', color: 'var(--neo-primary)' }}>
                    🔥 5 Days
                  </h4>
                </div>
              </div>
            </NeoCard>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <span className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>
              Handcrafted Curriculums
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0 0 0' }}>
              Featured Learning Paths
            </h2>
          </div>
          <Link to="/courses">
            <NeoButton variant="neutral" size="sm" icon={<ArrowRight size={16} />}>
              View All Courses
            </NeoButton>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid-cols-3">
            <LoadingSkeleton height="360px" count={3} />
          </div>
        ) : featuredCourses.length > 0 ? (
          <div className="grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <NeoCard style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <p style={{ margin: 0 }}>Courses are currently being updated. Please check back shortly!</p>
          </NeoCard>
        )}
      </section>

      {/* Key Features Section */}
      <section style={{ backgroundColor: 'rgba(235, 240, 245, 0.5)', padding: '5rem 0', borderTop: '1px solid rgba(163, 177, 198, 0.25)', borderBottom: '1px solid rgba(163, 177, 198, 0.25)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
              Architected For Mastery
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0 1rem 0' }}>
              Why Engineers Choose EduPulse AI
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--neo-text-secondary)', margin: 0 }}>
              Say goodbye to superficial tutorials. Experience a platform built from the ground up to cultivate deep, lasting technical proficiency.
            </p>
          </div>

          <div className="grid-cols-3">
            <NeoCard style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--neo-surface)',
                  boxShadow: 'var(--neo-raised-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--neo-primary)',
                }}
              >
                <BrainCircuit size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Rule-Based Recommendations
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--neo-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Our backend algorithm maps your learning interests, quiz results, and course completion history to recommend relevant next steps with transparent reasoning.
              </p>
            </NeoCard>

            <NeoCard style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--neo-surface)',
                  boxShadow: 'var(--neo-raised-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--neo-secondary)',
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Server-Scored Assessments
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--neo-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Answer keys are never exposed in browser payloads. The backend evaluates submissions transactionally, enforcing rigorous mastery validation.
              </p>
            </NeoCard>

            <NeoCard style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--neo-surface)',
                  boxShadow: 'var(--neo-raised-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--neo-accent-coral)',
                }}
              >
                <Zap size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                AI Learning Assistant
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--neo-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Stuck on a tricky concept? Use our integrated AI Tutor for code breakdowns, interactive self-test questions, and tailored engineering roadmaps.
              </p>
            </NeoCard>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-secondary" style={{ marginBottom: '0.75rem' }}>
            The Learning Journey
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0 1rem 0' }}>
            How EduPulse AI Works
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--neo-text-secondary)', margin: 0 }}>
            Four simple steps from enrollment to complete technical competency.
          </p>
        </div>

        <div className="grid-cols-4">
          {[
            { step: '01', title: 'Set Interests', desc: 'Select your preferred engineering stacks like Java, Spring, React, or Cloud Architecture.' },
            { step: '02', title: 'Learn Lessons', desc: 'Dive into interactive text content, architectural code snippets, and curated video walkthroughs.' },
            { step: '03', title: 'Verify Mastery', desc: 'Pass module quizzes designed to test genuine problem-solving under strict server validation.' },
            { step: '04', title: 'Adapt & Excel', desc: 'Unlock personalized next-tier courses tailored to your performance profile.' },
          ].map((item, idx) => (
            <NeoCard key={idx} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--neo-primary)', opacity: 0.8 }}>
                {item.step}
              </span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{item.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--neo-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </NeoCard>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container" style={{ marginBottom: '2rem' }}>
        <NeoCard
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, #EBF0F5, #E2E8F0)',
            border: '1px solid rgba(255, 255, 255, 0.75)',
            boxShadow: 'var(--neo-raised-hover)',
          }}
        >
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Accelerate Your Career?
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--neo-text-secondary)',
              maxWidth: '520px',
              margin: '0 auto 2rem auto',
            }}
          >
            Join students mastering modern software development with persistent progress tracking and adaptive recommendations.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/register">
              <NeoButton variant="primary" size="lg">
                Create Free Account
              </NeoButton>
            </Link>
            <Link to="/courses">
              <NeoButton variant="neutral" size="lg">
                Browse Catalog
              </NeoButton>
            </Link>
          </div>
        </NeoCard>
      </section>
    </div>
  );
};
