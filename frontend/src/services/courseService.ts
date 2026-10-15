import { apiClient } from './apiClient';
import { Course, CourseDetail, PagedResponse } from '../types';

export interface CourseFilterParams {
  search?: string;
  category?: string;
  difficulty?: string;
  page?: number;
  size?: number;
}

export const courseService = {
  async getCourses(params?: CourseFilterParams): Promise<PagedResponse<Course>> {
    const { data } = await apiClient.get<PagedResponse<Course>>('/courses', { params });
    return data;
  },

  async getFeaturedCourses(): Promise<Course[]> {
    const { data } = await apiClient.get<Course[]>('/courses/featured');
    return data;
  },

  async getCategories(): Promise<string[]> {
    const { data } = await apiClient.get<string[]>('/courses/categories');
    return data;
  },

  async getCourseDetails(courseId: number): Promise<CourseDetail> {
    const { data } = await apiClient.get<CourseDetail>(`/courses/${courseId}`);
    return data;
  },
};
