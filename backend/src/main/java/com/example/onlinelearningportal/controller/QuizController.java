package com.example.onlinelearningportal.controller;

import com.example.onlinelearningportal.dto.*;
import com.example.onlinelearningportal.entity.Role;
import com.example.onlinelearningportal.security.UserPrincipal;
import com.example.onlinelearningportal.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@Tag(name = "Quizzes & Assessments", description = "Endpoints for taking quizzes, scoring submissions, and viewing assessment results")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get quiz questions for taking the test (answers are securely stripped)")
    public ResponseEntity<QuizDetailResponse> getQuiz(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal != null && userPrincipal.getRole() == Role.ADMIN;
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        QuizDetailResponse quiz = quizService.getQuizForStudent(id, userId, isAdmin);
        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/{id}/attempts")
    @Operation(summary = "Submit quiz answers for server-side evaluation and scoring")
    public ResponseEntity<QuizResultResponse> submitQuiz(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody QuizSubmissionRequest submission) {
        QuizResultResponse result = quizService.submitQuiz(id, userPrincipal.getId(), submission);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/attempts/me")
    @Operation(summary = "Get historical quiz attempts for current authenticated user")
    public ResponseEntity<List<QuizAttemptSummaryResponse>> getMyAttempts(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<QuizAttemptSummaryResponse> attempts = quizService.getMyAttempts(userPrincipal.getId());
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get all quizzes associated with a course")
    public ResponseEntity<List<QuizResponse>> getQuizzesByCourse(@PathVariable Long courseId) {
        List<QuizResponse> quizzes = quizService.getQuizzesByCourseId(courseId);
        return ResponseEntity.ok(quizzes);
    }
}
