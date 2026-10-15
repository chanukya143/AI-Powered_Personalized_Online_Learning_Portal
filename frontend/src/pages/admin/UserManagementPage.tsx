import React, { useEffect, useState } from 'react';
import { Users, Search, Shield, BookOpen, Clock } from 'lucide-react';
import { UserManagement } from '../../types';
import { adminService } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/apiClient';
import { PageHeader } from '../../components/common/PageHeader';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoInput } from '../../components/common/NeoInput';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <PageHeader
        title="Student & User Management"
        subtitle={`Roster of ${users.length} registered learners and administrators`}
      />

      <div style={{ maxWidth: '400px' }}>
        <NeoInput
          placeholder="Search by student name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={18} />}
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton height="70px" count={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : filteredUsers.length > 0 ? (
        <NeoCard style={{ padding: '0', overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(163, 177, 198, 0.3)', backgroundColor: 'rgba(235, 240, 245, 0.6)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--neo-text-muted)' }}>STUDENT NAME</th>
                <th style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--neo-text-muted)' }}>EMAIL</th>
                <th style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--neo-text-muted)' }}>ROLE</th>
                <th style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--neo-text-muted)' }}>LEARNING INTERESTS</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--neo-text-muted)', textAlign: 'right' }}>ENROLLMENTS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(163, 177, 198, 0.2)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--neo-text)' }}>
                    {user.fullName}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--neo-text-secondary)' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${user.role === 'ADMIN' ? 'badge-primary' : 'badge-secondary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--neo-text-secondary)', maxWidth: '280px' }}>
                    {user.learningInterests || 'None specified'}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 700, color: 'var(--neo-primary)' }}>
                    {user.enrolledCoursesCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </NeoCard>
      ) : (
        <NeoCard style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No user accounts matched your search.</p>
        </NeoCard>
      )}
    </div>
  );
};
