import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';
import { CourseDetail } from '../types';
import { courseService } from '../services/courseService';
import { progressService } from '../services/progressService';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/apiClient';
import { NeoCard } from '../components/common/NeoCard';
import { NeoButton } from '../components/common/NeoButton';
import { NeoProgress } from '../components/common/NeoProgress';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';

export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);

  const fetchDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseService.getCourseDetails(courseId);
      setCourse(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchDetails();
    }
  }, [courseId]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsEnrolling(true);
    setError(null);
    try {
      await progressService.enrollInCourse(courseId);
      setEnrollSuccessMessage('Successfully enrolled! Welcome to the course.');
      await fetchDetails();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <LoadingSkeleton height="300px" count={1} />
        <div style={{ marginTop: '2rem' }}>
          <LoadingSkeleton height="200px" count={2} />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container">
        <ErrorState message={error || 'Course not found'} onRetry={fetchDetails} />
      </div>
    );
  }

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Banner / Header Card */}
      <NeoCard
        style={{
          padding: '2.5rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, #EBF0F5, #E5E9EE)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">{course.category}</span>
              <span className="badge badge-secondary">{course.difficultyLevel}</span>
              {course.completed && <span className="badge badge-success">Completed</span>}
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>
              {course.title}
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--neo-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {course.shortDescription}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                fontSize: '0.9rem',
                color: 'var(--neo-text-muted)',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                Instructor:{' '}
                <strong style={{ color: 'var(--neo-text)' }}>
                  {course.instructorName || 'Lead Portal Instructor'}
                </strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={16} />
                <span>{course.estimatedDuration || '6 Hours'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={16} />
                <span>{course.lessons.length} Lessons</span>
              </div>
            </div>

            {/* Enrollment Status & Action Button */}
            {course.enrolled ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '380px' }}>
                <NeoProgress value={course.progressPercentage} label="Your Progress" color="secondary" />
                {course.lessons.length > 0 && (
                  <Link to={`/lessons/${course.lessons[0].id}`}>
                    <NeoButton variant="secondary" size="lg" icon={<PlayCircle size={18} />}>
                      {course.progressPercentage > 0 ? 'Resume Course' : 'Start First Lesson'}
                    </NeoButton>
                  </Link>
                )}
              </div>
            ) : (
              <NeoButton
                variant="primary"
                size="lg"
                onClick={handleEnroll}
                isLoading={isEnrolling}
                icon={<ArrowRight size={18} />}
              >
                Enroll in Course Free
              </NeoButton>
            )}

            {enrollSuccessMessage && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: 'var(--neo-success)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                {enrollSuccessMessage}
              </div>
            )}
          </div>

          {/* Thumbnail preview */}
          <div>
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--neo-raised)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                height: '260px',
              }}
            >
              <img
                src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60'}
                alt={course.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </NeoCard>

      {/* Main Grid: Description & Syllabus */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Left Column: Full Course Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <NeoCard>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>
              About This Course
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--neo-text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {course.fullDescription || course.shortDescription}
            </p>
          </NeoCard>

          {/* Quiz Assessment Overview Box */}
          {course.quizId && (
            <NeoCard
              style={{
                border: '1px solid rgba(91, 103, 241, 0.3)',
                background: 'linear-gradient(135deg, #EBF0F5, #E7ECF3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Award size={24} color="var(--neo-primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                  Course Final Assessment
                </h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--neo-text-secondary)', marginBottom: '1.25rem' }}>
                Test your mastery upon finishing the curriculum. Passing score required: 70%.
              </p>
              {course.enrolled ? (
                <Link to={`/quizzes/${course.quizId}`}>
                  <NeoButton variant="primary" size="md" icon={<HelpCircle size={16} />}>
                    Take Assessment Quiz
                  </NeoButton>
                </Link>
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--neo-text-muted)' }}>
                  Enroll in this course to unlock the final certification quiz.
                </span>
              )}
            </NeoCard>
          )}
        </div>

        {/* Right Column: Syllabus Lessons Outline */}
        <div>
          <NeoCard>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Curriculum Lessons ({course.lessons.length})
            </h3>

            {course.lessons.length === 0 ? (
              <p style={{ fontSize: '0.9rem', color: 'var(--neo-text-muted)' }}>
                Lessons are currently being prepared for this curriculum.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.9rem 1.1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--neo-surface)',
                      boxShadow: 'var(--neo-raised-sm)',
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: 'var(--neo-text-muted)',
                          width: '24px',
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
                          {lesson.title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--neo-text-muted)' }}>
                          {lesson.estimatedDuration || '20 Mins'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {course.enrolled ? (
                        lesson.completed ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--neo-success)', fontSize: '0.85rem', fontWeight: 600 }}>
                            <CheckCircle2 size={18} />
                            <span>Done</span>
                          </div>
                        ) : (
                          <Link to={`/lessons/${lesson.id}`}>
                            <NeoButton variant="neutral" size="sm" icon={<PlayCircle size={14} />}>
                              Learn
                            </NeoButton>
                          </Link>
                        )
                      ) : (
                        <Lock size={16} color="var(--neo-text-muted)" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </NeoCard>
        </div>
      </div>
    </div>
  );
};
