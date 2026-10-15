package com.example.onlinelearningportal.dto;

import com.example.onlinelearningportal.entity.Role;

import java.time.Instant;

public class UserManagementDto {

    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private String learningInterests;
    private long enrolledCoursesCount;
    private Instant createdAt;

    public UserManagementDto() {
    }

    public UserManagementDto(Long id, String email, String fullName, Role role,
                             String learningInterests, long enrolledCoursesCount, Instant createdAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.learningInterests = learningInterests;
        this.enrolledCoursesCount = enrolledCoursesCount;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getLearningInterests() {
        return learningInterests;
    }

    public void setLearningInterests(String learningInterests) {
        this.learningInterests = learningInterests;
    }

    public long getEnrolledCoursesCount() {
        return enrolledCoursesCount;
    }

    public void setEnrolledCoursesCount(long enrolledCoursesCount) {
        this.enrolledCoursesCount = enrolledCoursesCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
