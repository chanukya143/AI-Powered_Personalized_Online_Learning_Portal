import React, { useEffect, useState } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Course, PagedResponse } from '../types';
import { courseService } from '../services/courseService';
import { PageHeader } from '../components/common/PageHeader';
import { NeoInput } from '../components/common/NeoInput';
import { NeoSelect } from '../components/common/NeoSelect';
import { NeoButton } from '../components/common/NeoButton';
import { CourseCard } from '../components/common/CourseCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories once on mount
  useEffect(() => {
    courseService.getCategories()
      .then((cats) => setCategories(cats))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  // Fetch paginated & filtered courses
  const fetchCourses = async (pageToFetch: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PagedResponse<Course> = await courseService.getCourses({
        search: search.trim() || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        page: pageToFetch,
        size: 9,
      });
      setCourses(response.content);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: unknown) {
      setError('Unable to load courses from the backend server. Please verify the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(0);
  }, [selectedCategory, selectedDifficulty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses(0);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    fetchCourses(0);
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  return (
    <div className="container">
      <PageHeader
        title="Explore Courses"
        subtitle={`Discover and enroll in ${totalElements} industry-grade curriculum paths`}
      />

      {/* Filter & Search Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-end',
          marginBottom: '2.5rem',
          padding: '1.5rem',
          backgroundColor: 'var(--neo-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--neo-raised-sm)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
          <NeoInput
            placeholder="Search by title, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={18} />}
          />
          <NeoButton type="submit" variant="primary" size="md">
            Search
          </NeoButton>
        </form>

        <NeoSelect
          options={categoryOptions}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        />

        <NeoSelect
          options={difficultyOptions}
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        />
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid-cols-3">
          <LoadingSkeleton height="360px" count={6} />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchCourses(currentPage)} />
      ) : courses.length > 0 ? (
        <>
          <div className="grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '3.5rem',
              }}
            >
              <NeoButton
                variant="neutral"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => fetchCourses(currentPage - 1)}
              >
                Previous
              </NeoButton>

              {Array.from({ length: totalPages }).map((_, index) => (
                <NeoButton
                  key={index}
                  variant={index === currentPage ? 'primary' : 'neutral'}
                  size="sm"
                  onClick={() => fetchCourses(index)}
                  style={{ minWidth: '38px', padding: '0.45rem' }}
                >
                  {index + 1}
                </NeoButton>
              ))}

              <NeoButton
                variant="neutral"
                size="sm"
                disabled={currentPage >= totalPages - 1}
                onClick={() => fetchCourses(currentPage + 1)}
              >
                Next
              </NeoButton>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No courses found"
          description="We couldn't find any courses matching your specific search criteria. Try modifying your search or clearing active filters."
          icon={<BookOpen size={36} />}
          actionText="Clear Filters"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
};
