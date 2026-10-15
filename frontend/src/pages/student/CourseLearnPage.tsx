import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  Video,
} from 'lucide-react';
import { Lesson, LessonSummary } from '../../types';
import { lessonService } from '../../services/lessonService';
import { courseService } from '../../services/courseService';
import { progressService } from '../../services/progressService';
import { getApiErrorMessage } from '../../services/apiClient';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoProgress } from '../../components/common/NeoProgress';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';

export const CourseLearnPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const id = Number(lessonId);
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseLessons, setCourseLessons] = useState<LessonSummary[]>([]);
  const [quizId, setQuizId] = useState<number | null>(null);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessonData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentLesson = await lessonService.getLesson(id);
      setLesson(currentLesson);

      // Fetch course details to get full syllabus outline and quizId
      const courseDetails = await courseService.getCourseDetails(currentLesson.courseId);
      setCourseLessons(courseDetails.lessons);
      setQuizId(courseDetails.quizId || null);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLessonData();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleToggleComplete = async () => {
    if (!lesson) return;
    setIsUpdatingProgress(true);
    try {
      const newStatus = !lesson.completed;
      await progressService.updateLessonProgress(lesson.id, newStatus);
      setLesson({ ...lesson, completed: newStatus });

      // Update sidebar curriculum checkmark
      setCourseLessons((prev) =>
        prev.map((l) => (l.id === lesson.id ? { ...l, completed: newStatus } : l))
      );
    } catch (err: unknown) {
      alert(getApiErrorMessage(err));
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <LoadingSkeleton height="40px" width="300px" />
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', marginTop: '2rem' }}>
          <LoadingSkeleton height="500px" count={1} />
          <LoadingSkeleton height="500px" count={1} />
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="container">
        <ErrorState message={error || 'Lesson not found'} onRetry={fetchLessonData} />
      </div>
    );
  }

  const completedCount = courseLessons.filter((l) => l.completed).length;
  const progressPct = courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <Link
          to={`/courses/${lesson.courseId}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Back to Course Overview
        </Link>
        <span style={{ fontSize: '0.85rem', color: 'var(--neo-text-muted)' }}>
          Course: <strong>{lesson.courseTitle}</strong>
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Left / Drawer: Curriculum Syllabus Sidebar */}
        <NeoCard style={{ padding: '1.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              Course Syllabus
            </h3>
            <NeoProgress value={progressPct} label={`${completedCount}/${courseLessons.length} Completed`} size="sm" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {courseLessons.map((item, idx) => {
              const isCurrent = item.id === lesson.id;
              return (
                <Link
                  key={item.id}
                  to={`/lessons/${item.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isCurrent ? 'var(--neo-primary)' : 'var(--neo-surface)',
                    color: isCurrent ? '#FFFFFF' : 'var(--neo-text)',
                    boxShadow: isCurrent ? '0 4px 10px rgba(91, 103, 241, 0.35)' : 'var(--neo-raised-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '0.8rem', opacity: isCurrent ? 0.9 : 0.6, fontWeight: 700 }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.title}</span>
                  </div>
                  {item.completed && (
                    <CheckCircle2 size={16} color={isCurrent ? '#FFFFFF' : 'var(--neo-success)'} />
                  )}
                </Link>
              );
            })}

            {/* Course Quiz Link in Sidebar */}
            {quizId && (
              <Link
                to={`/quizzes/${quizId}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--neo-surface)',
                  boxShadow: 'var(--neo-raised-sm)',
                  border: '1px solid rgba(91, 103, 241, 0.4)',
                  color: 'var(--neo-primary)',
                  fontWeight: 700,
                  marginTop: '0.75rem',
                  textDecoration: 'none',
                }}
              >
                <HelpCircle size={18} />
                <span>Take Final Quiz Assessment</span>
              </Link>
            )}
          </div>
        </NeoCard>

        {/* Right / Main: Lesson Content Reader & Video */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 2 }}>
          <NeoCard style={{ padding: '2rem 2.5rem', borderRadius: 'var(--radius-xl)' }}>
            {/* Header info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                borderBottom: '1px solid rgba(163, 177, 198, 0.3)',
                paddingBottom: '1.25rem',
                marginBottom: '1.75rem',
              }}
            >
              <div>
                <span className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>
                  Lesson {lesson.lessonOrder}
                </span>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.35rem 0' }}>
                  {lesson.title}
                </h1>
                <span style={{ fontSize: '0.85rem', color: 'var(--neo-text-muted)' }}>
                  Estimated reading time: {lesson.estimatedDuration || '20 Mins'}
                </span>
              </div>

              {/* Mark as Completed Button */}
              <NeoButton
                variant={lesson.completed ? 'secondary' : 'neutral'}
                size="md"
                onClick={handleToggleComplete}
                isLoading={isUpdatingProgress}
                icon={<CheckCircle2 size={18} />}
              >
                {lesson.completed ? 'Completed' : 'Mark as Completed'}
              </NeoButton>
            </div>

            {/* Video Player (if videoUrl is present) */}
            {lesson.videoUrl && (
              <div
                style={{
                  marginBottom: '2rem',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--neo-raised)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  position: 'relative',
                  paddingTop: '56.25%', // 16:9 ratio
                }}
              >
                <iframe
                  src={
                    lesson.videoUrl.includes('watch?v=')
                      ? lesson.videoUrl.replace('watch?v=', 'embed/')
                      : lesson.videoUrl
                  }
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              </div>
            )}

            {/* Markdown Content Reader */}
            <div
              style={{
                fontSize: '1rem',
                color: 'var(--neo-text)',
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
              }}
            >
              {lesson.content}
            </div>

            {/* Bottom Lesson Navigation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(163, 177, 198, 0.3)',
                paddingTop: '1.75rem',
                marginTop: '2.5rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              {lesson.previousLessonId ? (
                <Link to={`/lessons/${lesson.previousLessonId}`}>
                  <NeoButton variant="neutral" size="md" icon={<ChevronLeft size={18} />}>
                    Previous Lesson
                  </NeoButton>
                </Link>
              ) : (
                <div />
              )}

              {lesson.nextLessonId ? (
                <Link to={`/lessons/${lesson.nextLessonId}`}>
                  <NeoButton variant="primary" size="md">
                    Next Lesson <ChevronRight size={18} />
                  </NeoButton>
                </Link>
              ) : quizId ? (
                <Link to={`/quizzes/${quizId}`}>
                  <NeoButton variant="primary" size="md" icon={<HelpCircle size={18} />}>
                    Finish & Take Quiz
                  </NeoButton>
                </Link>
              ) : (
                <Link to={`/courses/${lesson.courseId}`}>
                  <NeoButton variant="primary" size="md">
                    Finish Course
                  </NeoButton>
                </Link>
              )}
            </div>
          </NeoCard>
        </div>
      </div>
    </div>
  );
};
