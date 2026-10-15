package com.example.onlinelearningportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @NotBlank(message = "Full name cannot be blank")
    @Size(min = 2, max = 150)
    private String fullName;

    private String learningInterests;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String fullName, String learningInterests) {
        this.fullName = fullName;
        this.learningInterests = learningInterests;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getLearningInterests() {
        return learningInterests;
    }

    public void setLearningInterests(String learningInterests) {
        this.learningInterests = learningInterests;
    }
}
