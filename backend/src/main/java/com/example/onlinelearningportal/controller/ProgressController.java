package com.example.onlinelearningportal.controller;

import com.example.onlinelearningportal.dto.LessonProgressUpdateRequest;
import com.example.onlinelearningportal.dto.ProgressSummaryResponse;
import com.example.onlinelearningportal.dto.StudentDashboardResponse;
import com.example.onlinelearningportal.security.UserPrincipal;
import com.example.onlinelearningportal.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@Tag(name = "Progress & Dashboard", description = "Endpoints for student learning analytics, lesson completion, and overall progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get aggregated student dashboard metrics, streaks, in-progress courses and recommendations")
    public ResponseEntity<StudentDashboardResponse> getStudentDashboard(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        StudentDashboardResponse dashboard = progressService.getStudentDashboard(userPrincipal.getId());
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/courses/{courseId}")
    @Operation(summary = "Get current progress percentage and completion status for a course")
    public ResponseEntity<ProgressSummaryResponse> getCourseProgress(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ProgressSummaryResponse summary = progressService.getCourseProgress(userPrincipal.getId(), courseId);
        return ResponseEntity.ok(summary);
    }

    @PutMapping("/lessons/{lessonId}")
    @Operation(summary = "Mark lesson as completed or incompleted and update course progress")
    public ResponseEntity<ProgressSummaryResponse> updateLessonProgress(
            @PathVariable Long lessonId,
            @RequestBody(required = false) LessonProgressUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean completed = request == null || request.isCompleted();
        ProgressSummaryResponse summary = progressService.updateLessonProgress(userPrincipal.getId(), lessonId, completed);
        return ResponseEntity.ok(summary);
    }
}
