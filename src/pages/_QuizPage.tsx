import { useState } from 'react';
// Link replaced for Astro compatibility

import { useUser, UserProvider } from '../context/UserContext';
import type { QuizExercise, Lesson, Exercise } from '../types';
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { QuizCompletionModal } from '../components/completion-modals';
import { PageTitle } from '../components/PageTitle';

interface QuizPageProps {
  exercise: QuizExercise;
  lesson: Lesson;
  lessonExercises: Exercise[];
  isExerciseCompleted: (id: string) => boolean;
}

function QuizPageContent({
  exercise,
  lesson,
  lessonExercises,
  isExerciseCompleted
}: QuizPageProps) {
  const { user, isGuest, completeExercise, completeLesson, isLessonCompleted, loading } = useUser();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) return null;

  const alreadyCompleted = isExerciseCompleted(exercise.id);
  const currentQuestion = exercise.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exercise.questions.length - 1;
  const currentIndex = lessonExercises.findIndex(e => e.id === exercise.id);
  const nextExercise = lessonExercises[currentIndex + 1];

  const handleSelectAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    if (isGuest) {
      setShowFeedback(true);
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      if (!alreadyCompleted) {
        completeExercise(exercise.id);
        // Auto-complete lesson if this was the last exercise
        const otherExercises = lessonExercises.filter(e => e.id !== exercise.id);
        const allOthersDone = otherExercises.every(e => isExerciseCompleted(e.id));
        if (allOthersDone && !isLessonCompleted(lesson.id)) {
          completeLesson(lesson.id);
        }
      }
      setCompleted(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCorrectCount(0);
    setCompleted(false);
  };

  const progressPercent = ((currentQuestionIndex + (showFeedback ? 1 : 0)) / exercise.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto page-enter pb-20 lg:pb-0">
      <div className="flex items-center justify-between gap-4 mb-3">
        <PageTitle>
          <h1 className="text-lg font-bold text-gray-900">{exercise.title}</h1>
        </PageTitle>

        <a
          href={`/lesson/${lesson.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </a>
      </div>

      {alreadyCompleted && (
        <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-600">
          <CheckCircle className="w-4 h-4" />
          <span>Quiz already completed</span>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Question {currentQuestionIndex + 1} of {exercise.questions.length}</span>
          <span className="text-sm font-medium text-primary-600">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {exercise.instructions && (
        <div className="bg-primary-50 border border-primary-100 px-4 py-2 mb-4 rounded-lg">
          <p className="text-sm text-primary-800">{exercise.instructions}</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            <span className="text-primary-600 mr-1">Question:</span>
            {currentQuestion.question}
          </h2>
        </div>

        <div className="px-6 py-4 space-y-2">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showCorrect = showFeedback && isCorrect;
            const showIncorrect = showFeedback && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showFeedback}
                className={`w-full text-left p-3.5 border rounded-lg transition-all flex items-center gap-3 ${showCorrect
                  ? 'border-green-500 bg-green-50'
                  : showIncorrect
                    ? 'border-red-500 bg-red-50'
                    : isSelected
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className={`w-7 h-7 flex items-center justify-center border font-semibold text-sm shrink-0 rounded ${showCorrect
                  ? 'border-green-500 bg-green-500 text-white'
                  : showIncorrect
                    ? 'border-red-500 bg-red-500 text-white'
                    : isSelected
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-300 text-gray-600'
                  }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-sm text-gray-700">{option}</span>
                {showCorrect && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
                {showIncorrect && <XCircle className="w-5 h-5 text-red-600 ml-auto" />}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mx-6 mb-6 p-4 border rounded-lg ${
            selectedAnswer === currentQuestion.correctAnswer
              ? 'border-green-200 bg-green-50'
              : 'border-red-200 bg-red-50'
          }">
            <div className="flex items-start gap-3">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-semibold text-sm ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-700' : 'text-red-700'
                  }`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                </p>
                <p className={`text-sm mt-1 ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        {!showFeedback ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors ${selectedAnswer === null
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="flex-1 py-2.5 px-4 rounded-lg font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {completed && (
        <QuizCompletionModal
          isOpen={true}
          correctCount={correctCount}
          totalQuestions={exercise.questions.length}
          alreadyCompleted={alreadyCompleted}
          hasNextExercise={!!nextExercise}
          nextExerciseId={nextExercise?.id}
          lessonId={lesson.id}
          onRestart={handleRestartQuiz}
        />
      )}
    </div>
  );
}

export default function QuizPage(props: QuizPageProps) {
  return (
    <UserProvider>
      <QuizPageContent {...props} />
    </UserProvider>
  );
}
