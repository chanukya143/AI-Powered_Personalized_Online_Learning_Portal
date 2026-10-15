package com.example.onlinelearningportal.service;

import com.example.onlinelearningportal.dto.AdminStatsResponse;
import com.example.onlinelearningportal.dto.EnrollmentResponse;
import com.example.onlinelearningportal.dto.UserManagementDto;
import com.example.onlinelearningportal.entity.Enrollment;
import com.example.onlinelearningportal.entity.Role;
import com.example.onlinelearningportal.entity.User;
import com.example.onlinelearningportal.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final EnrollmentService enrollmentService;

    public AdminService(UserRepository userRepository,
                        CourseRepository courseRepository,
                        EnrollmentRepository enrollmentRepository,
                        QuizAttemptRepository quizAttemptRepository,
                        EnrollmentService enrollmentService) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.enrollmentService = enrollmentService;
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse getAdminStats() {
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalCourses = courseRepository.count();
        long totalPublishedCourses = courseRepository.countByPublishedTrue();
        long totalEnrollments = enrollmentRepository.count();
        long totalCompletions = enrollmentRepository.countByCompletedTrue();

        Double avgScore = quizAttemptRepository.getOverallAverageScore();
        double averageQuizScore = avgScore != null ? Math.round(avgScore * 10.0) / 10.0 : 0.0;

        List<Enrollment> recentEnrollmentsList = enrollmentRepository.findAll().stream()
                .sorted((a, b) -> b.getEnrolledAt().compareTo(a.getEnrolledAt()))
                .limit(6)
                .toList();

        List<EnrollmentResponse> recentEnrollments = recentEnrollmentsList.stream()
                .map(e -> enrollmentService.mapToEnrollmentResponse(e, e.getUser().getId()))
                .toList();

        return new AdminStatsResponse(
                totalStudents,
                totalCourses,
                totalPublishedCourses,
                totalEnrollments,
                totalCompletions,
                averageQuizScore,
                recentEnrollments
        );
    }

    @Transactional(readOnly = true)
    public List<UserManagementDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(u -> {
            long enrolledCount = enrollmentRepository.countByUserId(u.getId());
            return new UserManagementDto(
                    u.getId(),
                    u.getEmail(),
                    u.getFullName(),
                    u.getRole(),
                    u.getLearningInterests(),
                    enrolledCount,
                    u.getCreatedAt()
            );
        }).toList();
    }
}
