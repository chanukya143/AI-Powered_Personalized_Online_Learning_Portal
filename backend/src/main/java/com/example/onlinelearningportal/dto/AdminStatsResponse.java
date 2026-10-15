package com.example.onlinelearningportal.dto;

import java.util.List;

public class AdminStatsResponse {

    private long totalStudents;
    private long totalCourses;
    private long totalPublishedCourses;
    private long totalEnrollments;
    private long totalCompletions;
    private double averageQuizScore;
    private List<EnrollmentResponse> recentEnrollments;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long totalStudents, long totalCourses, long totalPublishedCourses,
                              long totalEnrollments, long totalCompletions, double averageQuizScore,
                              List<EnrollmentResponse> recentEnrollments) {
        this.totalStudents = totalStudents;
        this.totalCourses = totalCourses;
        this.totalPublishedCourses = totalPublishedCourses;
        this.totalEnrollments = totalEnrollments;
        this.totalCompletions = totalCompletions;
        this.averageQuizScore = averageQuizScore;
        this.recentEnrollments = recentEnrollments;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public long getTotalPublishedCourses() {
        return totalPublishedCourses;
    }

    public void setTotalPublishedCourses(long totalPublishedCourses) {
        this.totalPublishedCourses = totalPublishedCourses;
    }

    public long getTotalEnrollments() {
        return totalEnrollments;
    }

    public void setTotalEnrollments(long totalEnrollments) {
        this.totalEnrollments = totalEnrollments;
    }

    public long getTotalCompletions() {
        return totalCompletions;
    }

    public void setTotalCompletions(long totalCompletions) {
        this.totalCompletions = totalCompletions;
    }

    public double getAverageQuizScore() {
        return averageQuizScore;
    }

    public void setAverageQuizScore(double averageQuizScore) {
        this.averageQuizScore = averageQuizScore;
    }

    public List<EnrollmentResponse> getRecentEnrollments() {
        return recentEnrollments;
    }

    public void setRecentEnrollments(List<EnrollmentResponse> recentEnrollments) {
        this.recentEnrollments = recentEnrollments;
    }
}
