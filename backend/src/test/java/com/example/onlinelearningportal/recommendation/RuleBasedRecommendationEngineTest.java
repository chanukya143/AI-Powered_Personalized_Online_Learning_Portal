package com.example.onlinelearningportal.recommendation;

import com.example.onlinelearningportal.dto.RecommendationResponse;
import com.example.onlinelearningportal.entity.Course;
import com.example.onlinelearningportal.entity.Enrollment;
import com.example.onlinelearningportal.entity.Role;
import com.example.onlinelearningportal.entity.User;
import com.example.onlinelearningportal.repository.CourseRepository;
import com.example.onlinelearningportal.repository.EnrollmentRepository;
import com.example.onlinelearningportal.repository.QuizAttemptRepository;
import com.example.onlinelearningportal.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RuleBasedRecommendationEngineTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private QuizAttemptRepository quizAttemptRepository;

    private RuleBasedRecommendationEngine engine;

    @BeforeEach
    void setUp() {
        engine = new RuleBasedRecommendationEngine(
                userRepository,
                courseRepository,
                enrollmentRepository,
                quizAttemptRepository
        );
    }

    @Test
    @DisplayName("Should recommend relevant courses matching student interests and exclude enrolled courses")
    void testRecommendationMatchingInterests() {
        User user = new User("dev@example.com", "pass", "Dev", Role.STUDENT, "Java, Spring Boot");
        user.setId(1L);

        Course c1 = new Course("Spring Boot Mastery", "Build APIs", "", "Backend", "Intermediate", "Sarah", "", "", true);
        c1.setId(101L);

        Course c2 = new Course("Advanced Python for AI", "Machine learning", "", "AI & Data", "Advanced", "John", "", "", true);
        c2.setId(102L);

        Course enrolledCourse = new Course("Java 101", "Intro", "", "Backend", "Beginner", "Sarah", "", "", true);
        enrolledCourse.setId(103L);

        Enrollment enrollment = new Enrollment(user, enrolledCourse);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(courseRepository.findByPublishedTrue()).thenReturn(List.of(c1, c2, enrolledCourse));
        when(enrollmentRepository.findByUserIdOrderByEnrolledAtDesc(1L)).thenReturn(List.of(enrollment));
        when(quizAttemptRepository.getAverageScoreByUserId(1L)).thenReturn(85.0);

        List<RecommendationResponse> recommendations = engine.getRecommendationsForUser(1L);

        assertNotNull(recommendations);
        assertEquals(2, recommendations.size());

        // Enrolled course c3 (103) must NOT be in recommendations
        assertTrue(recommendations.stream().noneMatch(r -> r.getCourseId().equals(103L)));

        // Top recommendation should be Spring Boot Mastery because it matches user's Java/Spring interest
        assertEquals(101L, recommendations.get(0).getCourseId());
        assertTrue(recommendations.get(0).getExplanation().contains("interest"));
        assertTrue(recommendations.get(0).getScore() > recommendations.get(1).getScore());
    }

    @Test
    @DisplayName("Should provide default foundational recommendations for new users with no history")
    void testRecommendationsForNewUser() {
        User user = new User("new@example.com", "pass", "Newbie", Role.STUDENT, "");
        user.setId(2L);

        Course c1 = new Course("Web Dev Fundamentals", "Learn HTML & CSS", "", "Frontend", "Beginner", "Alex", "", "", true);
        c1.setId(201L);

        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        when(courseRepository.findByPublishedTrue()).thenReturn(List.of(c1));
        when(enrollmentRepository.findByUserIdOrderByEnrolledAtDesc(2L)).thenReturn(Collections.emptyList());
        when(quizAttemptRepository.getAverageScoreByUserId(2L)).thenReturn(null);

        List<RecommendationResponse> recommendations = engine.getRecommendationsForUser(2L);

        assertNotNull(recommendations);
        assertEquals(1, recommendations.size());
        assertEquals(201L, recommendations.get(0).getCourseId());
        assertFalse(recommendations.get(0).getExplanation().isBlank());
    }
}
