package com.example.onlinelearningportal.controller;

import com.example.onlinelearningportal.dto.EnrollmentResponse;
import com.example.onlinelearningportal.security.UserPrincipal;
import com.example.onlinelearningportal.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@Tag(name = "Enrollments", description = "Endpoints for course enrollment and tracking enrolled courses")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/{courseId}")
    @Operation(summary = "Enroll authenticated student in a course")
    public ResponseEntity<EnrollmentResponse> enrollInCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        EnrollmentResponse response = enrollmentService.enrollInCourse(userPrincipal.getId(), courseId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/me")
    @Operation(summary = "Get all courses the authenticated student is currently enrolled in")
    public ResponseEntity<List<EnrollmentResponse>> getMyEnrollments(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<EnrollmentResponse> enrollments = enrollmentService.getMyEnrollments(userPrincipal.getId());
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/check/{courseId}")
    @Operation(summary = "Check whether student is enrolled in a specific course")
    public ResponseEntity<Map<String, Boolean>> checkEnrollment(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean enrolled = enrollmentService.isEnrolled(userPrincipal.getId(), courseId);
        return ResponseEntity.ok(Map.of("enrolled", enrolled));
    }
}
