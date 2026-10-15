package com.example.onlinelearningportal.dto;

public class ProgressSummaryResponse {

    private Long courseId;
    private int totalLessons;
    private int completedLessons;
    private int progressPercentage;
    private boolean courseCompleted;

    public ProgressSummaryResponse() {
    }

    public ProgressSummaryResponse(Long courseId, int totalLessons, int completedLessons,
                                   int progressPercentage, boolean courseCompleted) {
        this.courseId = courseId;
        this.totalLessons = totalLessons;
        this.completedLessons = completedLessons;
        this.progressPercentage = progressPercentage;
        this.courseCompleted = courseCompleted;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
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

    public boolean isCourseCompleted() {
        return courseCompleted;
    }

    public void setCourseCompleted(boolean courseCompleted) {
        this.courseCompleted = courseCompleted;
    }
}
