package com.example.onlinelearningportal.dto;

import com.example.onlinelearningportal.entity.Lesson;

public class LessonSummaryResponse {

    private Long id;
    private String title;
    private Integer lessonOrder;
    private String estimatedDuration;
    private boolean published;
    private boolean completed;

    public LessonSummaryResponse() {
    }

    public LessonSummaryResponse(Long id, String title, Integer lessonOrder, String estimatedDuration,
                                 boolean published, boolean completed) {
        this.id = id;
        this.title = title;
        this.lessonOrder = lessonOrder;
        this.estimatedDuration = estimatedDuration;
        this.published = published;
        this.completed = completed;
    }

    public static LessonSummaryResponse fromEntity(Lesson lesson, boolean completed) {
        return new LessonSummaryResponse(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getLessonOrder(),
                lesson.getEstimatedDuration(),
                lesson.isPublished(),
                completed
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getLessonOrder() {
        return lessonOrder;
    }

    public void setLessonOrder(Integer lessonOrder) {
        this.lessonOrder = lessonOrder;
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

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
