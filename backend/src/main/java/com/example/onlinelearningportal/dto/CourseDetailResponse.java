package com.example.onlinelearningportal.dto;

import java.time.Instant;
import java.util.List;

public class CourseDetailResponse {

    private Long id;
    private String title;
    private String shortDescription;
    private String fullDescription;
    private String category;
    private String difficultyLevel;
    private String instructorName;
    private String thumbnailUrl;
    private String estimatedDuration;
    private boolean published;
    private Instant createdAt;
    private List<LessonSummaryResponse> lessons;
    private Long quizId;
    private boolean enrolled;
    private boolean completed;
    private Integer progressPercentage;

    public CourseDetailResponse() {
    }

    public CourseDetailResponse(Long id, String title, String shortDescription, String fullDescription,
                                String category, String difficultyLevel, String instructorName,
                                String thumbnailUrl, String estimatedDuration, boolean published,
                                Instant createdAt, List<LessonSummaryResponse> lessons, Long quizId,
                                boolean enrolled, boolean completed, Integer progressPercentage) {
        this.id = id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.category = category;
        this.difficultyLevel = difficultyLevel;
        this.instructorName = instructorName;
        this.thumbnailUrl = thumbnailUrl;
        this.estimatedDuration = estimatedDuration;
        this.published = published;
        this.createdAt = createdAt;
        this.lessons = lessons;
        this.quizId = quizId;
        this.enrolled = enrolled;
        this.completed = completed;
        this.progressPercentage = progressPercentage;
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

    public String getFullDescription() {
        return fullDescription;
    }

    public void setFullDescription(String fullDescription) {
        this.fullDescription = fullDescription;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<LessonSummaryResponse> getLessons() {
        return lessons;
    }

    public void setLessons(List<LessonSummaryResponse> lessons) {
        this.lessons = lessons;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public boolean isEnrolled() {
        return enrolled;
    }

    public void setEnrolled(boolean enrolled) {
        this.enrolled = enrolled;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public Integer getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
    }
}
