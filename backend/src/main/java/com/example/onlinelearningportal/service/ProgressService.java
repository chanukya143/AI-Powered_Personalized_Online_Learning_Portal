package com.example.onlinelearningportal.service;

import com.example.onlinelearningportal.dto.*;
import com.example.onlinelearningportal.entity.*;
import com.example.onlinelearningportal.exception.ForbiddenException;
import com.example.onlinelearningportal.exception.ResourceNotFoundException;
import com.example.onlinelearningportal.recommendation.RecommendationService;
import com.example.onlinelearningportal.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressService {

    private final LessonProgressRepository lessonProgressRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final EnrollmentService enrollmentService;
    private final RecommendationService recommendationService;

    public ProgressService(LessonProgressRepository lessonProgressRepository,
                           EnrollmentRepository enrollmentRepository,
                           LessonRepository lessonRepository,
                           CourseRepository courseRepository,
                           UserRepository userRepository,
                           QuizAttemptRepository quizAttemptRepository,
                           EnrollmentService enrollmentService,
                           RecommendationService recommendationService) {
        this.lessonProgressRepository = lessonProgressRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.enrollmentService = enrollmentService;
        this.recommendationService = recommendationService;
    }

    @Transactional
    public ProgressSummaryResponse updateLessonProgress(Long userId, Long lessonId, boolean completed) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));

        Course course = lesson.getCourse();

        // 1. Verify student enrollment
        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, course.getId())
                .orElseThrow(() -> new ForbiddenException("You must be enrolled in this course to track progress."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Optional<LessonProgress> existingProgress = lessonProgressRepository.findByUserIdAndLessonId(userId, lessonId);

        if (completed) {
            if (existingProgress.isEmpty()) {
                LessonProgress progress = new LessonProgress(user, course, lesson);
                lessonProgressRepository.save(progress);
            }
        } else {
            existingProgress.ifPresent(lessonProgressRepository::delete);
        }

        // 2. Recalculate course overall progress
        int totalLessons = (int) lessonRepository.countByCourseIdAndPublishedTrue(course.getId());
        int completedLessons = (int) lessonProgressRepository.countByUserIdAndCourseIdAndCompletedTrue(userId, course.getId());
        int progressPercentage = totalLessons > 0 ? (int) Math.round(((double) completedLessons / totalLessons) * 100) : 0;

        boolean isCompleted = totalLessons > 0 && completedLessons >= totalLessons;
        if (isCompleted && !enrollment.isCompleted()) {
            enrollment.setCompleted(true);
            enrollment.setCompletedAt(Instant.now());
            enrollmentRepository.save(enrollment);
        } else if (!isCompleted && enrollment.isCompleted()) {
            enrollment.setCompleted(false);
            enrollment.setCompletedAt(null);
            enrollmentRepository.save(enrollment);
        }

        return new ProgressSummaryResponse(
                course.getId(),
                totalLessons,
                completedLessons,
                progressPercentage,
                enrollment.isCompleted()
        );
    }

    @Transactional(readOnly = true)
    public ProgressSummaryResponse getCourseProgress(Long userId, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        int totalLessons = (int) lessonRepository.countByCourseIdAndPublishedTrue(course.getId());
        int completedLessons = (int) lessonProgressRepository.countByUserIdAndCourseIdAndCompletedTrue(userId, course.getId());
        int progressPercentage = totalLessons > 0 ? (int) Math.round(((double) completedLessons / totalLessons) * 100) : 0;

        boolean isCompleted = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .map(Enrollment::isCompleted)
                .orElse(false);

        return new ProgressSummaryResponse(
                courseId,
                totalLessons,
                completedLessons,
                progressPercentage,
                isCompleted
        );
    }

    @Transactional(readOnly = true)
    public StudentDashboardResponse getStudentDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        long totalEnrolled = enrollmentRepository.countByUserId(userId);
        long completed = enrollmentRepository.countByUserIdAndCompletedTrue(userId);
        long inProgress = Math.max(0, totalEnrolled - completed);

        Double avgScore = quizAttemptRepository.getAverageScoreByUserId(userId);
        double averageQuizScore = avgScore != null ? Math.round(avgScore * 10.0) / 10.0 : 0.0;

        List<EnrollmentResponse> enrolledCourses = enrollmentService.getMyEnrollments(userId);

        // Find continue learning course (first in-progress course, or most recent)
        EnrollmentResponse continueLearning = enrolledCourses.stream()
                .filter(e -> !e.isCompleted())
                .findFirst()
                .orElse(enrolledCourses.isEmpty() ? null : enrolledCourses.get(0));

        // Recent quiz attempts
        List<QuizAttemptSummaryResponse> recentQuizAttempts = quizAttemptRepository
                .findByUserIdOrderByAttemptedAtDesc(userId)
                .stream()
                .limit(5)
                .map(QuizAttemptSummaryResponse::fromEntity)
                .toList();

        // Personalized recommendations
        List<RecommendationResponse> recommendations = recommendationService.getRecommendationsForUser(userId);

        // Estimate active learning streak based on progress activities (minimum 1 day if enrolled)
        int streak = totalEnrolled > 0 ? (int) Math.min(7, (completed * 2) + Math.max(1, inProgress)) : 0;

        String welcome = "Welcome back, " + user.getFullName() + "!";

        return new StudentDashboardResponse(
                welcome,
                totalEnrolled,
                inProgress,
                completed,
                averageQuizScore,
                streak,
                continueLearning,
                enrolledCourses,
                recentQuizAttempts,
                recommendations
        );
    }
}
