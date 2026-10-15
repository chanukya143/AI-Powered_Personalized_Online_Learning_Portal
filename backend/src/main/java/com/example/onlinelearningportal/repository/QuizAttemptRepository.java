package com.example.onlinelearningportal.repository;

import com.example.onlinelearningportal.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByUserIdOrderByAttemptedAtDesc(Long userId);

    List<QuizAttempt> findByUserIdAndQuizIdOrderByAttemptedAtDesc(Long userId, Long quizId);

    Optional<QuizAttempt> findFirstByUserIdAndQuizIdOrderByScoreDesc(Long userId, Long quizId);

    long countByUserId(Long userId);

    long countByPassedTrue();

    @Query("SELECT AVG(qa.score) FROM QuizAttempt qa WHERE qa.user.id = :userId")
    Double getAverageScoreByUserId(@Param("userId") Long userId);

    @Query("SELECT AVG(qa.score) FROM QuizAttempt qa")
    Double getOverallAverageScore();
}
