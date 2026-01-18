import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getExercise, getModule, getLesson, getExercisesForLesson } from '../data/modules';
import { api } from '../services/api';
import Editor from '@monaco-editor/react';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  CheckCircle,
  XCircle,
  Lightbulb,
  Star,
  Heart,
  Loader,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react';
import LivePreview from '../components/LivePreview';

export default function ExercisePage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const { user, addXp, loseHeart, completeExercise, isExerciseCompleted } = useUser();

  const exercise = exerciseId ? getExercise(exerciseId) : undefined;
  const lesson = exercise ? getLesson(exercise.lessonId) : undefined;
  const module = exercise ? getModule(exercise.moduleId) : undefined;
  const lessonExercises = lesson ? getExercisesForLesson(lesson.id) : [];

  const [code, setCode] = useState(exercise?.starterCode || '');
  const [isValidating, setIsValidating] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [completed, setCompleted] = useState(false);

  const alreadyCompleted = exerciseId ? isExerciseCompleted(exerciseId) : false;

  useEffect(() => {
    if (exercise) {
      setCode(exercise.starterCode);
      setFeedback(null);
      setShowHint(false);
      setHint('');
      setAttemptCount(0);
      setShowSolution(false);
      setCompleted(false);
    }
  }, [exercise?.id]);

  if (!exercise || !lesson || !module || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-black font-bold">Exercise not found</p>
        <Link to="/" className="text-black underline font-bold uppercase">
          Go back home
        </Link>
      </div>
    );
  }

  const currentIndex = lessonExercises.findIndex(e => e.id === exercise.id);
  const nextExercise = lessonExercises[currentIndex + 1];
  const prevExercise = lessonExercises[currentIndex - 1];

  const handleValidate = async () => {
    if (isValidating) return;

    setIsValidating(true);
    setFeedback(null);
    setAttemptCount(prev => prev + 1);

    try {
      const result = await api.validateCode(code, {
        instructions: exercise.instructions,
        validationPrompt: exercise.validationPrompt,
      });

      if (result.isCorrect) {
        if (!alreadyCompleted) {
          addXp(exercise.xpReward);
          completeExercise(exercise.id);
        }
        setFeedback({ isCorrect: true, message: result.feedback });
        setCompleted(true);
      } else {
        // Lose a heart on wrong answer
        const hasHearts = loseHeart();
        if (!hasHearts && user.hearts <= 1) {
          setFeedback({
            isCorrect: false,
            message: "You're out of hearts! Take a break and come back later.",
          });
        } else {
          setFeedback({
            isCorrect: false,
            message: result.feedback + (result.hints?.[0] ? ` Hint: ${result.hints[0]}` : ''),
          });
        }
      }
    } catch (error) {
      console.error('Validation error:', error);
      setFeedback({
        isCorrect: false,
        message: 'Could not validate your code. Please try again.',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleGetHint = async () => {
    if (isLoadingHint) return;

    setIsLoadingHint(true);
    try {
      const hintText = await api.getHint(
        code,
        { instructions: exercise.instructions, hints: exercise.hints },
        attemptCount
      );
      setHint(hintText);
      setShowHint(true);
    } catch (error) {
      console.error('Hint error:', error);
      setHint(exercise.hints[Math.min(attemptCount, exercise.hints.length - 1)] || 'Keep trying!');
      setShowHint(true);
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleReset = () => {
    setCode(exercise.starterCode);
    setFeedback(null);
  };

  return (
    <div className="h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link
            to={`/lesson/${lesson.id}`}
            className="inline-flex items-center gap-2 text-black font-bold uppercase hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lesson
          </Link>
          <div>
            <div className="text-sm text-black font-bold uppercase">
              Exercise {currentIndex + 1} of {lessonExercises.length}
            </div>
            <h1 className="text-xl font-bold text-black uppercase">{exercise.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-sm font-bold uppercase border-2 border-black ${
              exercise.difficulty === 'easy'
                ? 'bg-green-400 text-black'
                : exercise.difficulty === 'medium'
                ? 'bg-yellow-400 text-black'
                : 'bg-red-500 text-white'
            }`}
          >
            {exercise.difficulty}
          </span>
          <span className="xp-badge">
            <Star className="w-4 h-4" />
            {exercise.xpReward} XP
          </span>
          {alreadyCompleted && (
            <div className="bg-primary-500 p-1 border-2 border-black">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-2 gap-4 h-[calc(100%-60px)]">
        {/* Left: Instructions & Editor */}
        <div className="flex flex-col gap-4">
          {/* Instructions */}
          <div className="card flex-shrink-0">
            <h3 className="font-bold text-black mb-2 uppercase">Instructions</h3>
            <p className="text-black whitespace-pre-wrap">{exercise.instructions}</p>
          </div>

          {/* Editor */}
          <div className="card flex-1 p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-black text-white">
              <span className="text-sm font-bold uppercase">Code Editor</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-1.5 hover:bg-gray-800 border border-white"
                  title="Reset code"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="p-1.5 hover:bg-gray-800 border border-white"
                  title={showSolution ? 'Hide solution' : 'Show solution'}
                >
                  {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Editor
              height="100%"
              defaultLanguage="typescript"
              theme="vs-dark"
              value={showSolution ? exercise.solution : code}
              onChange={(value) => !showSolution && setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                readOnly: showSolution,
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleValidate}
              disabled={isValidating || user.hearts === 0}
              className="btn-primary flex items-center gap-2"
            >
              {isValidating ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Check Solution
            </button>

            <button
              onClick={handleGetHint}
              disabled={isLoadingHint}
              className="btn-secondary flex items-center gap-2"
            >
              {isLoadingHint ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Lightbulb className="w-4 h-4" />
              )}
              Get Hint
            </button>

            <div className="flex-1" />

            {/* Hearts warning */}
            {user.hearts <= 2 && (
              <div className="flex items-center gap-1 bg-red-100 text-red-600 text-sm px-2 py-1 border-2 border-black font-bold">
                <Heart className="w-4 h-4 fill-current" />
                {user.hearts} left
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview & Feedback */}
        <div className="flex flex-col gap-4">
          {/* Feedback */}
          {feedback && (
            <div
              className={`card flex-shrink-0 ${
                feedback.isCorrect
                  ? 'bg-green-100 border-green-600'
                  : 'bg-red-100 border-red-600'
              } border-3`}
            >
              <div className="flex items-start gap-3">
                {feedback.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <h4
                    className={`font-bold uppercase ${
                      feedback.isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {feedback.isCorrect ? 'Correct!' : 'Not quite right'}
                  </h4>
                  <p
                    className={`text-sm ${
                      feedback.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {feedback.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hint */}
          {showHint && hint && (
            <div className="card flex-shrink-0 bg-yellow-100 border-3 border-yellow-600">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-yellow-800 uppercase">Hint</h4>
                  <p className="text-sm text-yellow-700">{hint}</p>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="card flex-1 p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-200 border-b-3 border-black">
              <span className="text-sm font-bold text-black uppercase">Live Preview</span>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-black font-bold underline uppercase"
              >
                {showPreview ? 'Hide' : 'Show'}
              </button>
            </div>
            {showPreview && (
              <div className="h-full bg-white">
                <LivePreview code={showSolution ? exercise.solution : code} />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between flex-shrink-0">
            {prevExercise ? (
              <Link
                to={`/exercise/${prevExercise.id}`}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Link>
            ) : (
              <div />
            )}

            {nextExercise ? (
              <Link
                to={`/exercise/${nextExercise.id}`}
                className="btn-primary inline-flex items-center gap-2"
              >
                Next Exercise
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to={`/module/${module.id}`}
                className="btn-primary inline-flex items-center gap-2"
              >
                Finish Module
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Success modal */}
      {completed && !alreadyCompleted && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-8 text-center max-w-md animate-pop">
            <div className="w-20 h-20 bg-yellow-400 flex items-center justify-center mx-auto mb-4 border-3 border-black">
              <Star className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2 uppercase">
              Exercise Complete!
            </h2>
            <p className="text-black mb-4">
              You earned {exercise.xpReward} XP. Great job solving this one!
            </p>
            <div className="flex gap-3 justify-center">
              {nextExercise ? (
                <Link
                  to={`/exercise/${nextExercise.id}`}
                  className="btn-primary"
                >
                  Next Exercise
                </Link>
              ) : (
                <Link to={`/module/${module.id}`} className="btn-primary">
                  Back to Module
                </Link>
              )}
              <button
                onClick={() => setCompleted(false)}
                className="btn-secondary"
              >
                Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
