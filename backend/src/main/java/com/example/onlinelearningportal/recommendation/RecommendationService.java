package com.example.onlinelearningportal.recommendation;

import com.example.onlinelearningportal.dto.RecommendationResponse;

import java.util.List;

public interface RecommendationService {
    List<RecommendationResponse> getRecommendationsForUser(Long userId);
}
