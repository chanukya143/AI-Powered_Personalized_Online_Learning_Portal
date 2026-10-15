package com.example.onlinelearningportal.repository;

import com.example.onlinelearningportal.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByUserIdOrderByEnrolledAtDesc(Long userId);

    Optional<Enrollment> findByUserIdAndCourseId(Long userId, Long courseId);

    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    long countByUserId(Long userId);

    long countByUserIdAndCompletedTrue(Long userId);

    long countByCourseId(Long courseId);

    long countByCompletedTrue();
}
