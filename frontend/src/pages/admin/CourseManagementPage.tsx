import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { Course, PagedResponse } from '../../types';
import { adminService } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/apiClient';
import { PageHeader } from '../../components/common/PageHeader';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoInput } from '../../components/common/NeoInput';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';

export const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCourses = async (page = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const data: PagedResponse<Course> = await adminService.getAdminCourses({
        search: search.trim() || undefined,
        page,
        size: 10,
      });
      setCourses(data.content);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(0);
  }, []);

  const handleTogglePublish = async (courseId: number) => {
    try {
      const updated = await adminService.togglePublish(courseId);
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, published: updated.published } : c))
      );
    } catch (err: unknown) {
      alert(getApiErrorMessage(err));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminService.deleteCourse(deleteTarget.id);
      setDeleteTarget(null);
      await fetchCourses(currentPage);
    } catch (err: unknown) {
      alert(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <PageHeader
        title="Course Management"
        subtitle="Create, edit, publish, or remove courses and configure learning curriculums."
        action={
          <Link to="/admin/courses/new">
            <NeoButton variant="primary" size="md" icon={<Plus size={18} />}>
              Create Course
            </NeoButton>
          </Link>
        }
      />

      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchCourses(0);
        }}
        style={{ display: 'flex', gap: '0.75rem', maxWidth: '500px' }}
      >
        <NeoInput
          placeholder="Filter courses by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={18} />}
        />
        <NeoButton type="submit" variant="neutral" size="md">
          Filter
        </NeoButton>
      </form>

      {/* Courses Table / Cards */}
      {isLoading ? (
        <LoadingSkeleton height="70px" count={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchCourses(currentPage)} />
      ) : courses.length > 0 ? (
        <NeoCard style={{ padding: '0', overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(163, 177, 198, 0.3)', backgroundColor: 'rgba(235, 240, 245, 0.6)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--neo-text-muted)' }}>COURSE TITLE</th>
                <th style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--neo-text-muted)' }}>CATEGORY</th>
                <th style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--neo-text-muted)' }}>DIFFICULTY</th>
                <th style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--neo-text-muted)' }}>STATUS</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--neo-text-muted)', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} style={{ borderBottom: '1px solid rgba(163, 177, 198, 0.2)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--neo-text)' }}>{course.title}</div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--neo-text-muted)' }}>{course.lessonsCount} lessons</span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{course.category}</td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{course.difficultyLevel}</td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(course.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                      title="Click to toggle status"
                    >
                      <span className={`badge ${course.published ? 'badge-success' : 'badge-warning'}`}>
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                    </button>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <Link to={`/admin/courses/${course.id}/lessons`}>
                        <NeoButton variant="neutral" size="sm" title="Manage Lessons" style={{ padding: '0.4rem 0.65rem' }}>
                          <BookOpen size={15} />
                        </NeoButton>
                      </Link>
                      <Link to={`/admin/courses/${course.id}/quiz`}>
                        <NeoButton variant="neutral" size="sm" title="Manage Quiz" style={{ padding: '0.4rem 0.65rem' }}>
                          <HelpCircle size={15} />
                        </NeoButton>
                      </Link>
                      <Link to={`/admin/courses/edit/${course.id}`}>
                        <NeoButton variant="neutral" size="sm" title="Edit Course Details" style={{ padding: '0.4rem 0.65rem' }}>
                          <Edit size={15} />
                        </NeoButton>
                      </Link>
                      <NeoButton
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteTarget(course)}
                        title="Delete Course"
                        style={{ padding: '0.4rem 0.65rem' }}
                      >
                        <Trash2 size={15} />
                      </NeoButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </NeoCard>
      ) : (
        <NeoCard style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No courses found. Click "Create Course" above to add your first curriculum!</p>
        </NeoCard>
      )}

      {/* Confirmation Dialog for Course Deletion */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Course?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All associated lessons, progress records, and quizzes will be permanently deleted.`}
        isDestructive
        isLoading={isDeleting}
        confirmText="Yes, Delete Course"
      />
    </div>
  );
};
