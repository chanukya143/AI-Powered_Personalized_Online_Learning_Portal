package com.example.onlinelearningportal.dto;

import java.time.Instant;

public class EnrollmentResponse {

    private Long id;
    private Long courseId;
    private String courseTitle;
    private String category;
    private String difficultyLevel;
    private String thumbnailUrl;
    private Instant enrolledAt;
    private boolean completed;
    private Instant completedAt;
    private int totalLessons;
    private int completedLessons;
    private int progressPercentage;

    public EnrollmentResponse() {
    }

    public EnrollmentResponse(Long id, Long courseId, String courseTitle, String category,
                              String difficultyLevel, String thumbnailUrl, Instant enrolledAt,
                              boolean completed, Instant completedAt, int totalLessons,
                              int completedLessons, int progressPercentage) {
        this.id = id;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.category = category;
        this.difficultyLevel = difficultyLevel;
        this.thumbnailUrl = thumbnailUrl;
        this.enrolledAt = enrolledAt;
        this.completed = completed;
        this.completedAt = completedAt;
        this.totalLessons = totalLessons;
        this.completedLessons = completedLessons;
        this.progressPercentage = progressPercentage;
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

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public Instant getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(Instant enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }

    public int getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(int totalLessons) {
        this.totalLessons = totalLessons;
    }

    public int getCompletedLessons() {
        return completedLessons;
    }

    public void setCompletedLessons(int completedLessons) {
        this.completedLessons = completedLessons;
    }

    public int getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(int progressPercentage) {
        this.progressPercentage = progressPercentage;
    }
}
