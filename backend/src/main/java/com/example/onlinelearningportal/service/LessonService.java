package com.example.onlinelearningportal.service;

import com.example.onlinelearningportal.dto.LessonRequest;
import com.example.onlinelearningportal.dto.LessonResponse;
import com.example.onlinelearningportal.entity.Course;
import com.example.onlinelearningportal.entity.Lesson;
import com.example.onlinelearningportal.exception.ForbiddenException;
import com.example.onlinelearningportal.exception.ResourceNotFoundException;
import com.example.onlinelearningportal.repository.CourseRepository;
import com.example.onlinelearningportal.repository.EnrollmentRepository;
import com.example.onlinelearningportal.repository.LessonProgressRepository;
import com.example.onlinelearningportal.repository.LessonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;

    public LessonService(LessonRepository lessonRepository,
                         CourseRepository courseRepository,
                         EnrollmentRepository enrollmentRepository,
                         LessonProgressRepository lessonProgressRepository) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonProgressRepository = lessonProgressRepository;
    }

    @Transactional(readOnly = true)
    public LessonResponse getLessonById(Long lessonId, Long currentUserId, boolean isAdmin) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));

        Course course = lesson.getCourse();

        // Unless Admin, student must be enrolled to view lesson content
        if (!isAdmin) {
            boolean isEnrolled = enrollmentRepository.existsByUserIdAndCourseId(currentUserId, course.getId());
            if (!isEnrolled) {
                throw new ForbiddenException("You must be enrolled in this course to view lesson content.");
            }
        }

        boolean completed = false;
        if (currentUserId != null) {
            completed = lessonProgressRepository.existsByUserIdAndLessonIdAndCompletedTrue(currentUserId, lessonId);
        }

        // Calculate next and previous lesson IDs
        List<Lesson> publishedLessons = lessonRepository.findByCourseIdAndPublishedTrueOrderByLessonOrderAsc(course.getId());
        Long nextLessonId = null;
        Long previousLessonId = null;

        for (int i = 0; i < publishedLessons.size(); i++) {
            if (publishedLessons.get(i).getId().equals(lessonId)) {
                if (i > 0) {
                    previousLessonId = publishedLessons.get(i - 1).getId();
                }
                if (i < publishedLessons.size() - 1) {
                    nextLessonId = publishedLessons.get(i + 1).getId();
                }
                break;
            }
        }

        return LessonResponse.fromEntity(lesson, completed, nextLessonId, previousLessonId);
    }

    @Transactional(readOnly = true)
    public List<LessonResponse> getLessonsByCourseId(Long courseId, boolean isAdmin) {
        List<Lesson> lessons = isAdmin
                ? lessonRepository.findByCourseIdOrderByLessonOrderAsc(courseId)
                : lessonRepository.findByCourseIdAndPublishedTrueOrderByLessonOrderAsc(courseId);

        return lessons.stream()
                .map(l -> LessonResponse.fromEntity(l, false, null, null))
                .toList();
    }

    @Transactional
    public LessonResponse createLesson(Long courseId, LessonRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        int order = request.getLessonOrder() != null ? request.getLessonOrder()
                : (int) lessonRepository.countByCourseId(courseId) + 1;

        Lesson lesson = new Lesson(
                course,
                request.getTitle().trim(),
                request.getDescription() != null ? request.getDescription().trim() : "",
                order,
                request.getContent().trim(),
                request.getVideoUrl() != null ? request.getVideoUrl().trim() : "",
                request.getEstimatedDuration() != null ? request.getEstimatedDuration().trim() : "15 Mins",
                request.isPublished()
        );

        Lesson saved = lessonRepository.save(lesson);
        return LessonResponse.fromEntity(saved, false, null, null);
    }

    @Transactional
    public LessonResponse updateLesson(Long lessonId, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));

        lesson.setTitle(request.getTitle().trim());
        lesson.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        if (request.getLessonOrder() != null) {
            lesson.setLessonOrder(request.getLessonOrder());
        }
        lesson.setContent(request.getContent().trim());
        if (request.getVideoUrl() != null) {
            lesson.setVideoUrl(request.getVideoUrl().trim());
        }
        if (request.getEstimatedDuration() != null) {
            lesson.setEstimatedDuration(request.getEstimatedDuration().trim());
        }
        lesson.setPublished(request.isPublished());

        Lesson updated = lessonRepository.save(lesson);
        return LessonResponse.fromEntity(updated, false, null, null);
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));
        lessonRepository.delete(lesson);
    }
}
