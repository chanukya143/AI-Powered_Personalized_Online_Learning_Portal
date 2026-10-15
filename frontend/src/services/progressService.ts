import { apiClient } from './apiClient';
import { Enrollment, ProgressSummary, StudentDashboard } from '../types';

export const progressService = {
  async getDashboard(): Promise<StudentDashboard> {
    const { data } = await apiClient.get<StudentDashboard>('/progress/dashboard');
    return data;
  },

  async getMyEnrollments(): Promise<Enrollment[]> {
    const { data } = await apiClient.get<Enrollment[]>('/enrollments/me');
    return data;
  },

  async enrollInCourse(courseId: number): Promise<Enrollment> {
    const { data } = await apiClient.post<Enrollment>(`/enrollments/${courseId}`);
    return data;
  },

  async updateLessonProgress(lessonId: number, completed: boolean): Promise<ProgressSummary> {
    const { data } = await apiClient.put<ProgressSummary>(`/progress/lessons/${lessonId}`, { completed });
    return data;
  },

  async getCourseProgress(courseId: number): Promise<ProgressSummary> {
    const { data } = await apiClient.get<ProgressSummary>(`/progress/courses/${courseId}`);
    return data;
  },
};
