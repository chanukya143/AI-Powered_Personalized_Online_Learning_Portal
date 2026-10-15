package com.example.onlinelearningportal.dto;

import com.example.onlinelearningportal.entity.QuizAttempt;

import java.time.Instant;

public class QuizAttemptSummaryResponse {

    private Long id;
    private Long quizId;
    private String quizTitle;
    private Integer score;
    private boolean passed;
    private Instant attemptedAt;

    public QuizAttemptSummaryResponse() {
    }

    public QuizAttemptSummaryResponse(Long id, Long quizId, String quizTitle, Integer score, boolean passed, Instant attemptedAt) {
        this.id = id;
        this.quizId = quizId;
        this.quizTitle = quizTitle;
        this.score = score;
        this.passed = passed;
        this.attemptedAt = attemptedAt;
    }

    public static QuizAttemptSummaryResponse fromEntity(QuizAttempt attempt) {
        return new QuizAttemptSummaryResponse(
                attempt.getId(),
                attempt.getQuiz().getId(),
                attempt.getQuiz().getTitle(),
                attempt.getScore(),
                attempt.isPassed(),
                attempt.getAttemptedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public Instant getAttemptedAt() {
        return attemptedAt;
    }

    public void setAttemptedAt(Instant attemptedAt) {
        this.attemptedAt = attemptedAt;
    }
}
