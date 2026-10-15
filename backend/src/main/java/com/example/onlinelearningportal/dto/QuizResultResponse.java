package com.example.onlinelearningportal.dto;

import java.time.Instant;
import java.util.List;

public class QuizResultResponse {

    private Long attemptId;
    private Long quizId;
    private String quizTitle;
    private Integer score;
    private boolean passed;
    private Integer passingScore;
    private int totalQuestions;
    private int correctAnswersCount;
    private List<QuestionResultDto> questionResults;
    private Instant attemptedAt;

    public QuizResultResponse() {
    }

    public QuizResultResponse(Long attemptId, Long quizId, String quizTitle, Integer score,
                              boolean passed, Integer passingScore, int totalQuestions,
                              int correctAnswersCount, List<QuestionResultDto> questionResults,
                              Instant attemptedAt) {
        this.attemptId = attemptId;
        this.quizId = quizId;
        this.quizTitle = quizTitle;
        this.score = score;
        this.passed = passed;
        this.passingScore = passingScore;
        this.totalQuestions = totalQuestions;
        this.correctAnswersCount = correctAnswersCount;
        this.questionResults = questionResults;
        this.attemptedAt = attemptedAt;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
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

    public Integer getPassingScore() {
        return passingScore;
    }

    public void setPassingScore(Integer passingScore) {
        this.passingScore = passingScore;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getCorrectAnswersCount() {
        return correctAnswersCount;
    }

    public void setCorrectAnswersCount(int correctAnswersCount) {
        this.correctAnswersCount = correctAnswersCount;
    }

    public List<QuestionResultDto> getQuestionResults() {
        return questionResults;
    }

    public void setQuestionResults(List<QuestionResultDto> questionResults) {
        this.questionResults = questionResults;
    }

    public Instant getAttemptedAt() {
        return attemptedAt;
    }

    public void setAttemptedAt(Instant attemptedAt) {
        this.attemptedAt = attemptedAt;
    }

    public static class QuestionResultDto {
        private Long questionId;
        private String questionText;
        private List<String> options;
        private Integer selectedOptionIndex;
        private Integer correctAnswerIndex;
        private boolean correct;
        private String explanation;

        public QuestionResultDto() {
        }

        public QuestionResultDto(Long questionId, String questionText, List<String> options,
                                 Integer selectedOptionIndex, Integer correctAnswerIndex,
                                 boolean correct, String explanation) {
            this.questionId = questionId;
            this.questionText = questionText;
            this.options = options;
            this.selectedOptionIndex = selectedOptionIndex;
            this.correctAnswerIndex = correctAnswerIndex;
            this.correct = correct;
            this.explanation = explanation;
        }

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public String getQuestionText() {
            return questionText;
        }

        public void setQuestionText(String questionText) {
            this.questionText = questionText;
        }

        public List<String> getOptions() {
            return options;
        }

        public void setOptions(List<String> options) {
            this.options = options;
        }

        public Integer getSelectedOptionIndex() {
            return selectedOptionIndex;
        }

        public void setSelectedOptionIndex(Integer selectedOptionIndex) {
            this.selectedOptionIndex = selectedOptionIndex;
        }

        public Integer getCorrectAnswerIndex() {
            return correctAnswerIndex;
        }

        public void setCorrectAnswerIndex(Integer correctAnswerIndex) {
            this.correctAnswerIndex = correctAnswerIndex;
        }

        public boolean isCorrect() {
            return correct;
        }

        public void setCorrect(boolean correct) {
            this.correct = correct;
        }

        public String getExplanation() {
            return explanation;
        }

        public void setExplanation(String explanation) {
            this.explanation = explanation;
        }
    }
}
