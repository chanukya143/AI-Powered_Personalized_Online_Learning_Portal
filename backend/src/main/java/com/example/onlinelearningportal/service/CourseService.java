package com.example.onlinelearningportal.service;

import com.example.onlinelearningportal.dto.*;
import com.example.onlinelearningportal.entity.Course;
import com.example.onlinelearningportal.entity.Enrollment;
import com.example.onlinelearningportal.entity.Lesson;
import com.example.onlinelearningportal.entity.Quiz;
import com.example.onlinelearningportal.exception.ResourceNotFoundException;
import com.example.onlinelearningportal.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;

    public CourseService(CourseRepository courseRepository,
                         LessonRepository lessonRepository,
                         QuizRepository quizRepository,
                         EnrollmentRepository enrollmentRepository,
                         LessonProgressRepository lessonProgressRepository) {
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonProgressRepository = lessonProgressRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<CourseResponse> searchCourses(String search, String category, String difficulty,
                                                       int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        String cleanCategory = (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) ? category.trim() : null;
        String cleanDifficulty = (difficulty != null && !difficulty.isBlank() && !"all".equalsIgnoreCase(difficulty)) ? difficulty.trim() : null;

        Page<Course> coursePage = courseRepository.searchPublishedCourses(cleanSearch, cleanCategory, cleanDifficulty, pageable);

        List<CourseResponse> content = coursePage.getContent().stream()
                .map(this::mapToCourseResponse)
                .toList();

        return new PagedResponse<>(
                content,
                coursePage.getNumber(),
                coursePage.getSize(),
                coursePage.getTotalElements(),
                coursePage.getTotalPages(),
                coursePage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getFeaturedCourses() {
        Pageable pageable = PageRequest.of(0, 4, Sort.by("createdAt").descending());
        Page<Course> page = courseRepository.searchPublishedCourses(null, null, null, pageable);
        return page.getContent().stream().map(this::mapToCourseResponse).toList();
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseDetails(Long courseId, Long currentUserId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        List<Lesson> lessons = lessonRepository.findByCourseIdAndPublishedTrueOrderByLessonOrderAsc(courseId);
        Optional<Quiz> quiz = quizRepository.findFirstByCourseId(courseId);
        Long quizId = quiz.map(Quiz::getId).orElse(null);

        boolean enrolled = false;
        boolean completed = false;
        int progressPercentage = 0;

        if (currentUserId != null) {
            Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByUserIdAndCourseId(currentUserId, courseId);
            if (enrollmentOpt.isPresent()) {
                enrolled = true;
                completed = enrollmentOpt.get().isCompleted();
                long completedLessonsCount = lessonProgressRepository.countByUserIdAndCourseIdAndCompletedTrue(currentUserId, courseId);
                if (!lessons.isEmpty()) {
                    progressPercentage = (int) Math.round(((double) completedLessonsCount / lessons.size()) * 100);
                }
            }
        }

        final boolean userIsEnrolled = enrolled;
        List<LessonSummaryResponse> lessonSummaries = lessons.stream().map(lesson -> {
            boolean lessonCompleted = false;
            if (userIsEnrolled && currentUserId != null) {
                lessonCompleted = lessonProgressRepository.existsByUserIdAndLessonIdAndCompletedTrue(currentUserId, lesson.getId());
            }
            return LessonSummaryResponse.fromEntity(lesson, lessonCompleted);
        }).toList();

        return new CourseDetailResponse(
                course.getId(),
                course.getTitle(),
                course.getShortDescription(),
                course.getFullDescription(),
                course.getCategory(),
                course.getDifficultyLevel(),
                course.getInstructorName(),
                course.getThumbnailUrl(),
                course.getEstimatedDuration(),
                course.isPublished(),
                course.getCreatedAt(),
                lessonSummaries,
                quizId,
                enrolled,
                completed,
                progressPercentage
        );
    }

    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return courseRepository.findDistinctPublishedCategories();
    }

    // --- Admin Operations ---

    @Transactional(readOnly = true)
    public PagedResponse<CourseResponse> adminSearchCourses(String search, String category, String difficulty,
                                                            int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        String cleanCategory = (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) ? category.trim() : null;
        String cleanDifficulty = (difficulty != null && !difficulty.isBlank() && !"all".equalsIgnoreCase(difficulty)) ? difficulty.trim() : null;

        Page<Course> coursePage = courseRepository.searchAllCoursesAdmin(cleanSearch, cleanCategory, cleanDifficulty, pageable);

        List<CourseResponse> content = coursePage.getContent().stream()
                .map(this::mapToCourseResponse)
                .toList();

        return new PagedResponse<>(
                content,
                coursePage.getNumber(),
                coursePage.getSize(),
                coursePage.getTotalElements(),
                coursePage.getTotalPages(),
                coursePage.isLast()
        );
    }

    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        Course course = new Course(
                request.getTitle().trim(),
                request.getShortDescription() != null ? request.getShortDescription().trim() : "",
                request.getFullDescription() != null ? request.getFullDescription().trim() : "",
                request.getCategory().trim(),
                request.getDifficultyLevel().trim(),
                request.getInstructorName() != null ? request.getInstructorName().trim() : "Portal Instructor",
                request.getThumbnailUrl() != null ? request.getThumbnailUrl().trim() : "",
                request.getEstimatedDuration() != null ? request.getEstimatedDuration().trim() : "4 Hours",
                request.isPublished()
        );

        Course savedCourse = courseRepository.save(course);
        return mapToCourseResponse(savedCourse);
    }

    @Transactional
    public CourseResponse updateCourse(Long courseId, CourseRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        course.setTitle(request.getTitle().trim());
        course.setShortDescription(request.getShortDescription() != null ? request.getShortDescription().trim() : "");
        course.setFullDescription(request.getFullDescription() != null ? request.getFullDescription().trim() : "");
        course.setCategory(request.getCategory().trim());
        course.setDifficultyLevel(request.getDifficultyLevel().trim());
        if (request.getInstructorName() != null) {
            course.setInstructorName(request.getInstructorName().trim());
        }
        if (request.getThumbnailUrl() != null) {
            course.setThumbnailUrl(request.getThumbnailUrl().trim());
        }
        if (request.getEstimatedDuration() != null) {
            course.setEstimatedDuration(request.getEstimatedDuration().trim());
        }
        course.setPublished(request.isPublished());

        Course updatedCourse = courseRepository.save(course);
        return mapToCourseResponse(updatedCourse);
    }

    @Transactional
    public CourseResponse togglePublishCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        course.setPublished(!course.isPublished());
        Course updatedCourse = courseRepository.save(course);
        return mapToCourseResponse(updatedCourse);
    }

    @Transactional
    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        courseRepository.delete(course);
    }

    private CourseResponse mapToCourseResponse(Course course) {
        int lessonsCount = (int) lessonRepository.countByCourseIdAndPublishedTrue(course.getId());
        Long quizId = quizRepository.findFirstByCourseId(course.getId()).map(Quiz::getId).orElse(null);
        return CourseResponse.fromEntity(course, lessonsCount, quizId);
    }
}
