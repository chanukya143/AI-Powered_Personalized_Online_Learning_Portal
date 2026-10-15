package com.example.onlinelearningportal.service;

import com.example.onlinelearningportal.dto.EnrollmentResponse;
import com.example.onlinelearningportal.entity.Course;
import com.example.onlinelearningportal.entity.Enrollment;
import com.example.onlinelearningportal.entity.User;
import com.example.onlinelearningportal.exception.BadRequestException;
import com.example.onlinelearningportal.exception.DuplicateResourceException;
import com.example.onlinelearningportal.exception.ResourceNotFoundException;
import com.example.onlinelearningportal.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             CourseRepository courseRepository,
                             UserRepository userRepository,
                             LessonRepository lessonRepository,
                             LessonProgressRepository lessonProgressRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.lessonProgressRepository = lessonProgressRepository;
    }

    @Transactional
    public EnrollmentResponse enrollInCourse(Long userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!course.isPublished()) {
            throw new BadRequestException("Cannot enroll in an unpublished course.");
        }

        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new DuplicateResourceException("You are already enrolled in this course.");
        }

        Enrollment enrollment = new Enrollment(user, course);
        Enrollment saved = enrollmentRepository.save(enrollment);

        return mapToEnrollmentResponse(saved, userId);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getMyEnrollments(Long userId) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserIdOrderByEnrolledAtDesc(userId);
        return enrollments.stream().map(e -> mapToEnrollmentResponse(e, userId)).toList();
    }

    @Transactional(readOnly = true)
    public boolean isEnrolled(Long userId, Long courseId) {
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    public EnrollmentResponse mapToEnrollmentResponse(Enrollment enrollment, Long userId) {
        Course course = enrollment.getCourse();
        int totalLessons = (int) lessonRepository.countByCourseIdAndPublishedTrue(course.getId());
        int completedLessons = (int) lessonProgressRepository.countByUserIdAndCourseIdAndCompletedTrue(userId, course.getId());
        int progress = totalLessons > 0 ? (int) Math.round(((double) completedLessons / totalLessons) * 100) : 0;

        return new EnrollmentResponse(
                enrollment.getId(),
                course.getId(),
                course.getTitle(),
                course.getCategory(),
                course.getDifficultyLevel(),
                course.getThumbnailUrl(),
                enrollment.getEnrolledAt(),
                enrollment.isCompleted(),
                enrollment.getCompletedAt(),
                totalLessons,
                completedLessons,
                progress
        );
    }
}
