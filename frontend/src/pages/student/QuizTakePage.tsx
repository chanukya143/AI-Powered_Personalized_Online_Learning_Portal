import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Clock,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { QuizDetail, QuizResult } from '../../types';
import { quizService } from '../../services/quizService';
import { getApiErrorMessage } from '../../services/apiClient';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';

export const QuizTakePage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const id = Number(quizId);
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setQuizResult(null);
    setSelectedAnswers({});
    try {
      const data = await quizService.getQuiz(id);
      setQuiz(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuiz();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (quizResult) return; // Prevent changing answers after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < quiz.questions.length) {
      if (!window.confirm(`You answered ${answeredCount} of ${quiz.questions.length} questions. Submit anyway?`)) {
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await quizService.submitQuiz(quiz.id, selectedAnswers);
      setQuizResult(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <LoadingSkeleton height="80px" count={1} />
        <div style={{ marginTop: '2rem' }}>
          <LoadingSkeleton height="200px" count={3} />
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container">
        <ErrorState message={error || 'Quiz not found'} onRetry={fetchQuiz} />
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '850px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <Link
          to={`/courses/${quiz.courseId}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Return to Course Overview
        </Link>
        <PageHeader
          title={quiz.title}
          subtitle={`Course: ${quiz.courseTitle} • Passing Score: ${quiz.passingScore}%`}
        />
      </div>

      {/* Results Banner (if evaluated) */}
      {quizResult && (
        <NeoCard
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: quizResult.passed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1.5px solid ${quizResult.passed ? 'var(--neo-success)' : 'var(--neo-danger)'}`,
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--neo-surface)',
              boxShadow: 'var(--neo-raised-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: quizResult.passed ? 'var(--neo-success)' : 'var(--neo-danger)',
              margin: '0 auto 1rem auto',
            }}
          >
            {quizResult.passed ? <Award size={36} /> : <AlertTriangle size={36} />}
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
            {quizResult.passed ? 'Assessment Passed! 🎉' : 'Assessment Not Passed'}
          </h2>

          <p style={{ fontSize: '1.1rem', color: 'var(--neo-text-secondary)', marginBottom: '1.5rem' }}>
            You scored <strong>{quizResult.score}%</strong> ({quizResult.correctAnswersCount} of {quizResult.totalQuestions} questions correct). Required: {quizResult.passingScore}%.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <NeoButton variant="neutral" size="md" onClick={fetchQuiz} icon={<RotateCcw size={16} />}>
              Retake Assessment
            </NeoButton>
            <Link to={`/courses/${quiz.courseId}`}>
              <NeoButton variant="primary" size="md">
                Course Curriculum <ArrowRight size={16} />
              </NeoButton>
            </Link>
          </div>
        </NeoCard>
      )}

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {quiz.questions.map((q, qIndex) => {
          // If result is present, find evaluation for this question
          const qResult = quizResult?.questionResults.find((qr) => qr.questionId === q.id);

          return (
            <NeoCard key={q.id} style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className="badge badge-primary">Question {qIndex + 1}</span>
                {qResult && (
                  <span
                    className={`badge ${qResult.correct ? 'badge-success' : 'badge-danger'}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    {qResult.correct ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {qResult.correct ? 'Correct' : 'Incorrect'}
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {q.questionText}
              </h3>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {q.options.map((optionText, optIdx) => {
                  const isSelected = selectedAnswers[q.id] === optIdx;
                  let optionBg = 'var(--neo-surface)';
                  let optionBorder = '1px solid rgba(163, 177, 198, 0.35)';
                  let optionShadow = isSelected ? 'var(--neo-inset)' : 'var(--neo-raised-sm)';

                  if (qResult) {
                    if (optIdx === qResult.correctAnswerIndex) {
                      optionBg = 'rgba(16, 185, 129, 0.12)';
                      optionBorder = '1.5px solid var(--neo-success)';
                    } else if (isSelected && !qResult.correct) {
                      optionBg = 'rgba(239, 68, 68, 0.12)';
                      optionBorder = '1.5px solid var(--neo-danger)';
                    }
                  } else if (isSelected) {
                    optionBorder = '1.5px solid var(--neo-primary)';
                    optionBg = 'rgba(91, 103, 241, 0.08)';
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: optionBg,
                        border: optionBorder,
                        boxShadow: optionShadow,
                        cursor: quizResult ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: isSelected
                            ? '6px solid var(--neo-primary)'
                            : '2px solid rgba(163, 177, 198, 0.6)',
                          backgroundColor: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '0.95rem', color: 'var(--neo-text)', fontWeight: 500 }}>
                        {optionText}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation (Shown only in results) */}
              {qResult && qResult.explanation && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(235, 240, 245, 0.8)',
                    borderLeft: '4px solid var(--neo-primary)',
                    fontSize: '0.875rem',
                    color: 'var(--neo-text-secondary)',
                  }}
                >
                  <strong>Explanation: </strong> {qResult.explanation}
                </div>
              )}
            </NeoCard>
          );
        })}
      </div>

      {/* Submission CTA */}
      {!quizResult && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <NeoButton
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            icon={<CheckCircle2 size={20} />}
          >
            Submit Assessment For Grading
          </NeoButton>
        </div>
      )}
    </div>
  );
};
