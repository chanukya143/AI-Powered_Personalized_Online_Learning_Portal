package com.example.onlinelearningportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AiChatRequest {

    @NotBlank(message = "Message cannot be empty")
    @Size(max = 2000, message = "Message must not exceed 2000 characters")
    private String message;

    private String currentCourseTitle;

    private String currentLessonTitle;

    private String lessonSnippet;

    private String mode; // "concept_explainer", "practice_questions", "roadmap", or "general"

    public AiChatRequest() {
    }

    public AiChatRequest(String message, String currentCourseTitle, String currentLessonTitle,
                         String lessonSnippet, String mode) {
        this.message = message;
        this.currentCourseTitle = currentCourseTitle;
        this.currentLessonTitle = currentLessonTitle;
        this.lessonSnippet = lessonSnippet;
        this.mode = mode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCurrentCourseTitle() {
        return currentCourseTitle;
    }

    public void setCurrentCourseTitle(String currentCourseTitle) {
        this.currentCourseTitle = currentCourseTitle;
    }

    public String getCurrentLessonTitle() {
        return currentLessonTitle;
    }

    public void setCurrentLessonTitle(String currentLessonTitle) {
        this.currentLessonTitle = currentLessonTitle;
    }

    public String getLessonSnippet() {
        return lessonSnippet;
    }

    public void setLessonSnippet(String lessonSnippet) {
        this.lessonSnippet = lessonSnippet;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }
}
