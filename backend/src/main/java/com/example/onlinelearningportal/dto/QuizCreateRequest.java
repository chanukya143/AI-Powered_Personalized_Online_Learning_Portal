package com.example.onlinelearningportal.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class QuizCreateRequest {

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotBlank(message = "Quiz title is required")
    @Size(min = 3, max = 255)
    private String title;

    private String description;

    private Integer passingScore = 70;

    @NotEmpty(message = "Quiz must contain at least one question")
    @Valid
    private List<QuestionRequest> questions;

    public QuizCreateRequest() {
    }

    public QuizCreateRequest(Long courseId, String title, String description, Integer passingScore,
                             List<QuestionRequest> questions) {
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.passingScore = passingScore;
        this.questions = questions;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPassingScore() {
        return passingScore;
    }

    public void setPassingScore(Integer passingScore) {
        this.passingScore = passingScore;
    }

    public List<QuestionRequest> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionRequest> questions) {
        this.questions = questions;
    }
}
