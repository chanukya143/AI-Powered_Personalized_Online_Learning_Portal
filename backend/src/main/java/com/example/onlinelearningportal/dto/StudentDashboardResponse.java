package com.example.onlinelearningportal.dto;

import java.util.List;

public class StudentDashboardResponse {

    private String welcomeMessage;
    private long totalEnrolledCourses;
    private long inProgressCourses;
    private long completedCourses;
    private double averageQuizScore;
    private int learningStreakDays;
    private EnrollmentResponse continueLearningCourse;
    private List<EnrollmentResponse> enrolledCourses;
    private List<QuizAttemptSummaryResponse> recentQuizAttempts;
    private List<RecommendationResponse> recommendations;

    public StudentDashboardResponse() {
    }

    public StudentDashboardResponse(String welcomeMessage, long totalEnrolledCourses,
                                    long inProgressCourses, long completedCourses,
                                    double averageQuizScore, int learningStreakDays,
                                    EnrollmentResponse continueLearningCourse,
                                    List<EnrollmentResponse> enrolledCourses,
                                    List<QuizAttemptSummaryResponse> recentQuizAttempts,
                                    List<RecommendationResponse> recommendations) {
        this.welcomeMessage = welcomeMessage;
        this.totalEnrolledCourses = totalEnrolledCourses;
        this.inProgressCourses = inProgressCourses;
        this.completedCourses = completedCourses;
        this.averageQuizScore = averageQuizScore;
        this.learningStreakDays = learningStreakDays;
        this.continueLearningCourse = continueLearningCourse;
        this.enrolledCourses = enrolledCourses;
        this.recentQuizAttempts = recentQuizAttempts;
        this.recommendations = recommendations;
    }

    public String getWelcomeMessage() {
        return welcomeMessage;
    }

    public void setWelcomeMessage(String welcomeMessage) {
        this.welcomeMessage = welcomeMessage;
    }

    public long getTotalEnrolledCourses() {
        return totalEnrolledCourses;
    }

    public void setTotalEnrolledCourses(long totalEnrolledCourses) {
        this.totalEnrolledCourses = totalEnrolledCourses;
    }

    public long getInProgressCourses() {
        return inProgressCourses;
    }

    public void setInProgressCourses(long inProgressCourses) {
        this.inProgressCourses = inProgressCourses;
    }

    public long getCompletedCourses() {
        return completedCourses;
    }

    public void setCompletedCourses(long completedCourses) {
        this.completedCourses = completedCourses;
    }

    public double getAverageQuizScore() {
        return averageQuizScore;
    }

    public void setAverageQuizScore(double averageQuizScore) {
        this.averageQuizScore = averageQuizScore;
    }

    public int getLearningStreakDays() {
        return learningStreakDays;
    }

    public void setLearningStreakDays(int learningStreakDays) {
        this.learningStreakDays = learningStreakDays;
    }

    public EnrollmentResponse getContinueLearningCourse() {
        return continueLearningCourse;
    }

    public void setContinueLearningCourse(EnrollmentResponse continueLearningCourse) {
        this.continueLearningCourse = continueLearningCourse;
    }

    public List<EnrollmentResponse> getEnrolledCourses() {
        return enrolledCourses;
    }

    public void setEnrolledCourses(List<EnrollmentResponse> enrolledCourses) {
        this.enrolledCourses = enrolledCourses;
    }

    public List<QuizAttemptSummaryResponse> getRecentQuizAttempts() {
        return recentQuizAttempts;
    }

    public void setRecentQuizAttempts(List<QuizAttemptSummaryResponse> recentQuizAttempts) {
        this.recentQuizAttempts = recentQuizAttempts;
    }

    public List<RecommendationResponse> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<RecommendationResponse> recommendations) {
        this.recommendations = recommendations;
    }
}
