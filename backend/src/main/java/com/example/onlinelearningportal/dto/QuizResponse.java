package com.example.onlinelearningportal.dto;

import com.example.onlinelearningportal.entity.Quiz;

public class QuizResponse {

    private Long id;
    private Long courseId;
    private String courseTitle;
    private String title;
    private String description;
    private Integer passingScore;
    private int questionsCount;

    public QuizResponse() {
    }

    public QuizResponse(Long id, Long courseId, String courseTitle, String title, String description,
                        Integer passingScore, int questionsCount) {
        this.id = id;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.title = title;
        this.description = description;
        this.passingScore = passingScore;
        this.questionsCount = questionsCount;
    }

    public static QuizResponse fromEntity(Quiz quiz) {
        return new QuizResponse(
                quiz.getId(),
                quiz.getCourse().getId(),
                quiz.getCourse().getTitle(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getPassingScore(),
                quiz.getQuestions() != null ? quiz.getQuestions().size() : 0
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
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

    public int getQuestionsCount() {
        return questionsCount;
    }

    public void setQuestionsCount(int questionsCount) {
        this.questionsCount = questionsCount;
    }
}
