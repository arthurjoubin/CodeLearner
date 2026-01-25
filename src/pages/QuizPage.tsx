import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import type { QuizExercise, Lesson, Exercise } from '../types';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Star,
  ChevronDown,
  ChevronUp,
  List,
  ArrowRight,
} from 'lucide-react';

interface QuizPageProps {
  exercise: QuizExercise;
  lesson: Lesson;
  lessonExercises: Exercise[];
  isExerciseCompleted: (id: string) => boolean;
}

export default function QuizPage({
  exercise,
  lesson,
  lessonExercises,
  isExerciseCompleted
}: QuizPageProps) {
  const { user, isGuest, addXp, completeExercise, completeLesson, isLessonCompleted, loading } = useUser();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showExercisesDropdown, setShowExercisesDropdown] = useState(false);

  if (loading) {
    return (
      <div className="loading-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
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
        addXp(exercise.xpReward);
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
    <div className="min-h-[calc(100vh-120px)] flex flex-col page-enter pb-20 lg:pb-0">
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Link to={`/lesson/${lesson.id}`} className="p-1.5 border-2 border-black hover:bg-gray-100 shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="relative shrink-0">
              <button
                onClick={() => setShowExercisesDropdown(!showExercisesDropdown)}
                className="btn-primary text-xs py-1 px-2 inline-flex items-center gap-1"
              >
                <List className="w-3.5 h-3.5" />
                {currentIndex + 1}/{lessonExercises.length}
                {showExercisesDropdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {showExercisesDropdown && (
                <div className="absolute left-0 top-full mt-1 bg-white border-2 border-black z-10 min-w-[180px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-[200px] overflow-y-auto">
                  {lessonExercises.map((ex, index) => {
                    const exCompleted = isExerciseCompleted(ex.id);
                    return (
                      <Link
                        key={ex.id}
                        to={`/exercise/${ex.id}`}
                        onClick={() => setShowExercisesDropdown(false)}
                        className={`flex items-center gap-2 px-3 py-2 border-b border-black last:border-b-0 ${ex.id === exercise.id ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                      >
                        {exCompleted ? (
                          <CheckCircle className="w-4 h-4 text-primary-500 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-black shrink-0" />
                        )}
                        <span className="text-xs font-bold uppercase">{index + 1}. {ex.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            <h1 className="text-sm lg:text-base font-black text-black truncate">{exercise.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="xp-badge text-xs py-0.5">
            <Star className="w-3 h-3" />{exercise.xpReward}
          </span>
          {alreadyCompleted && (
            <div className="bg-primary-500 p-1 border-2 border-black">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-bold">Question {currentQuestionIndex + 1} of {exercise.questions.length}</span>
          <span className="text-gray-600">{Math.round(progressPercent)}% complete</span>
        </div>
        <div className="h-2 bg-gray-200 border border-black">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {exercise.instructions && (
        <div className="bg-gray-50 border-2 border-black p-3 mb-4">
          <p className="text-sm">{exercise.instructions}</p>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-2 border-black p-6 flex-1">
          <h2 className="text-lg font-black mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3">
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
                  className={`w-full text-left p-4 border-2 transition-all flex items-center gap-3 ${
                    showCorrect
                      ? 'border-green-500 bg-green-50'
                      : showIncorrect
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-black bg-gray-100'
                      : 'border-gray-300 hover:border-black hover:bg-gray-50'
                  } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center border-2 font-bold text-sm shrink-0 ${
                    showCorrect
                      ? 'border-green-500 bg-green-500 text-white'
                      : showIncorrect
                      ? 'border-red-500 bg-red-500 text-white'
                      : isSelected
                      ? 'border-black bg-black text-white'
                      : 'border-gray-400'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-medium">{option}</span>
                  {showCorrect && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
                  {showIncorrect && <XCircle className="w-5 h-5 text-red-600 ml-auto" />}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className={`mt-6 p-4 border-2 ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
            }`}>
              <div className="flex items-start gap-2">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-bold text-sm ${
                    selectedAnswer === currentQuestion.correctAnswer ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Not quite'}
                  </p>
                  <p className={`text-sm mt-1 ${
                    selectedAnswer === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'
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
              className={`btn-primary flex-1 py-3 flex items-center justify-center gap-2 ${
                selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {completed && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-8 text-center max-w-sm animate-pop shadow-brutal">
            <div className="text-6xl mb-4">
              {correctCount === exercise.questions.length ? '🎉' : correctCount >= exercise.questions.length / 2 ? '👍' : '📚'}
            </div>

            <h2 className="text-2xl font-black mb-2 uppercase text-green-600">Quiz Complete!</h2>
            <p className="text-gray-600 mb-2">
              You got <span className="font-bold">{correctCount}</span> out of <span className="font-bold">{exercise.questions.length}</span> correct
            </p>

            <div className="w-full bg-gray-200 h-3 border border-black mb-4">
              <div
                className={`h-full ${correctCount === exercise.questions.length ? 'bg-green-500' : correctCount >= exercise.questions.length / 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${(correctCount / exercise.questions.length) * 100}%` }}
              />
            </div>

            {!alreadyCompleted && (
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 border-2 border-black font-black text-lg mb-6">
                <Star className="w-5 h-5" />
                +{exercise.xpReward} XP
              </div>
            )}
            {alreadyCompleted && (
              <p className="text-sm text-gray-500 mb-6">Already completed</p>
            )}

            <div className="flex flex-col gap-3">
              {nextExercise ? (
                <Link
                  to={`/exercise/${nextExercise.id}`}
                  className="bg-black text-white font-bold py-3 px-6 border-2 border-black uppercase hover:bg-gray-800 transition-colors"
                >
                  Next Exercise →
                </Link>
              ) : (
                <Link
                  to={`/lesson/${lesson.id}`}
                  className="bg-black text-white font-bold py-3 px-6 border-2 border-black uppercase hover:bg-gray-800 transition-colors"
                >
                  Continue →
                </Link>
              )}
              <button
                onClick={handleRestartQuiz}
                className="text-sm text-gray-500 hover:text-black underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
