export type Role = 'STUDENT' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  learningInterests?: string;
  createdAt?: string;
}

export interface AuthResponse {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresInMs: number;
  user: User;
}

export interface Course {
  id: number;
  title: string;
  shortDescription: string;
  category: string;
  difficultyLevel: string;
  instructorName: string;
  thumbnailUrl: string;
  estimatedDuration: string;
  published: boolean;
  lessonsCount: number;
  quizId?: number | null;
  createdAt: string;
}

export interface LessonSummary {
  id: number;
  title: string;
  lessonOrder: number;
  estimatedDuration: string;
  published: boolean;
  completed: boolean;
}

export interface CourseDetail extends Course {
  fullDescription: string;
  lessons: LessonSummary[];
  enrolled: boolean;
  completed: boolean;
  progressPercentage: number;
}

export interface Lesson {
  id: number;
  courseId: number;
  courseTitle: string;
  title: string;
  description: string;
  lessonOrder: number;
  content: string;
  videoUrl?: string;
  estimatedDuration: string;
  published: boolean;
  completed: boolean;
  nextLessonId?: number | null;
  previousLessonId?: number | null;
  createdAt: string;
}

export interface Enrollment {
  id: number;
  courseId: number;
  courseTitle: string;
  category: string;
  difficultyLevel: string;
  thumbnailUrl: string;
  enrolledAt: string;
  completed: boolean;
  completedAt?: string | null;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}

export interface ProgressSummary {
  courseId: number;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  courseCompleted: boolean;
}

export interface QuestionDetail {
  id: number;
  questionText: string;
  options: string[];
  questionOrder: number;
}

export interface QuestionAdminDetail {
  id?: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  questionOrder: number;
}

export interface QuizAttemptSummary {
  id: number;
  quizId: number;
  quizTitle: string;
  score: number;
  passed: boolean;
  attemptedAt: string;
}

export interface QuizDetail {
  id: number;
  courseId: number;
  courseTitle: string;
  title: string;
  description: string;
  passingScore: number;
  questions: QuestionDetail[];
  lastAttempt?: QuizAttemptSummary | null;
}

export interface QuizAdminDetail {
  id: number;
  courseId: number;
  courseTitle: string;
  title: string;
  description: string;
  passingScore: number;
  questions: QuestionAdminDetail[];
}

export interface QuestionResult {
  questionId: number;
  questionText: string;
  options: string[];
  selectedOptionIndex: number;
  correctAnswerIndex: number;
  correct: boolean;
  explanation?: string;
}

export interface QuizResult {
  attemptId: number;
  quizId: number;
  quizTitle: string;
  score: number;
  passed: boolean;
  passingScore: number;
  totalQuestions: number;
  correctAnswersCount: number;
  questionResults: QuestionResult[];
  attemptedAt: string;
}

export interface Recommendation {
  courseId: number;
  title: string;
  shortDescription: string;
  category: string;
  difficultyLevel: string;
  thumbnailUrl: string;
  instructorName: string;
  estimatedDuration: string;
  explanation: string;
  score: number;
}

export interface StudentDashboard {
  welcomeMessage: string;
  totalEnrolledCourses: number;
  inProgressCourses: number;
  completedCourses: number;
  averageQuizScore: number;
  learningStreakDays: number;
  continueLearningCourse?: Enrollment | null;
  enrolledCourses: Enrollment[];
  recentQuizAttempts: QuizAttemptSummary[];
  recommendations: Recommendation[];
}

export interface AdminStats {
  totalStudents: number;
  totalCourses: number;
  totalPublishedCourses: number;
  totalEnrollments: number;
  totalCompletions: number;
  averageQuizScore: number;
  recentEnrollments: Enrollment[];
}

export interface UserManagement {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  learningInterests: string;
  enrolledCoursesCount: number;
  createdAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AiChatResponse {
  reply: string;
  suggestedFollowups: string[];
  demoMode: boolean;
  provider: string;
  timestamp: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}
