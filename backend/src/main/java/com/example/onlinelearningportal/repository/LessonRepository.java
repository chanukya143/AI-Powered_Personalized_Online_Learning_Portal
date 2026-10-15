package com.example.onlinelearningportal.repository;

import com.example.onlinelearningportal.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByCourseIdAndPublishedTrueOrderByLessonOrderAsc(Long courseId);

    List<Lesson> findByCourseIdOrderByLessonOrderAsc(Long courseId);

    Optional<Lesson> findByIdAndCourseId(Long id, Long courseId);

    long countByCourseIdAndPublishedTrue(Long courseId);

    long countByCourseId(Long courseId);

    Optional<Lesson> findFirstByCourseIdAndPublishedTrueOrderByLessonOrderAsc(Long courseId);
}
