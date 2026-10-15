package com.example.onlinelearningportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class LessonRequest {

    @NotBlank(message = "Lesson title is required")
    @Size(min = 2, max = 255)
    private String title;

    private String description;

    @NotNull(message = "Lesson order is required")
    private Integer lessonOrder;

    @NotBlank(message = "Lesson content is required")
    private String content;

    private String videoUrl;

    private String estimatedDuration;

    private boolean published = true;

    public LessonRequest() {
    }

    public LessonRequest(String title, String description, Integer lessonOrder, String content,
                         String videoUrl, String estimatedDuration, boolean published) {
        this.title = title;
        this.description = description;
        this.lessonOrder = lessonOrder;
        this.content = content;
        this.videoUrl = videoUrl;
        this.estimatedDuration = estimatedDuration;
        this.published = published;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getLessonOrder() {
        return lessonOrder;
    }

    public void setLessonOrder(Integer lessonOrder) {
        this.lessonOrder = lessonOrder;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
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
}
