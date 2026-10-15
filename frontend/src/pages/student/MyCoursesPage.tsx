import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, PlayCircle, Clock } from 'lucide-react';
import { Enrollment } from '../../types';
import { progressService } from '../../services/progressService';
import { getApiErrorMessage } from '../../services/apiClient';
import { PageHeader } from '../../components/common/PageHeader';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoProgress } from '../../components/common/NeoProgress';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';

export const MyCoursesPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await progressService.getMyEnrollments();
      setEnrollments(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const filteredEnrollments = enrollments.filter((e) => {
    if (filter === 'in_progress') return !e.completed;
    if (filter === 'completed') return e.completed;
    return true;
  });

  if (isLoading) {
    return (
      <div className="container">
        <LoadingSkeleton height="60px" count={1} />
        <div className="grid-cols-3" style={{ marginTop: '2rem' }}>
          <LoadingSkeleton height="280px" count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <ErrorState message={error} onRetry={fetchEnrollments} />
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title="My Enrolled Courses"
        subtitle={`Managing ${enrollments.length} active learning path enrollments`}
        action={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <NeoButton
              variant={filter === 'all' ? 'primary' : 'neutral'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({enrollments.length})
            </NeoButton>
            <NeoButton
              variant={filter === 'in_progress' ? 'primary' : 'neutral'}
              size="sm"
              onClick={() => setFilter('in_progress')}
            >
              In Progress ({enrollments.filter((e) => !e.completed).length})
            </NeoButton>
            <NeoButton
              variant={filter === 'completed' ? 'primary' : 'neutral'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed ({enrollments.filter((e) => e.completed).length})
            </NeoButton>
          </div>
        }
      />

      {filteredEnrollments.length > 0 ? (
        <div className="grid-cols-3">
          {filteredEnrollments.map((item) => (
            <NeoCard
              key={item.id}
              hoverable
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">{item.category}</span>
                  {item.completed ? (
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={12} /> Finished
                    </span>
                  ) : (
                    <span className="badge badge-secondary">{item.difficultyLevel}</span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0', lineHeight: 1.35 }}>
                  {item.courseTitle}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--neo-text-secondary)', margin: '0 0 1rem 0' }}>
                  Enrolled on {new Date(item.enrolledAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <NeoProgress
                    value={item.progressPercentage}
                    color={item.completed ? 'success' : 'primary'}
                    label={`${item.completedLessons} of ${item.totalLessons} lessons`}
                  />
                </div>

                <Link to={`/courses/${item.courseId}`} style={{ display: 'block' }}>
                  <NeoButton
                    variant={item.completed ? 'neutral' : 'primary'}
                    size="md"
                    style={{ width: '100%' }}
                    icon={<PlayCircle size={18} />}
                  >
                    {item.completed ? 'Review Curriculum' : 'Continue Learning'}
                  </NeoButton>
                </Link>
              </div>
            </NeoCard>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No courses in this filter"
          description={
            filter === 'completed'
              ? 'You have not finished any courses yet. Complete all lessons and quizzes to earn completion status!'
              : 'You do not have any courses matching this filter.'
          }
          icon={<BookOpen size={36} />}
          actionText="Browse Courses"
          onAction={() => (window.location.href = '/courses')}
        />
      )}
    </div>
  );
};
