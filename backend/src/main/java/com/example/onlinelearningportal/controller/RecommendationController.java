package com.example.onlinelearningportal.controller;

import com.example.onlinelearningportal.dto.RecommendationResponse;
import com.example.onlinelearningportal.recommendation.RecommendationService;
import com.example.onlinelearningportal.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@Tag(name = "Personalized Recommendations", description = "AI-powered rule-based course recommendation engine")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get adaptive, personalized course recommendations with custom rationale for the current user")
    public ResponseEntity<List<RecommendationResponse>> getMyRecommendations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<RecommendationResponse> recommendations = recommendationService.getRecommendationsForUser(userPrincipal.getId());
        return ResponseEntity.ok(recommendations);
    }
}
