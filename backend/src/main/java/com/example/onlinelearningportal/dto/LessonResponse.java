package com.example.onlinelearningportal.dto;

import com.example.onlinelearningportal.entity.Lesson;

import java.time.Instant;

public class LessonResponse {

    private Long id;
    private Long courseId;
    private String courseTitle;
    private String title;
    private String description;
    private Integer lessonOrder;
    private String content;
    private String videoUrl;
    private String estimatedDuration;
    private boolean published;
    private boolean completed;
    private Long nextLessonId;
    private Long previousLessonId;
    private Instant createdAt;

    public LessonResponse() {
    }

    public LessonResponse(Long id, Long courseId, String courseTitle, String title, String description,
                          Integer lessonOrder, String content, String videoUrl, String estimatedDuration,
                          boolean published, boolean completed, Long nextLessonId, Long previousLessonId,
                          Instant createdAt) {
        this.id = id;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.title = title;
        this.description = description;
        this.lessonOrder = lessonOrder;
        this.content = content;
        this.videoUrl = videoUrl;
        this.estimatedDuration = estimatedDuration;
        this.published = published;
        this.completed = completed;
        this.nextLessonId = nextLessonId;
        this.previousLessonId = previousLessonId;
        this.createdAt = createdAt;
    }

    public static LessonResponse fromEntity(Lesson lesson, boolean completed, Long nextLessonId, Long previousLessonId) {
        return new LessonResponse(
                lesson.getId(),
                lesson.getCourse().getId(),
                lesson.getCourse().getTitle(),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.getLessonOrder(),
                lesson.getContent(),
                lesson.getVideoUrl(),
                lesson.getEstimatedDuration(),
                lesson.isPublished(),
                completed,
                nextLessonId,
                previousLessonId,
                lesson.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
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

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public Long getNextLessonId() {
        return nextLessonId;
    }

    public void setNextLessonId(Long nextLessonId) {
        this.nextLessonId = nextLessonId;
    }

    public Long getPreviousLessonId() {
        return previousLessonId;
    }

    public void setPreviousLessonId(Long previousLessonId) {
        this.previousLessonId = previousLessonId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
