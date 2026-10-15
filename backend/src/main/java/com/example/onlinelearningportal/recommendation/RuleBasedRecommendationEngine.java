package com.example.onlinelearningportal.recommendation;

import com.example.onlinelearningportal.dto.RecommendationResponse;
import com.example.onlinelearningportal.entity.Course;
import com.example.onlinelearningportal.entity.Enrollment;
import com.example.onlinelearningportal.entity.User;
import com.example.onlinelearningportal.repository.CourseRepository;
import com.example.onlinelearningportal.repository.EnrollmentRepository;
import com.example.onlinelearningportal.repository.QuizAttemptRepository;
import com.example.onlinelearningportal.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RuleBasedRecommendationEngine implements RecommendationService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public RuleBasedRecommendationEngine(UserRepository userRepository,
                                         CourseRepository courseRepository,
                                         EnrollmentRepository enrollmentRepository,
                                         QuizAttemptRepository quizAttemptRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.quizAttemptRepository = quizAttemptRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecommendationResponse> getRecommendationsForUser(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return Collections.emptyList();
        }

        List<Course> allPublishedCourses = courseRepository.findByPublishedTrue();
        List<Enrollment> enrollments = enrollmentRepository.findByUserIdOrderByEnrolledAtDesc(userId);

        // Exclude courses in which the student is already enrolled
        Set<Long> enrolledCourseIds = enrollments.stream()
                .map(e -> e.getCourse().getId())
                .collect(Collectors.toSet());

        List<Course> candidateCourses = allPublishedCourses.stream()
                .filter(c -> !enrolledCourseIds.contains(c.getId()))
                .toList();

        if (candidateCourses.isEmpty()) {
            return Collections.emptyList();
        }

        // Student learning profile
        Set<String> interests = parseInterests(user.getLearningInterests());
        Set<String> completedCategories = enrollments.stream()
                .filter(Enrollment::isCompleted)
                .map(e -> e.getCourse().getCategory().toLowerCase())
                .collect(Collectors.toSet());

        Double avgQuizScore = quizAttemptRepository.getAverageScoreByUserId(userId);
        boolean highScorer = avgQuizScore != null && avgQuizScore >= 80.0;

        List<ScoredCourse> scoredList = new ArrayList<>();

        for (Course course : candidateCourses) {
            int score = 40; // baseline foundation score
            List<String> reasons = new ArrayList<>();

            String category = course.getCategory().toLowerCase();
            String title = course.getTitle().toLowerCase();
            String diff = course.getDifficultyLevel().toLowerCase();

            // 1. Check interest match
            String matchedInterest = null;
            for (String interest : interests) {
                if (category.contains(interest) || title.contains(interest) ||
                    (course.getShortDescription() != null && course.getShortDescription().toLowerCase().contains(interest))) {
                    matchedInterest = interest;
                    score += 35;
                    break;
                }
            }
            if (matchedInterest != null) {
                reasons.add("matches your interest in '" + capitalize(matchedInterest) + "'");
            }

            // 2. Check completed category progression
            if (completedCategories.contains(category)) {
                score += 25;
                reasons.add("builds on your completed studies in " + course.getCategory());
            }

            // 3. Difficulty alignment based on quiz performance
            if (highScorer && (diff.contains("intermediate") || diff.contains("advanced"))) {
                score += 15;
                reasons.add("aligns with your strong quiz performance of " + Math.round(avgQuizScore) + "%");
            } else if (diff.contains("beginner") && enrollments.isEmpty()) {
                score += 20;
                reasons.add("provides an ideal foundational starting point");
            }

            // 4. Construct human-readable explanation
            String explanation;
            if (!reasons.isEmpty()) {
                explanation = "Recommended because it " + String.join(" and ", reasons) + ".";
            } else {
                explanation = "Recommended as a high-rated, essential course in " + course.getCategory() + ".";
            }

            // Cap match score at 99
            int finalScore = Math.min(99, score);
            scoredList.add(new ScoredCourse(course, finalScore, explanation));
        }

        // Sort descending by calculated score and return top recommendations
        scoredList.sort((a, b) -> Integer.compare(b.score, a.score));

        return scoredList.stream()
                .limit(4)
                .map(sc -> new RecommendationResponse(
                        sc.course.getId(),
                        sc.course.getTitle(),
                        sc.course.getShortDescription(),
                        sc.course.getCategory(),
                        sc.course.getDifficultyLevel(),
                        sc.course.getThumbnailUrl(),
                        sc.course.getInstructorName(),
                        sc.course.getEstimatedDuration(),
                        sc.explanation,
                        sc.score
                ))
                .toList();
    }

    private Set<String> parseInterests(String interestsStr) {
        if (interestsStr == null || interestsStr.isBlank()) {
            return Collections.emptySet();
        }
        return Arrays.stream(interestsStr.split("[,;\\s]+"))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty() && s.length() > 1)
                .collect(Collectors.toSet());
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return str;
        return Character.toUpperCase(str.charAt(0)) + str.substring(1);
    }

    private static class ScoredCourse {
        final Course course;
        final int score;
        final String explanation;

        ScoredCourse(Course course, int score, String explanation) {
            this.course = course;
            this.score = score;
            this.explanation = explanation;
        }
    }
}
