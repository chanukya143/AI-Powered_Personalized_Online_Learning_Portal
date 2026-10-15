package com.example.onlinelearningportal.controller;

import com.example.onlinelearningportal.dto.LessonResponse;
import com.example.onlinelearningportal.entity.Role;
import com.example.onlinelearningportal.security.UserPrincipal;
import com.example.onlinelearningportal.service.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Lessons", description = "Endpoints for accessing interactive lesson content and curriculum navigation")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping("/courses/{courseId}/lessons")
    @Operation(summary = "Get list of lessons for a course")
    public ResponseEntity<List<LessonResponse>> getLessonsByCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal != null && userPrincipal.getRole() == Role.ADMIN;
        List<LessonResponse> lessons = lessonService.getLessonsByCourseId(courseId, isAdmin);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/lessons/{id}")
    @Operation(summary = "Get full lesson content and navigation pointers (requires course enrollment or admin role)")
    public ResponseEntity<LessonResponse> getLessonById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal != null && userPrincipal.getRole() == Role.ADMIN;
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        LessonResponse lesson = lessonService.getLessonById(id, userId, isAdmin);
        return ResponseEntity.ok(lesson);
    }
}
