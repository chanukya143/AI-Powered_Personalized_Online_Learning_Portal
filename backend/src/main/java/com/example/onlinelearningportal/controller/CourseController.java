package com.example.onlinelearningportal.controller;

import com.example.onlinelearningportal.dto.CourseDetailResponse;
import com.example.onlinelearningportal.dto.CourseResponse;
import com.example.onlinelearningportal.dto.PagedResponse;
import com.example.onlinelearningportal.security.UserPrincipal;
import com.example.onlinelearningportal.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@Tag(name = "Courses", description = "Public catalog browsing, filtering, search, and course curriculum details")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    @Operation(summary = "Search and filter published courses with pagination")
    public ResponseEntity<PagedResponse<CourseResponse>> searchCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        PagedResponse<CourseResponse> response = courseService.searchCourses(search, category, difficulty, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured courses for landing page")
    public ResponseEntity<List<CourseResponse>> getFeaturedCourses() {
        List<CourseResponse> featured = courseService.getFeaturedCourses();
        return ResponseEntity.ok(featured);
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all distinct published course categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = courseService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get course details and syllabus; includes user enrollment status if authenticated")
    public ResponseEntity<CourseDetailResponse> getCourseDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        CourseDetailResponse details = courseService.getCourseDetails(id, currentUserId);
        return ResponseEntity.ok(details);
    }
}
