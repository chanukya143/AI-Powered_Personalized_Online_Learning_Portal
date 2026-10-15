package com.example.onlinelearningportal.service;

import com.example.onlinelearningportal.dto.*;
import com.example.onlinelearningportal.entity.*;
import com.example.onlinelearningportal.exception.BadRequestException;
import com.example.onlinelearningportal.exception.ForbiddenException;
import com.example.onlinelearningportal.exception.ResourceNotFoundException;
import com.example.onlinelearningportal.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public QuizService(QuizRepository quizRepository,
                       QuestionRepository questionRepository,
                       QuizAttemptRepository quizAttemptRepository,
                       StudentAnswerRepository studentAnswerRepository,
                       CourseRepository courseRepository,
                       UserRepository userRepository,
                       EnrollmentRepository enrollmentRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.studentAnswerRepository = studentAnswerRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    /**
     * Student view: Fetches quiz details WITHOUT exposing correct answers.
     */
    @Transactional(readOnly = true)
    public QuizDetailResponse getQuizForStudent(Long quizId, Long userId, boolean isAdmin) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));

        if (!isAdmin && userId != null) {
            boolean enrolled = enrollmentRepository.existsByUserIdAndCourseId(userId, quiz.getCourse().getId());
            if (!enrolled) {
                throw new ForbiddenException("You must be enrolled in the course to access its quiz.");
            }
        }

        List<Question> questions = questionRepository.findByQuizIdOrderByQuestionOrderAsc(quizId);
        List<QuestionDetailResponse> questionResponses = questions.stream().map(q -> {
            List<String> options = parseOptions(q.getOptionsJson());
            return new QuestionDetailResponse(q.getId(), q.getQuestionText(), options, q.getQuestionOrder());
        }).toList();

        QuizAttemptSummaryResponse lastAttempt = null;
        if (userId != null) {
            Optional<QuizAttempt> attemptOpt = quizAttemptRepository.findFirstByUserIdAndQuizIdOrderByScoreDesc(userId, quizId);
            lastAttempt = attemptOpt.map(QuizAttemptSummaryResponse::fromEntity).orElse(null);
        }

        return new QuizDetailResponse(
                quiz.getId(),
                quiz.getCourse().getId(),
                quiz.getCourse().getTitle(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getPassingScore(),
                questionResponses,
                lastAttempt
        );
    }

    /**
     * Admin view: Fetches quiz details WITH full answer keys and explanations.
     */
    @Transactional(readOnly = true)
    public QuizAdminDetailResponse getQuizForAdmin(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));

        List<Question> questions = questionRepository.findByQuizIdOrderByQuestionOrderAsc(quizId);
        List<QuestionRequest> questionRequests = questions.stream().map(q -> new QuestionRequest(
                q.getId(),
                q.getQuestionText(),
                parseOptions(q.getOptionsJson()),
                q.getCorrectAnswerIndex(),
                q.getExplanation(),
                q.getQuestionOrder()
        )).toList();

        return new QuizAdminDetailResponse(
                quiz.getId(),
                quiz.getCourse().getId(),
                quiz.getCourse().getTitle(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getPassingScore(),
                questionRequests
        );
    }

    /**
     * Submit quiz answers and score server-side against protected answer keys.
     */
    @Transactional
    public QuizResultResponse submitQuiz(Long quizId, Long userId, QuizSubmissionRequest submission) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Enforce enrollment check
        if (!enrollmentRepository.existsByUserIdAndCourseId(userId, quiz.getCourse().getId())) {
            throw new ForbiddenException("You must be enrolled in this course to take the quiz.");
        }

        List<Question> questions = questionRepository.findByQuizIdOrderByQuestionOrderAsc(quizId);
        if (questions.isEmpty()) {
            throw new BadRequestException("Quiz contains no questions to evaluate.");
        }

        Map<Long, Integer> answers = submission.getAnswers() != null ? submission.getAnswers() : Collections.emptyMap();
        int correctCount = 0;
        List<QuizResultResponse.QuestionResultDto> resultItems = new ArrayList<>();

        for (Question question : questions) {
            Integer selectedOption = answers.get(question.getId());
            boolean isCorrect = selectedOption != null && selectedOption.equals(question.getCorrectAnswerIndex());
            if (isCorrect) {
                correctCount++;
            }

            resultItems.add(new QuizResultResponse.QuestionResultDto(
                    question.getId(),
                    question.getQuestionText(),
                    parseOptions(question.getOptionsJson()),
                    selectedOption,
                    question.getCorrectAnswerIndex(), // Revealing answer key ONLY AFTER submission in the results
                    isCorrect,
                    question.getExplanation()
            ));
        }

        int scorePercentage = (int) Math.round(((double) correctCount / questions.size()) * 100);
        boolean passed = scorePercentage >= quiz.getPassingScore();

        QuizAttempt attempt = new QuizAttempt(quiz, user, scorePercentage, passed);
        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

        // Save individual student answers
        for (Question question : questions) {
            Integer selectedOption = answers.getOrDefault(question.getId(), -1);
            boolean isCorrect = selectedOption.equals(question.getCorrectAnswerIndex());
            StudentAnswer answer = new StudentAnswer(savedAttempt, question, selectedOption, isCorrect);
            studentAnswerRepository.save(answer);
        }

        return new QuizResultResponse(
                savedAttempt.getId(),
                quiz.getId(),
                quiz.getTitle(),
                scorePercentage,
                passed,
                quiz.getPassingScore(),
                questions.size(),
                correctCount,
                resultItems,
                savedAttempt.getAttemptedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<QuizAttemptSummaryResponse> getMyAttempts(Long userId) {
        return quizAttemptRepository.findByUserIdOrderByAttemptedAtDesc(userId)
                .stream()
                .map(QuizAttemptSummaryResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<QuizResponse> getQuizzesByCourseId(Long courseId) {
        return quizRepository.findByCourseId(courseId)
                .stream()
                .map(QuizResponse::fromEntity)
                .toList();
    }

    // --- Admin Operations ---

    @Transactional
    public QuizResponse createQuiz(QuizCreateRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));

        Quiz quiz = new Quiz(
                course,
                request.getTitle().trim(),
                request.getDescription() != null ? request.getDescription().trim() : "",
                request.getPassingScore() != null ? request.getPassingScore() : 70
        );

        Quiz savedQuiz = quizRepository.save(quiz);

        int order = 1;
        for (QuestionRequest qr : request.getQuestions()) {
            Question question = new Question(
                    savedQuiz,
                    qr.getQuestionText().trim(),
                    serializeOptions(qr.getOptions()),
                    qr.getCorrectAnswerIndex(),
                    qr.getExplanation() != null ? qr.getExplanation().trim() : "",
                    qr.getQuestionOrder() != null ? qr.getQuestionOrder() : order++
            );
            questionRepository.save(question);
        }

        return QuizResponse.fromEntity(savedQuiz);
    }

    @Transactional
    public QuizResponse updateQuiz(Long quizId, QuizCreateRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));

        quiz.setTitle(request.getTitle().trim());
        quiz.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        if (request.getPassingScore() != null) {
            quiz.setPassingScore(request.getPassingScore());
        }

        // Replace questions
        List<Question> existingQuestions = questionRepository.findByQuizIdOrderByQuestionOrderAsc(quizId);
        questionRepository.deleteAll(existingQuestions);
        questionRepository.flush();

        int order = 1;
        for (QuestionRequest qr : request.getQuestions()) {
            Question question = new Question(
                    quiz,
                    qr.getQuestionText().trim(),
                    serializeOptions(qr.getOptions()),
                    qr.getCorrectAnswerIndex(),
                    qr.getExplanation() != null ? qr.getExplanation().trim() : "",
                    qr.getQuestionOrder() != null ? qr.getQuestionOrder() : order++
            );
            questionRepository.save(question);
        }

        Quiz updatedQuiz = quizRepository.save(quiz);
        return QuizResponse.fromEntity(updatedQuiz);
    }

    @Transactional
    public void deleteQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        quizRepository.delete(quiz);
    }

    private List<String> parseOptions(String optionsJson) {
        try {
            return objectMapper.readValue(optionsJson, new TypeReference<List<String>>() {});
        } catch (Exception ex) {
            return Collections.emptyList();
        }
    }

    private String serializeOptions(List<String> options) {
        try {
            return objectMapper.writeValueAsString(options != null ? options : Collections.emptyList());
        } catch (Exception ex) {
            return "[]";
        }
    }
}
