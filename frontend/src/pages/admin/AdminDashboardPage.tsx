import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { AdminStats } from '../../types';
import { adminService } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/apiClient';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="container">
        <LoadingSkeleton height="80px" count={1} />
        <div className="grid-cols-4" style={{ margin: '2rem 0' }}>
          <LoadingSkeleton height="130px" count={4} />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container">
        <ErrorState message={error || 'Failed to load administration metrics'} onRetry={fetchStats} />
      </div>
    );
  }

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <PageHeader
        title="Admin Control Center"
        subtitle="Platform-wide telemetry, curriculum publication status, and student user accounts."
        action={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/courses/new">
              <NeoButton variant="primary" size="sm" icon={<PlusCircle size={16} />}>
                Create New Course
              </NeoButton>
            </Link>
            <Link to="/admin/courses">
              <NeoButton variant="neutral" size="sm" icon={<BookOpen size={16} />}>
                Manage Courses
              </NeoButton>
            </Link>
            <Link to="/admin/users">
              <NeoButton variant="neutral" size="sm" icon={<Users size={16} />}>
                Manage Users
              </NeoButton>
            </Link>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Registered learner accounts"
          icon={<Users size={22} />}
          iconColor="var(--neo-primary)"
        />
        <StatCard
          title="Published Courses"
          value={`${stats.totalPublishedCourses} / ${stats.totalCourses}`}
          subtitle="Active curriculum paths"
          icon={<BookOpen size={22} />}
          iconColor="var(--neo-secondary)"
        />
        <StatCard
          title="Total Enrollments"
          value={stats.totalEnrollments}
          subtitle="Course enrollments"
          icon={<TrendingUp size={22} />}
          iconColor="var(--neo-accent-coral)"
        />
        <StatCard
          title="Course Completions"
          value={stats.totalCompletions}
          subtitle="Certified students"
          icon={<CheckCircle2 size={22} />}
          iconColor="var(--neo-success)"
        />
      </div>

      {/* Administration Modules Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Quick Operations Box */}
        <NeoCard style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            Curriculum Operations
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--neo-text-secondary)', margin: 0 }}>
            Author modern courses, organize lessons with code snippets and video embeds, and configure server-evaluated multiple-choice quizzes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Link to="/admin/courses/new" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--neo-surface)',
                  boxShadow: 'var(--neo-raised-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'var(--neo-text)',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Create Course</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--neo-text-muted)' }}>Draft a new engineering course</span>
                </div>
                <ArrowRight size={18} color="var(--neo-primary)" />
              </div>
            </Link>

            <Link to="/admin/courses" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--neo-surface)',
                  boxShadow: 'var(--neo-raised-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'var(--neo-text)',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Course Catalog Manager</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--neo-text-muted)' }}>Publish, edit, and inspect all courses</span>
                </div>
                <ArrowRight size={18} color="var(--neo-secondary)" />
              </div>
            </Link>

            <Link to="/admin/users" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--neo-surface)',
                  boxShadow: 'var(--neo-raised-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'var(--neo-text)',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Student Roster</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--neo-text-muted)' }}>Audit learner interests and activity</span>
                </div>
                <ArrowRight size={18} color="var(--neo-accent-coral)" />
              </div>
            </Link>
          </div>
        </NeoCard>

        {/* Recent Enrollments Stream */}
        <NeoCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Award size={20} color="var(--neo-primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Recent Student Enrollments
            </h3>
          </div>

          {stats.recentEnrollments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {stats.recentEnrollments.map((enr) => (
                <div
                  key={enr.id}
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
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{enr.courseTitle}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--neo-text-muted)' }}>
                      Category: {enr.category} • Progress: {enr.progressPercentage}%
                    </span>
                  </div>
                  <span className={`badge ${enr.completed ? 'badge-success' : 'badge-primary'}`}>
                    {enr.completed ? 'Finished' : 'In Progress'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.875rem', color: 'var(--neo-text-muted)', margin: 0 }}>
              No enrollment events recorded yet.
            </p>
          )}
        </NeoCard>
      </div>
    </div>
  );
};
