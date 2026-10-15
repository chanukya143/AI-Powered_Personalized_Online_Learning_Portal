package com.example.onlinelearningportal.service;

import com.example.onlinelearningportal.dto.QuizResultResponse;
import com.example.onlinelearningportal.dto.QuizSubmissionRequest;
import com.example.onlinelearningportal.entity.*;
import com.example.onlinelearningportal.exception.ForbiddenException;
import com.example.onlinelearningportal.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private QuizAttemptRepository quizAttemptRepository;

    @Mock
    private StudentAnswerRepository studentAnswerRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    private QuizService quizService;

    @BeforeEach
    void setUp() {
        quizService = new QuizService(
                quizRepository,
                questionRepository,
                quizAttemptRepository,
                studentAnswerRepository,
                courseRepository,
                userRepository,
                enrollmentRepository
        );
    }

    @Test
    @DisplayName("Should correctly evaluate submitted quiz answers and calculate passing score")
    void testSubmitQuizPass() {
        Course course = new Course("Java 101", "", "", "Backend", "Beginner", "", "", "", true);
        course.setId(1L);

        Quiz quiz = new Quiz(course, "Midterm Quiz", "Test", 70);
        quiz.setId(10L);

        User user = new User("student@example.com", "pass", "Student", Role.STUDENT, "");
        user.setId(5L);

        Question q1 = new Question(quiz, "What is 2+2?", "[\"3\",\"4\",\"5\"]", 1, "Explanation 1", 1);
        q1.setId(101L);

        Question q2 = new Question(quiz, "Java is object-oriented?", "[\"Yes\",\"No\"]", 0, "Explanation 2", 2);
        q2.setId(102L);

        when(quizRepository.findById(10L)).thenReturn(Optional.of(quiz));
        when(userRepository.findById(5L)).thenReturn(Optional.of(user));
        when(enrollmentRepository.existsByUserIdAndCourseId(5L, 1L)).thenReturn(true);
        when(questionRepository.findByQuizIdOrderByQuestionOrderAsc(10L)).thenReturn(List.of(q1, q2));

        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenAnswer(i -> {
            QuizAttempt qa = i.getArgument(0);
            qa.setId(99L);
            return qa;
        });

        // Submit both correct answers (q1 -> 1, q2 -> 0)
        QuizSubmissionRequest submission = new QuizSubmissionRequest(Map.of(101L, 1, 102L, 0));

        QuizResultResponse result = quizService.submitQuiz(10L, 5L, submission);

        assertNotNull(result);
        assertEquals(100, result.getScore());
        assertTrue(result.isPassed());
        assertEquals(2, result.getCorrectAnswersCount());
        assertEquals(2, result.getTotalQuestions());
        verify(quizAttemptRepository).save(any(QuizAttempt.class));
        verify(studentAnswerRepository, times(2)).save(any(StudentAnswer.class));
    }

    @Test
    @DisplayName("Should mark quiz as failed when score is below passing threshold")
    void testSubmitQuizFail() {
        Course course = new Course("Java 101", "", "", "Backend", "Beginner", "", "", "", true);
        course.setId(1L);

        Quiz quiz = new Quiz(course, "Midterm Quiz", "Test", 70);
        quiz.setId(10L);

        User user = new User("student@example.com", "pass", "Student", Role.STUDENT, "");
        user.setId(5L);

        Question q1 = new Question(quiz, "Q1", "[\"A\",\"B\"]", 0, "", 1);
        q1.setId(101L);
        Question q2 = new Question(quiz, "Q2", "[\"A\",\"B\"]", 0, "", 2);
        q2.setId(102L);

        when(quizRepository.findById(10L)).thenReturn(Optional.of(quiz));
        when(userRepository.findById(5L)).thenReturn(Optional.of(user));
        when(enrollmentRepository.existsByUserIdAndCourseId(5L, 1L)).thenReturn(true);
        when(questionRepository.findByQuizIdOrderByQuestionOrderAsc(10L)).thenReturn(List.of(q1, q2));

        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenAnswer(i -> {
            QuizAttempt qa = i.getArgument(0);
            qa.setId(100L);
            return qa;
        });

        // Submit 1 correct and 1 wrong answer (score: 50% vs passing 70%)
        QuizSubmissionRequest submission = new QuizSubmissionRequest(Map.of(101L, 0, 102L, 1));

        QuizResultResponse result = quizService.submitQuiz(10L, 5L, submission);

        assertNotNull(result);
        assertEquals(50, result.getScore());
        assertFalse(result.isPassed());
        assertEquals(1, result.getCorrectAnswersCount());
    }

    @Test
    @DisplayName("Should prevent non-enrolled students from taking the quiz")
    void testSubmitQuizNotEnrolled() {
        Course course = new Course("Java 101", "", "", "Backend", "Beginner", "", "", "", true);
        course.setId(1L);
        Quiz quiz = new Quiz(course, "Quiz", "Desc", 70);
        quiz.setId(10L);
        User user = new User("student@example.com", "pass", "Student", Role.STUDENT, "");
        user.setId(5L);

        when(quizRepository.findById(10L)).thenReturn(Optional.of(quiz));
        when(userRepository.findById(5L)).thenReturn(Optional.of(user));
        when(enrollmentRepository.existsByUserIdAndCourseId(5L, 1L)).thenReturn(false);

        QuizSubmissionRequest submission = new QuizSubmissionRequest(Map.of());

        assertThrows(ForbiddenException.class, () -> quizService.submitQuiz(10L, 5L, submission));
        verify(quizAttemptRepository, never()).save(any());
    }
}
