package com.example.onlinelearningportal.controller;

import com.example.onlinelearningportal.dto.*;
import com.example.onlinelearningportal.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Operations", description = "Endpoints restricted to administrative users for portal management")
public class AdminController {

    private final AdminService adminService;
    private final CourseService courseService;
    private final LessonService lessonService;
    private final QuizService quizService;

    public AdminController(AdminService adminService,
                           CourseService courseService,
                           LessonService lessonService,
                           QuizService quizService) {
        this.adminService = adminService;
        this.courseService = courseService;
        this.lessonService = lessonService;
        this.quizService = quizService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get platform-wide analytics and enrollment metrics")
    public ResponseEntity<AdminStatsResponse> getStats() {
        AdminStatsResponse stats = adminService.getAdminStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    @Operation(summary = "Get all registered users with enrollment counts")
    public ResponseEntity<List<UserManagementDto>> getAllUsers() {
        List<UserManagementDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/courses")
    @Operation(summary = "Get all courses (both published and draft) with pagination")
    public ResponseEntity<PagedResponse<CourseResponse>> getAdminCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        PagedResponse<CourseResponse> courses = courseService.adminSearchCourses(search, category, difficulty, page, size);
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/courses")
    @Operation(summary = "Create a new course")
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request) {
        CourseResponse created = courseService.createCourse(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/courses/{id}")
    @Operation(summary = "Update course details")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        CourseResponse updated = courseService.updateCourse(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/courses/{id}/toggle-publish")
    @Operation(summary = "Toggle course published/draft status")
    public ResponseEntity<CourseResponse> togglePublish(@PathVariable Long id) {
        CourseResponse updated = courseService.togglePublishCourse(id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/courses/{id}")
    @Operation(summary = "Delete course and cascade delete its lessons and quizzes")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    // --- Lesson Management ---

    @PostMapping("/courses/{courseId}/lessons")
    @Operation(summary = "Add a new lesson to a course")
    public ResponseEntity<LessonResponse> createLesson(
            @PathVariable Long courseId,
            @Valid @RequestBody LessonRequest request) {
        LessonResponse created = lessonService.createLesson(courseId, request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/lessons/{id}")
    @Operation(summary = "Update an existing lesson")
    public ResponseEntity<LessonResponse> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody LessonRequest request) {
        LessonResponse updated = lessonService.updateLesson(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/lessons/{id}")
    @Operation(summary = "Delete a lesson")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }

    // --- Quiz Management ---

    @GetMapping("/quizzes/{id}")
    @Operation(summary = "Get quiz details with correct answer keys and explanations for editing")
    public ResponseEntity<QuizAdminDetailResponse> getAdminQuiz(@PathVariable Long id) {
        QuizAdminDetailResponse quiz = quizService.getQuizForAdmin(id);
        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/quizzes")
    @Operation(summary = "Create a quiz with questions and answer keys for a course")
    public ResponseEntity<QuizResponse> createQuiz(@Valid @RequestBody QuizCreateRequest request) {
        QuizResponse created = quizService.createQuiz(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/quizzes/{id}")
    @Operation(summary = "Update an existing quiz and its questions")
    public ResponseEntity<QuizResponse> updateQuiz(
            @PathVariable Long id,
            @Valid @RequestBody QuizCreateRequest request) {
        QuizResponse updated = quizService.updateQuiz(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/quizzes/{id}")
    @Operation(summary = "Delete a quiz")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }
}
