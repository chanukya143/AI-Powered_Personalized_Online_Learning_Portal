import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { CourseCatalogPage } from './pages/CourseCatalogPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { MyCoursesPage } from './pages/student/MyCoursesPage';
import { CourseLearnPage } from './pages/student/CourseLearnPage';
import { QuizTakePage } from './pages/student/QuizTakePage';
import { RecommendationsPage } from './pages/student/RecommendationsPage';
import { AiAssistantPage } from './pages/student/AiAssistantPage';
import { ProfilePage } from './pages/student/ProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { CourseManagementPage } from './pages/admin/CourseManagementPage';
import { CourseEditPage } from './pages/admin/CourseEditPage';
import { LessonManagementPage } from './pages/admin/LessonManagementPage';
import { QuizManagementPage } from './pages/admin/QuizManagementPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';

// Route Guards
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <LoadingSkeleton height="150px" count={3} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <LoadingSkeleton height="150px" count={3} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<LandingPage />} />
            <Route path="courses" element={<CourseCatalogPage />} />
            <Route path="courses/:id" element={<CourseDetailsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Protected Student Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-courses"
              element={
                <ProtectedRoute>
                  <MyCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="lessons/:lessonId"
              element={
                <ProtectedRoute>
                  <CourseLearnPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="quizzes/:quizId"
              element={
                <ProtectedRoute>
                  <QuizTakePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="recommendations"
              element={
                <ProtectedRoute>
                  <RecommendationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="ai-assistant"
              element={
                <ProtectedRoute>
                  <AiAssistantPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="admin/courses"
              element={
                <AdminRoute>
                  <CourseManagementPage />
                </AdminRoute>
              }
            />
            <Route
              path="admin/courses/new"
              element={
                <AdminRoute>
                  <CourseEditPage />
                </AdminRoute>
              }
            />
            <Route
              path="admin/courses/edit/:id"
              element={
                <AdminRoute>
                  <CourseEditPage />
                </AdminRoute>
              }
            />
            <Route
              path="admin/courses/:courseId/lessons"
              element={
                <AdminRoute>
                  <LessonManagementPage />
                </AdminRoute>
              }
            />
            <Route
              path="admin/courses/:courseId/quiz"
              element={
                <AdminRoute>
                  <QuizManagementPage />
                </AdminRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <AdminRoute>
                  <UserManagementPage />
                </AdminRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
