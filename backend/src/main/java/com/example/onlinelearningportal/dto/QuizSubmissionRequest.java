package com.example.onlinelearningportal.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.Map;

public class QuizSubmissionRequest {

    @NotEmpty(message = "Answers map cannot be empty")
    private Map<Long, Integer> answers; // questionId -> selectedOptionIndex

    public QuizSubmissionRequest() {
    }

    public QuizSubmissionRequest(Map<Long, Integer> answers) {
        this.answers = answers;
    }

    public Map<Long, Integer> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, Integer> answers) {
        this.answers = answers;
    }
}
