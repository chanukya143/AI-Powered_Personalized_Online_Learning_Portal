package com.example.onlinelearningportal.dto;

import com.example.onlinelearningportal.entity.Course;

import java.time.Instant;

public class CourseResponse {

    private Long id;
    private String title;
    private String shortDescription;
    private String category;
    private String difficultyLevel;
    private String instructorName;
    private String thumbnailUrl;
    private String estimatedDuration;
    private boolean published;
    private int lessonsCount;
    private Long quizId;
    private Instant createdAt;

    public CourseResponse() {
    }

    public CourseResponse(Long id, String title, String shortDescription, String category,
                          String difficultyLevel, String instructorName, String thumbnailUrl,
                          String estimatedDuration, boolean published, int lessonsCount,
                          Long quizId, Instant createdAt) {
        this.id = id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.category = category;
        this.difficultyLevel = difficultyLevel;
        this.instructorName = instructorName;
        this.thumbnailUrl = thumbnailUrl;
        this.estimatedDuration = estimatedDuration;
        this.published = published;
        this.lessonsCount = lessonsCount;
        this.quizId = quizId;
        this.createdAt = createdAt;
    }

    public static CourseResponse fromEntity(Course course, int lessonsCount, Long quizId) {
        return new CourseResponse(
                course.getId(),
                course.getTitle(),
                course.getShortDescription(),
                course.getCategory(),
                course.getDifficultyLevel(),
                course.getInstructorName(),
                course.getThumbnailUrl(),
                course.getEstimatedDuration(),
                course.isPublished(),
                lessonsCount,
                quizId,
                course.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public int getLessonsCount() {
        return lessonsCount;
    }

    public void setLessonsCount(int lessonsCount) {
        this.lessonsCount = lessonsCount;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
