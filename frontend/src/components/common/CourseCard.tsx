import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Course } from '../../types';
import { NeoCard } from './NeoCard';
import { NeoButton } from './NeoButton';
import { NeoProgress } from './NeoProgress';

interface CourseCardProps {
  course: Course;
  progressPercentage?: number;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progressPercentage,
  isEnrolled = false,
}) => {
  const defaultThumbnail =
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60';

  return (
    <NeoCard
      hoverable
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: '1.25rem',
      }}
    >
      <div>
        {/* Thumbnail Frame */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '160px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: '1rem',
            boxShadow: 'var(--neo-inset-sm)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
          }}
        >
          <img
            src={course.thumbnailUrl || defaultThumbnail}
            alt={course.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = defaultThumbnail;
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <span className="badge badge-primary" style={{ backgroundColor: 'rgba(233, 237, 242, 0.9)' }}>
              {course.category}
            </span>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              right: '0.75rem',
            }}
          >
            <span className="badge badge-secondary" style={{ backgroundColor: 'rgba(233, 237, 242, 0.9)' }}>
              {course.difficultyLevel}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            lineHeight: 1.35,
          }}
        >
          {course.title}
        </h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--neo-text-secondary)',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.shortDescription || 'Master essential modern software development concepts and best practices.'}
        </p>
      </div>

      <div>
        {/* Progress Bar (if enrolled) */}
        {isEnrolled && progressPercentage !== undefined && (
          <div style={{ marginBottom: '1rem' }}>
            <NeoProgress value={progressPercentage} size="sm" label="Course Progress" />
          </div>
        )}

        {/* Metadata row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--neo-text-muted)',
            marginBottom: '1.25rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(163, 177, 198, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <BookOpen size={15} />
            <span>{course.lessonsCount} lessons</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={15} />
            <span>{course.estimatedDuration || '4 Hours'}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link to={`/courses/${course.id}`} style={{ width: '100%', display: 'block' }}>
          <NeoButton
            variant={isEnrolled ? 'secondary' : 'primary'}
            size="md"
            style={{ width: '100%' }}
          >
            {isEnrolled ? 'Continue Learning' : 'View Course'}
            <ArrowRight size={16} />
          </NeoButton>
        </Link>
      </div>
    </NeoCard>
  );
};
