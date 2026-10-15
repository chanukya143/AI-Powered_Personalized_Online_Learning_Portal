package com.example.onlinelearningportal.dto;

public class LessonProgressUpdateRequest {

    private boolean completed = true;

    public LessonProgressUpdateRequest() {
    }

    public LessonProgressUpdateRequest(boolean completed) {
        this.completed = completed;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
