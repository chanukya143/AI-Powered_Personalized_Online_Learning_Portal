import { apiClient } from './apiClient';
import { AiChatResponse } from '../types';

export interface AiChatPayload {
  message: string;
  currentCourseTitle?: string;
  currentLessonTitle?: string;
  lessonSnippet?: string;
  mode?: 'concept_explainer' | 'practice_questions' | 'roadmap' | 'general';
}

export const aiService = {
  async chat(payload: AiChatPayload): Promise<AiChatResponse> {
    const { data } = await apiClient.post<AiChatResponse>('/ai/assistant', payload);
    return data;
  },
};
