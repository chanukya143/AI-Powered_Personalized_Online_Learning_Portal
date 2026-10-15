import { apiClient } from './apiClient';
import { Lesson } from '../types';

export const lessonService = {
  async getLesson(lessonId: number): Promise<Lesson> {
    const { data } = await apiClient.get<Lesson>(`/lessons/${lessonId}`);
    return data;
  },

  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    const { data } = await apiClient.get<Lesson[]>(`/courses/${courseId}/lessons`);
    return data;
  },
};
