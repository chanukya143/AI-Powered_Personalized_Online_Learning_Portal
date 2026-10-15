import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { CourseDetail, QuizAdminDetail, QuestionAdminDetail } from '../../types';
import { courseService } from '../../services/courseService';
import { adminService, QuizCreatePayload } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/apiClient';
import { PageHeader } from '../../components/common/PageHeader';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoInput } from '../../components/common/NeoInput';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const QuizManagementPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const id = Number(courseId);
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [existingQuizId, setExistingQuizId] = useState<number | null>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [passingScore, setPassingScore] = useState<number>(70);
  const [questions, setQuestions] = useState<QuestionAdminDetail[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const courseData = await courseService.getCourseDetails(id);
        setCourse(courseData);

        if (courseData.quizId) {
          setExistingQuizId(courseData.quizId);
          const quizAdmin = await adminService.getAdminQuiz(courseData.quizId);
          setQuizTitle(quizAdmin.title);
          setQuizDescription(quizAdmin.description || '');
          setPassingScore(quizAdmin.passingScore);
          setQuestions(quizAdmin.questions);
        } else {
          setQuizTitle(`${courseData.title} Final Assessment`);
          setQuizDescription('Comprehensive assessment testing core topics and best practices.');
          setQuestions([
            {
              questionText: 'Which key principle ensures stateless horizontal scalability?',
              options: [
                'Stateful server session caching',
                'Cryptographic JWT verification without shared session memory',
                'Hardcoding database connections in UI',
                'Disabling SSL certificates',
              ],
              correctAnswerIndex: 1,
              explanation: 'Stateless JWT tokens permit any cluster node to verify claims autonomously.',
              questionOrder: 1,
            },
          ]);
        }
      } catch (err: unknown) {
        setError(getApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchQuizData();
    }
  }, [id]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: 'New Assessment Question',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswerIndex: 0,
        explanation: 'Explanation for why this option is correct.',
        questionOrder: questions.length + 1,
      },
    ]);
  };

  const removeQuestion = (qIndex: number) => {
    if (questions.length <= 1) {
      alert('A quiz must contain at least one question.');
      return;
    }
    setQuestions(questions.filter((_, idx) => idx !== qIndex));
  };

  const updateQuestionText = (qIndex: number, text: string) => {
    setQuestions(questions.map((q, idx) => (idx === qIndex ? { ...q, questionText: text } : q)));
  };

  const updateQuestionExplanation = (qIndex: number, explanation: string) => {
    setQuestions(questions.map((q, idx) => (idx === qIndex ? { ...q, explanation } : q)));
  };

  const updateOptionText = (qIndex: number, optIndex: number, text: string) => {
    setQuestions(
      questions.map((q, idx) => {
        if (idx !== qIndex) return q;
        const newOptions = [...q.options];
        newOptions[optIndex] = text;
        return { ...q, options: newOptions };
      })
    );
  };

  const setCorrectAnswer = (qIndex: number, optIndex: number) => {
    setQuestions(
      questions.map((q, idx) => (idx === qIndex ? { ...q, correctAnswerIndex: optIndex } : q))
    );
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim() || questions.length === 0) return;

    setIsSaving(true);
    setError(null);
    try {
      const payload: QuizCreatePayload = {
        courseId: id,
        title: quizTitle.trim(),
        description: quizDescription.trim(),
        passingScore: Number(passingScore),
        questions: questions.map((q, idx) => ({
          ...q,
          questionOrder: idx + 1,
        })),
      };

      if (existingQuizId) {
        await adminService.updateQuiz(existingQuizId, payload);
      } else {
        await adminService.createQuiz(payload);
      }

      alert('Quiz assessment saved successfully!');
      navigate(`/admin/courses`);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <LoadingSkeleton height="350px" count={1} />
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '850px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <Link
          to="/admin/courses"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Back to Courses
        </Link>
        <PageHeader
          title={`Quiz Editor: ${course?.title}`}
          subtitle="Configure multiple-choice questions, answer keys, and passing thresholds."
        />
      </div>

      <NeoCard style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
        {error && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--neo-danger)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSaveQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <NeoInput
              label="Quiz Title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              required
            />
            <NeoInput
              label="Passing Score Percentage (%)"
              type="number"
              min="1"
              max="100"
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              required
            />
          </div>

          <NeoInput
            label="Quiz Description"
            value={quizDescription}
            onChange={(e) => setQuizDescription(e.target.value)}
          />

          {/* Questions Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Questions ({questions.length})
              </h3>
              <NeoButton type="button" variant="neutral" size="sm" onClick={addQuestion} icon={<Plus size={16} />}>
                Add Question
              </NeoButton>
            </div>

            {questions.map((q, qIndex) => (
              <NeoCard
                key={qIndex}
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(163, 177, 198, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-primary">Question {qIndex + 1}</span>
                  <NeoButton
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeQuestion(qIndex)}
                    style={{ padding: '0.35rem 0.65rem' }}
                  >
                    <Trash2 size={14} /> Remove
                  </NeoButton>
                </div>

                <NeoInput
                  label="Question Text"
                  value={q.questionText}
                  onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                  required
                />

                {/* Options List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neo-text)' }}>
                    Answer Choices (Click radio button to mark correct answer)
                  </label>
                  {q.options.map((opt, optIndex) => {
                    const isCorrect = q.correctAnswerIndex === optIndex;
                    return (
                      <div
                        key={optIndex}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                          padding: '0.4rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={isCorrect}
                          onChange={() => setCorrectAnswer(qIndex, optIndex)}
                          style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                          title="Designate as correct answer"
                        />
                        <NeoInput
                          value={opt}
                          onChange={(e) => updateOptionText(qIndex, optIndex, e.target.value)}
                          placeholder={`Option ${optIndex + 1}`}
                          required
                        />
                      </div>
                    );
                  })}
                </div>

                <NeoInput
                  label="Answer Explanation"
                  placeholder="Explains why the correct choice is right for student review"
                  value={q.explanation || ''}
                  onChange={(e) => updateQuestionExplanation(qIndex, e.target.value)}
                />
              </NeoCard>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/admin/courses">
              <NeoButton type="button" variant="neutral" size="md">
                Cancel
              </NeoButton>
            </Link>
            <NeoButton type="submit" variant="primary" size="md" isLoading={isSaving} icon={<Save size={18} />}>
              Save Assessment Quiz
            </NeoButton>
          </div>
        </form>
      </NeoCard>
    </div>
  );
};
