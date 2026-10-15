import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Video,
  Clock,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { Lesson, CourseDetail } from '../../types';
import { courseService } from '../../services/courseService';
import { lessonService } from '../../services/lessonService';
import { adminService, LessonCreatePayload } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/apiClient';
import { PageHeader } from '../../components/common/PageHeader';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoInput } from '../../components/common/NeoInput';
import { NeoModal } from '../../components/common/NeoModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';

export const LessonManagementPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const id = Number(courseId);

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalOrder, setModalOrder] = useState<number>(1);
  const [modalContent, setModalContent] = useState('');
  const [modalVideoUrl, setModalVideoUrl] = useState('');
  const [modalDuration, setModalDuration] = useState('20 Mins');
  const [modalPublished, setModalPublished] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const courseData = await courseService.getCourseDetails(id);
      setCourse(courseData);
      const lessonsData = await lessonService.getLessonsByCourse(id);
      setLessons(lessonsData);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const openCreateModal = () => {
    setEditingLessonId(null);
    setModalTitle('');
    setModalDescription('');
    setModalOrder(lessons.length + 1);
    setModalContent('');
    setModalVideoUrl('');
    setModalDuration('20 Mins');
    setModalPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setModalTitle(lesson.title);
    setModalDescription(lesson.description || '');
    setModalOrder(lesson.lessonOrder);
    setModalContent(lesson.content);
    setModalVideoUrl(lesson.videoUrl || '');
    setModalDuration(lesson.estimatedDuration || '20 Mins');
    setModalPublished(lesson.published);
    setIsModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim() || !modalContent.trim()) return;

    setIsSaving(true);
    try {
      const payload: LessonCreatePayload = {
        title: modalTitle.trim(),
        description: modalDescription.trim(),
        lessonOrder: Number(modalOrder),
        content: modalContent.trim(),
        videoUrl: modalVideoUrl.trim(),
        estimatedDuration: modalDuration.trim(),
        published: modalPublished,
      };

      if (editingLessonId) {
        await adminService.updateLesson(editingLessonId, payload);
      } else {
        await adminService.createLesson(id, payload);
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminService.deleteLesson(deleteTarget.id);
      setDeleteTarget(null);
      await fetchData();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <LoadingSkeleton height="60px" count={1} />
        <div style={{ marginTop: '2rem' }}>
          <LoadingSkeleton height="80px" count={4} />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container">
        <ErrorState message={error || 'Course not found'} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <Link
          to="/admin/courses"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Back to Courses
        </Link>
        <PageHeader
          title={`Lessons: ${course.title}`}
          subtitle={`Organize curriculum chapters, content, and video links (${lessons.length} lessons)`}
          action={
            <NeoButton variant="primary" size="md" onClick={openCreateModal} icon={<Plus size={18} />}>
              Add Lesson
            </NeoButton>
          }
        />
      </div>

      {lessons.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {lessons.map((lesson) => (
            <NeoCard
              key={lesson.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: 'var(--neo-primary)',
                    width: '32px',
                  }}
                >
                  {String(lesson.lessonOrder).padStart(2, '0')}
                </span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                    {lesson.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--neo-text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} /> {lesson.estimatedDuration || '20 Mins'}
                    </span>
                    {lesson.videoUrl && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--neo-secondary)' }}>
                        <Video size={14} /> Video Attached
                      </span>
                    )}
                    <span className={`badge ${lesson.published ? 'badge-success' : 'badge-warning'}`}>
                      {lesson.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <NeoButton variant="neutral" size="sm" onClick={() => openEditModal(lesson)} icon={<Edit size={15} />}>
                  Edit
                </NeoButton>
                <NeoButton
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteTarget(lesson)}
                  icon={<Trash2 size={15} />}
                >
                  Delete
                </NeoButton>
              </div>
            </NeoCard>
          ))}
        </div>
      ) : (
        <NeoCard style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--neo-text-secondary)' }}>
            This course currently has no lessons. Click "Add Lesson" to build out the syllabus.
          </p>
          <NeoButton variant="primary" size="md" onClick={openCreateModal} icon={<Plus size={16} />}>
            Add First Lesson
          </NeoButton>
        </NeoCard>
      )}

      {/* Add / Edit Lesson Modal */}
      <NeoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}
        maxWidth="650px"
      >
        <form onSubmit={handleSaveLesson} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <NeoInput
            label="Lesson Title"
            placeholder="e.g. Concurrency with Java Virtual Threads"
            value={modalTitle}
            onChange={(e) => setModalTitle(e.target.value)}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <NeoInput
              label="Lesson Order"
              type="number"
              min="1"
              value={modalOrder}
              onChange={(e) => setModalOrder(Number(e.target.value))}
              required
            />
            <NeoInput
              label="Estimated Duration"
              placeholder="e.g. 25 Mins"
              value={modalDuration}
              onChange={(e) => setModalDuration(e.target.value)}
            />
          </div>

          <NeoInput
            label="External Video URL (Optional)"
            placeholder="https://www.youtube.com/watch?v=..."
            value={modalVideoUrl}
            onChange={(e) => setModalVideoUrl(e.target.value)}
          />

          <NeoInput
            label="Brief Summary"
            placeholder="Short intro to the chapter"
            value={modalDescription}
            onChange={(e) => setModalDescription(e.target.value)}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--neo-text)' }}>
              Lesson Content (Markdown & Code)
            </label>
            <textarea
              rows={8}
              placeholder="Write lesson text, code snippets, and explanations..."
              value={modalContent}
              onChange={(e) => setModalContent(e.target.value)}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="lessonPublished"
              checked={modalPublished}
              onChange={(e) => setModalPublished(e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            <label htmlFor="lessonPublished" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
              Publish lesson immediately
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <NeoButton type="button" variant="neutral" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </NeoButton>
            <NeoButton type="submit" variant="primary" size="sm" isLoading={isSaving}>
              {editingLessonId ? 'Update Lesson' : 'Create Lesson'}
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lesson?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
};
