package com.example.onlinelearningportal.dto;

public class RecommendationResponse {

    private Long courseId;
    private String title;
    private String shortDescription;
    private String category;
    private String difficultyLevel;
    private String thumbnailUrl;
    private String instructorName;
    private String estimatedDuration;
    private String explanation;
    private int score; // match score (0-100)

    public RecommendationResponse() {
    }

    public RecommendationResponse(Long courseId, String title, String shortDescription, String category,
                                  String difficultyLevel, String thumbnailUrl, String instructorName,
                                  String estimatedDuration, String explanation, int score) {
        this.courseId = courseId;
        this.title = title;
        this.shortDescription = shortDescription;
        this.category = category;
        this.difficultyLevel = difficultyLevel;
        this.thumbnailUrl = thumbnailUrl;
        this.instructorName = instructorName;
        this.estimatedDuration = estimatedDuration;
        this.explanation = explanation;
        this.score = score;
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

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public String getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
