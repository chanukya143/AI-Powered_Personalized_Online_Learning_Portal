import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, PlusCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { courseService } from '../../services/courseService';
import { getApiErrorMessage } from '../../services/apiClient';
import { PageHeader } from '../../components/common/PageHeader';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoInput } from '../../components/common/NeoInput';
import { NeoSelect } from '../../components/common/NeoSelect';
import { NeoButton } from '../../components/common/NeoButton';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const CourseEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const courseId = Number(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [category, setCategory] = useState('Backend Development');
  const [difficultyLevel, setDifficultyLevel] = useState('Beginner');
  const [instructorName, setInstructorName] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('6 Hours');
  const [published, setPublished] = useState(false);

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && courseId) {
      setIsLoading(true);
      courseService
        .getCourseDetails(courseId)
        .then((data) => {
          setTitle(data.title);
          setShortDescription(data.shortDescription || '');
          setFullDescription(data.fullDescription || '');
          setCategory(data.category);
          setDifficultyLevel(data.difficultyLevel);
          setInstructorName(data.instructorName || '');
          setThumbnailUrl(data.thumbnailUrl || '');
          setEstimatedDuration(data.estimatedDuration || '');
          setPublished(data.published);
        })
        .catch((err) => setError(getApiErrorMessage(err)))
        .finally(() => setIsLoading(false));
    }
  }, [isEditing, courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category.trim()) return;

    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        category: category.trim(),
        difficultyLevel,
        instructorName: instructorName.trim() || 'Portal Instructor',
        thumbnailUrl: thumbnailUrl.trim(),
        estimatedDuration: estimatedDuration.trim() || '4 Hours',
        published,
      };

      if (isEditing) {
        await adminService.updateCourse(courseId, payload);
      } else {
        await adminService.createCourse(payload);
      }

      navigate('/admin/courses');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <LoadingSkeleton height="400px" count={1} />
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '850px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <Link
          to="/admin/courses"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Back to Courses List
        </Link>
        <PageHeader
          title={isEditing ? 'Edit Course Curriculum' : 'Create New Course'}
          subtitle="Configure metadata, curriculum objectives, and publication status."
        />
      </div>

      <NeoCard style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
        {error && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--neo-danger)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <NeoInput
            label="Course Title"
            placeholder="e.g. Distributed Systems with Java 21 & Kafka"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <NeoInput
            label="Short Description (Card Summary)"
            placeholder="A punchy 1-2 sentence overview for course cards"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--neo-text)' }}>
              Full Course Description & Syllabus Overview
            </label>
            <textarea
              rows={6}
              placeholder="Detailed syllabus, prerequisites, and learning objectives..."
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
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
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <NeoInput
              label="Category"
              placeholder="e.g. Backend Development"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <NeoSelect
              label="Difficulty Level"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' },
              ]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <NeoInput
              label="Lead Instructor Name"
              placeholder="e.g. Dr. Sarah Jenkins"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
            />

            <NeoInput
              label="Estimated Duration"
              placeholder="e.g. 10 Hours"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
            />
          </div>

          <NeoInput
            label="Thumbnail Image URL"
            placeholder="https://images.unsplash.com/photo-..."
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
          />

          {/* Published Toggle Checkbox */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(235, 240, 245, 0.7)',
              border: '1px solid rgba(163, 177, 198, 0.3)',
            }}
          >
            <input
              type="checkbox"
              id="publishCheckbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="publishCheckbox" style={{ fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>
              Publish this course immediately (Visible in student public catalog)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Link to="/admin/courses">
              <NeoButton type="button" variant="neutral" size="md">
                Cancel
              </NeoButton>
            </Link>
            <NeoButton
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              icon={isEditing ? <Save size={18} /> : <PlusCircle size={18} />}
            >
              {isEditing ? 'Save Changes' : 'Create Course'}
            </NeoButton>
          </div>
        </form>
      </NeoCard>
    </div>
  );
};
