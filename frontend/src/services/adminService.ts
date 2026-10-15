import { apiClient } from './apiClient';
import { AdminStats, Course, PagedResponse, QuizAdminDetail, UserManagement } from '../types';

export interface CourseCreatePayload {
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  category: string;
  difficultyLevel: string;
  instructorName?: string;
  thumbnailUrl?: string;
  estimatedDuration?: string;
  published: boolean;
}

export interface LessonCreatePayload {
  title: string;
  description?: string;
  lessonOrder?: number;
  content: string;
  videoUrl?: string;
  estimatedDuration?: string;
  published: boolean;
}

export interface QuizCreatePayload {
  courseId: number;
  title: string;
  description?: string;
  passingScore?: number;
  questions: Array<{
    id?: number;
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    explanation?: string;
    questionOrder?: number;
  }>;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const { data } = await apiClient.get<AdminStats>('/admin/stats');
    return data;
  },

  async getUsers(): Promise<UserManagement[]> {
    const { data } = await apiClient.get<UserManagement[]>('/admin/users');
    return data;
  },

  async getAdminCourses(params?: { search?: string; category?: string; page?: number; size?: number }): Promise<PagedResponse<Course>> {
    const { data } = await apiClient.get<PagedResponse<Course>>('/admin/courses', { params });
    return data;
  },

  async createCourse(payload: CourseCreatePayload): Promise<Course> {
    const { data } = await apiClient.post<Course>('/admin/courses', payload);
    return data;
  },

  async updateCourse(courseId: number, payload: CourseCreatePayload): Promise<Course> {
    const { data } = await apiClient.put<Course>(`/admin/courses/${courseId}`, payload);
    return data;
  },

  async togglePublish(courseId: number): Promise<Course> {
    const { data } = await apiClient.patch<Course>(`/admin/courses/${courseId}/toggle-publish`);
    return data;
  },

  async deleteCourse(courseId: number): Promise<void> {
    await apiClient.delete(`/admin/courses/${courseId}`);
  },

  async createLesson(courseId: number, payload: LessonCreatePayload): Promise<unknown> {
    const { data } = await apiClient.post(`/admin/courses/${courseId}/lessons`, payload);
    return data;
  },

  async updateLesson(lessonId: number, payload: LessonCreatePayload): Promise<unknown> {
    const { data } = await apiClient.put(`/admin/lessons/${lessonId}`, payload);
    return data;
  },

  async deleteLesson(lessonId: number): Promise<void> {
    await apiClient.delete(`/admin/lessons/${lessonId}`);
  },

  async getAdminQuiz(quizId: number): Promise<QuizAdminDetail> {
    const { data } = await apiClient.get<QuizAdminDetail>(`/admin/quizzes/${quizId}`);
    return data;
  },

  async createQuiz(payload: QuizCreatePayload): Promise<QuizAdminDetail> {
    const { data } = await apiClient.post<QuizAdminDetail>('/admin/quizzes', payload);
    return data;
  },

  async updateQuiz(quizId: number, payload: QuizCreatePayload): Promise<QuizAdminDetail> {
    const { data } = await apiClient.put<QuizAdminDetail>(`/admin/quizzes/${quizId}`, payload);
    return data;
  },

  async deleteQuiz(quizId: number): Promise<void> {
    await apiClient.delete(`/admin/quizzes/${quizId}`);
  },
};
