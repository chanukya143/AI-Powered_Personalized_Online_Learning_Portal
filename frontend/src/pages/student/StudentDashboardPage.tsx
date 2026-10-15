import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  Award,
  PlayCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { StudentDashboard } from '../../types';
import { progressService } from '../../services/progressService';
import { getApiErrorMessage } from '../../services/apiClient';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoProgress } from '../../components/common/NeoProgress';
import { CourseCard } from '../../components/common/CourseCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';

export const StudentDashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await progressService.getDashboard();
      setDashboard(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="container">
        <LoadingSkeleton height="120px" count={1} />
        <div className="grid-cols-4" style={{ margin: '2rem 0' }}>
          <LoadingSkeleton height="140px" count={4} />
        </div>
        <LoadingSkeleton height="260px" count={2} />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="container">
        <ErrorState message={error || 'Failed to load dashboard'} onRetry={fetchDashboard} />
      </div>
    );
  }

  const {
    welcomeMessage,
    totalEnrolledCourses,
    inProgressCourses,
    completedCourses,
    averageQuizScore,
    learningStreakDays,
    continueLearningCourse,
    enrolledCourses,
    recentQuizAttempts,
    recommendations,
  } = dashboard;

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <PageHeader
        title={welcomeMessage || 'Student Learning Dashboard'}
        subtitle="Track your enrolled courses, assessment performance, and adaptive learning recommendations."
      />

      {/* Quick Metrics Grid */}
      <div className="grid-cols-4">
        <StatCard
          title="Enrolled Courses"
          value={totalEnrolledCourses}
          subtitle={`${inProgressCourses} in progress`}
          icon={<BookOpen size={22} />}
          iconColor="var(--neo-primary)"
        />
        <StatCard
          title="Completed"
          value={completedCourses}
          subtitle="Finished curriculums"
          icon={<CheckCircle2 size={22} />}
          iconColor="var(--neo-success)"
        />
        <StatCard
          title="Average Quiz Score"
          value={`${averageQuizScore}%`}
          subtitle="Mastery average"
          icon={<Award size={22} />}
          iconColor="var(--neo-secondary)"
        />
        <StatCard
          title="Learning Streak"
          value={`${learningStreakDays} Days`}
          subtitle="Consistent activity"
          icon={<Flame size={22} />}
          iconColor="var(--neo-accent-coral)"
        />
      </div>

      {/* Continue Learning Callout (if active course exists) */}
      {continueLearningCourse ? (
        <NeoCard
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, #EBF0F5, #E5E9EE)',
            border: '1px solid rgba(255, 255, 255, 0.75)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div style={{ flex: 1, minWidth: '280px' }}>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                Continue Learning
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.35rem 0' }}>
                {continueLearningCourse.courseTitle}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--neo-text-secondary)', margin: '0 0 1rem 0' }}>
                {continueLearningCourse.completedLessons} of {continueLearningCourse.totalLessons} lessons completed
              </p>
              <div style={{ maxWidth: '420px' }}>
                <NeoProgress
                  value={continueLearningCourse.progressPercentage}
                  color="secondary"
                  size="md"
                />
              </div>
            </div>

            <Link to={`/courses/${continueLearningCourse.courseId}`}>
              <NeoButton variant="primary" size="lg" icon={<PlayCircle size={20} />}>
                Resume Lesson
              </NeoButton>
            </Link>
          </div>
        </NeoCard>
      ) : null}

      {/* Enrolled Courses Section */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>My Enrolled Courses</h2>
          <Link to="/courses">
            <NeoButton variant="neutral" size="sm" icon={<BookOpen size={16} />}>
              Find More Courses
            </NeoButton>
          </Link>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid-cols-3">
            {enrolledCourses.map((enrollment) => (
              <NeoCard key={enrollment.id} hoverable style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-primary">{enrollment.category}</span>
                    <span className="badge badge-secondary">{enrollment.difficultyLevel}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem 0', lineHeight: 1.35 }}>
                    {enrollment.courseTitle}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--neo-text-secondary)', margin: '0 0 1rem 0' }}>
                    {enrollment.completedLessons} of {enrollment.totalLessons} lessons completed
                  </p>
                </div>

                <div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <NeoProgress
                      value={enrollment.progressPercentage}
                      color={enrollment.completed ? 'success' : 'primary'}
                      size="sm"
                    />
                  </div>
                  <Link to={`/courses/${enrollment.courseId}`} style={{ display: 'block' }}>
                    <NeoButton
                      variant={enrollment.completed ? 'neutral' : 'secondary'}
                      size="sm"
                      style={{ width: '100%' }}
                    >
                      {enrollment.completed ? 'Review Curriculum' : 'Go to Course'}
                    </NeoButton>
                  </Link>
                </div>
              </NeoCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No enrollments yet"
            description="You haven't enrolled in any courses yet. Explore our course catalog to kickstart your customized learning path."
            icon={<BookOpen size={36} />}
            actionText="Browse Courses"
            onAction={() => (window.location.href = '/courses')}
          />
        )}
      </div>

      {/* Recommendations & Recent Quiz Performance Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Adaptive Recommendations */}
        <NeoCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Sparkles size={20} color="var(--neo-primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              AI Personalized Recommendations
            </h3>
          </div>

          {recommendations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recommendations.map((rec) => (
                <div
                  key={rec.courseId}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--neo-surface)',
                    boxShadow: 'var(--neo-raised-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{rec.title}</h4>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      {rec.score}% Match
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--neo-text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.45 }}>
                    {rec.explanation}
                  </p>
                  <Link to={`/courses/${rec.courseId}`}>
                    <NeoButton variant="neutral" size="sm" icon={<ArrowRight size={14} />}>
                      Inspect Course
                    </NeoButton>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.875rem', color: 'var(--neo-text-muted)', margin: 0 }}>
              Complete lessons and add learning interests in your profile to trigger personalized AI recommendations.
            </p>
          )}
        </NeoCard>

        {/* Assessment Quiz Performance Logs */}
        <NeoCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Award size={20} color="var(--neo-secondary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Recent Assessment Activity
            </h3>
          </div>

          {recentQuizAttempts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentQuizAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--neo-surface)',
                    boxShadow: 'var(--neo-raised-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{attempt.quizTitle}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--neo-text-muted)' }}>
                      Attempted {new Date(attempt.attemptedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: attempt.passed ? 'var(--neo-success)' : 'var(--neo-danger)',
                      }}
                    >
                      {attempt.score}%
                    </span>
                    <br />
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: attempt.passed ? 'var(--neo-success)' : 'var(--neo-danger)',
                      }}
                    >
                      {attempt.passed ? 'Passed' : 'Try Again'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.875rem', color: 'var(--neo-text-muted)', margin: 0 }}>
              You have not attempted any course quizzes yet. Pass module quizzes to test your mastery and earn completion certificates.
            </p>
          )}
        </NeoCard>
      </div>
    </div>
  );
};
