import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, RefreshCw, BookOpen, ArrowRight, BrainCircuit } from 'lucide-react';
import { Recommendation } from '../../types';
import { recommendationService } from '../../services/recommendationService';
import { getApiErrorMessage } from '../../services/apiClient';
import { PageHeader } from '../../components/common/PageHeader';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';

export const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const data = await recommendationService.getRecommendations();
      setRecommendations(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <PageHeader
        title="AI Personalized Recommendations"
        subtitle="Adaptive learning paths derived from your declared interests, completed courses, and quiz assessments."
        action={
          <NeoButton
            variant="neutral"
            size="sm"
            onClick={() => fetchRecommendations(true)}
            isLoading={isRefreshing}
            icon={<RefreshCw size={16} />}
          >
            Refresh Suggestions
          </NeoButton>
        }
      />

      {isLoading ? (
        <div className="grid-cols-2">
          <LoadingSkeleton height="240px" count={4} />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchRecommendations()} />
      ) : recommendations.length > 0 ? (
        <div className="grid-cols-2">
          {recommendations.map((rec) => (
            <NeoCard
              key={rec.courseId}
              hoverable
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.75rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="badge badge-primary">{rec.category}</span>
                    <span className="badge badge-secondary">{rec.difficultyLevel}</span>
                  </div>
                  <span
                    className="badge badge-success"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <BrainCircuit size={14} />
                    {rec.score}% Match
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem 0', lineHeight: 1.35 }}>
                  {rec.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--neo-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {rec.shortDescription}
                </p>

                {/* Adaptive Rationale Box */}
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(91, 103, 241, 0.08)',
                    borderLeft: '4px solid var(--neo-primary)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--neo-primary)', display: 'block', marginBottom: '0.25rem' }}>
                    Engine Rationale
                  </span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--neo-text)', lineHeight: 1.5 }}>
                    "{rec.explanation}"
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(163, 177, 198, 0.25)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--neo-text-muted)' }}>
                  Duration: {rec.estimatedDuration || '4 Hours'}
                </span>
                <Link to={`/courses/${rec.courseId}`}>
                  <NeoButton variant="primary" size="sm" icon={<ArrowRight size={14} />}>
                    View Curriculum
                  </NeoButton>
                </Link>
              </div>
            </NeoCard>
          ))}
        </div>
      ) : (
        <EmptyState
          title="All Caught Up!"
          description="You are currently enrolled in all available published courses or haven't established your learning interests yet. Update your interests in your profile to discover new paths."
          icon={<Sparkles size={36} color="var(--neo-primary)" />}
          actionText="Edit Profile Interests"
          onAction={() => (window.location.href = '/profile')}
        />
      )}
    </div>
  );
};
