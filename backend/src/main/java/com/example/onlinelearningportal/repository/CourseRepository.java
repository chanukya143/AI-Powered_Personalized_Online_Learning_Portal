package com.example.onlinelearningportal.repository;

import com.example.onlinelearningportal.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("SELECT c FROM Course c WHERE c.published = true AND " +
           "(:category IS NULL OR LOWER(c.category) = LOWER(:category)) AND " +
           "(:difficulty IS NULL OR LOWER(c.difficultyLevel) = LOWER(:difficulty)) AND " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.shortDescription) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Course> searchPublishedCourses(@Param("search") String search,
                                        @Param("category") String category,
                                        @Param("difficulty") String difficulty,
                                        Pageable pageable);

    @Query("SELECT c FROM Course c WHERE " +
           "(:category IS NULL OR LOWER(c.category) = LOWER(:category)) AND " +
           "(:difficulty IS NULL OR LOWER(c.difficultyLevel) = LOWER(:difficulty)) AND " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.shortDescription) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Course> searchAllCoursesAdmin(@Param("search") String search,
                                       @Param("category") String category,
                                       @Param("difficulty") String difficulty,
                                       Pageable pageable);

    List<Course> findByPublishedTrue();

    long countByPublishedTrue();

    @Query("SELECT DISTINCT c.category FROM Course c WHERE c.published = true")
    List<String> findDistinctPublishedCategories();
}
