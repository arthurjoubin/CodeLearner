import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
} from 'lucide-react';
import LivePreview from '../components/LivePreview';

export default function ExercisePage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { user, isGuest, addXp, completeExercise, isExerciseCompleted } = useUser();

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
  const [completed, setCompleted] = useState(false);

  const alreadyCompleted = exerciseId ? isExerciseCompleted(exerciseId) : false;

  useEffect(() => {
    if (exercise) {
      setCode(exercise.starterCode);
      setFeedback(null);
      setShowHint(false);
      setHint('');
      setAttemptCount(0);
      setCompleted(false);
    }
  }, [exercise?.id]);

  if (!exercise || !lesson || !module || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-black font-bold">Exercise not found</p>
        <Link to="/" className="text-black underline font-bold uppercase">Go back home</Link>
      </div>
    );
  }

  const currentIndex = lessonExercises.findIndex(e => e.id === exercise.id);
  const nextExercise = lessonExercises[currentIndex + 1];
  const prevExercise = lessonExercises[currentIndex - 1];

  // Simple local validation as fallback
  const simpleValidate = (code: string, solution: string): boolean => {
    // Normalize code for comparison
    const normalize = (s: string) => s.replace(/\s+/g, ' ').replace(/['"`]/g, '"').trim().toLowerCase();
    const normalizedCode = normalize(code);
    const normalizedSolution = normalize(solution);

    // Check if key parts of solution are in the code
    const solutionParts = normalizedSolution.split(/[;{}()]/g).filter(p => p.trim().length > 5);
    const matchedParts = solutionParts.filter(part => normalizedCode.includes(part.trim()));

    // Accept if at least 60% of solution parts are present
    return matchedParts.length >= solutionParts.length * 0.6;
  };

  const handleValidate = async () => {
    if (isValidating) return;

    if (isGuest) {
      setFeedback({ isCorrect: false, message: 'Sign in with GitHub to validate your code and save your progress!' });
      return;
    }

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
        setFeedback({ isCorrect: true, message: result.feedback || 'Well done!' });
        setCompleted(true);
      } else {
        setFeedback({
          isCorrect: false,
          message: result.feedback || 'Not quite. Check your code.',
        });
      }
    } catch {
      // Fallback: use simple local validation
      const isCorrect = simpleValidate(code, exercise.solution);

      if (isCorrect) {
        if (!alreadyCompleted) {
          addXp(exercise.xpReward);
          completeExercise(exercise.id);
        }
        setFeedback({ isCorrect: true, message: 'Well done!' });
        setCompleted(true);
      } else {
        setFeedback({
          isCorrect: false,
          message: 'Not quite. Check the solution or ask for a hint.'
        });
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleGetHint = async () => {
    if (isLoadingHint) return;

    if (isGuest) {
      setHint('Sign in with GitHub to get AI-powered hints!');
      setShowHint(true);
      return;
    }

    setIsLoadingHint(true);
    try {
      const hintText = await api.getHint(code, { instructions: exercise.instructions, hints: exercise.hints }, attemptCount);
      setHint(hintText);
      setShowHint(true);
    } catch {
      setHint(exercise.hints[Math.min(attemptCount, exercise.hints.length - 1)] || 'Keep going!');
      setShowHint(true);
    } finally {
      setIsLoadingHint(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col page-enter">
      {/* Header compact */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <Link to={`/lesson/${lesson.id}`} className="p-1.5 border-2 border-black hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Exercise {currentIndex + 1}/{lessonExercises.length}</p>
            <h1 className="text-base font-black text-black">{exercise.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="xp-badge text-xs py-0.5">
            <Star className="w-3 h-3" />{exercise.xpReward}
          </span>
          <div className={`flex items-center gap-1 text-xs px-2 py-1 border-2 border-black font-bold ${user.hearts <= 2 ? 'bg-red-100 text-red-600' : 'bg-white'}`}>
            <Heart className={`w-3 h-3 ${user.hearts <= 2 ? 'fill-red-500' : ''}`} />
            {user.hearts}
          </div>
          {alreadyCompleted && (
            <div className="bg-primary-500 p-1 border-2 border-black">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="flex-1 grid lg:grid-cols-2 gap-3 min-h-0 overflow-hidden">
        {/* Left: Instructions + Editor */}
        <div className="flex flex-col gap-3 min-h-0">
          {/* Instructions */}
          <div className="bg-white border-2 border-black p-3 flex-shrink-0">
            <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Instructions</p>
            <p className="text-sm leading-relaxed">{exercise.instructions}</p>
          </div>

          {/* Editor */}
          <div className="flex-1 border-2 border-black bg-gray-900 flex flex-col min-h-[250px]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-black text-white text-xs">
              <span className="font-bold uppercase">Editor</span>
              <div className="flex items-center gap-1">
                <button onClick={() => { setCode(exercise.starterCode); setFeedback(null); }} className="p-1 hover:bg-gray-700" title="Reset">
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  padding: { top: 8 },
                }}
              />
            </div>
          </div>

          {/* Actions - 3 buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              {isValidating ? <Loader className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              Check
            </button>
            <button
              onClick={handleGetHint}
              disabled={isLoadingHint}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              {isLoadingHint ? <Loader className="w-3 h-3 animate-spin" /> : <Lightbulb className="w-3 h-3" />}
              Hint
            </button>
          </div>
        </div>

        {/* Right: Preview + Feedback */}
        <div className="flex flex-col gap-3 min-h-0 overflow-hidden">
          {/* Feedback */}
          {feedback && (
            <div className={`p-3 border-2 flex items-start gap-2 flex-shrink-0 ${feedback.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              {feedback.isCorrect ? <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />}
              <div>
                <p className={`font-bold text-xs uppercase ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {feedback.isCorrect ? 'Correct!' : 'Not quite'}
                </p>
                <p className={`text-xs ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p>
              </div>
            </div>
          )}

          {/* Hint */}
          {showHint && hint && (
            <div className="p-3 border-2 border-yellow-500 bg-yellow-50 flex items-start gap-2 flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700">{hint}</p>
            </div>
          )}

          {/* Preview */}
          <div className="flex-1 border-2 border-black flex flex-col min-h-[200px]">
            <div className="px-3 py-1.5 bg-gray-100 border-b-2 border-black">
              <span className="text-xs font-bold uppercase">Preview</span>
            </div>
            <div className="flex-1 bg-white relative min-h-[150px]">
              <LivePreview code={code} />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between flex-shrink-0">
            {prevExercise ? (
              <Link to={`/exercise/${prevExercise.id}`} className="btn-secondary text-xs py-1.5 inline-flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Prev
              </Link>
            ) : <div />}
            {nextExercise ? (
              <Link to={`/exercise/${nextExercise.id}`} className="btn-primary text-xs py-1.5 inline-flex items-center gap-1">
                Next <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <Link to={`/lesson/${lesson.id}`} className="btn-primary text-xs py-1.5 inline-flex items-center gap-1">
                Back <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Success modal - celebratory */}
      {completed && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-8 text-center max-w-sm animate-pop shadow-brutal">
            {/* Confetti effect */}
            <div className="text-6xl mb-4">🎉</div>

            <h2 className="text-2xl font-black mb-2 uppercase text-green-600">Well Done!</h2>
            <p className="text-gray-600 mb-4">You completed this exercise</p>

            {/* XP Badge */}
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
                onClick={() => setCompleted(false)}
                className="text-sm text-gray-500 hover:text-black underline"
              >
                Stay on this exercise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
