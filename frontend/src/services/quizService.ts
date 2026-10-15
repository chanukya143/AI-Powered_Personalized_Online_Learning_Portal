import { apiClient } from './apiClient';
import { QuizAttemptSummary, QuizDetail, QuizResult } from '../types';

export const quizService = {
  async getQuiz(quizId: number): Promise<QuizDetail> {
    const { data } = await apiClient.get<QuizDetail>(`/quizzes/${quizId}`);
    return data;
  },

  async submitQuiz(quizId: number, answers: Record<number, number>): Promise<QuizResult> {
    const { data } = await apiClient.post<QuizResult>(`/quizzes/${quizId}/attempts`, { answers });
    return data;
  },

  async getMyAttempts(): Promise<QuizAttemptSummary[]> {
    const { data } = await apiClient.get<QuizAttemptSummary[]>('/quizzes/attempts/me');
    return data;
  },
};
