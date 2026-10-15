import { apiClient } from './apiClient';
import { Recommendation } from '../types';

export const recommendationService = {
  async getRecommendations(): Promise<Recommendation[]> {
    const { data } = await apiClient.get<Recommendation[]>('/recommendations/me');
    return data;
  },
};
