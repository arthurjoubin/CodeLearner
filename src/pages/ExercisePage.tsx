import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getExercise, getModule, getLesson, getExercisesForLesson } from '../data/modules';
import { api } from '../services/api';
import { isQuizExercise, isCodeExercise } from '../types';
import Editor from '@monaco-editor/react';
import QuizPage from './QuizPage';
import {
  ArrowLeft,
  Send,
  CheckCircle,
  XCircle,
  Lightbulb,
  Star,
  Loader,
  RotateCcw,
  Maximize,
  X,
  ChevronDown,
  ChevronUp,
  List,
} from 'lucide-react';
import LivePreview from '../components/LivePreview';

export default function ExercisePage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { user, isGuest, addXp, completeExercise, isExerciseCompleted, loading } = useUser();

  const exercise = exerciseId ? getExercise(exerciseId) : undefined;
  const lesson = exercise ? getLesson(exercise.lessonId) : undefined;
  const module = exercise ? getModule(exercise.moduleId) : undefined;
  const lessonExercises = lesson ? getExercisesForLesson(lesson.id) : [];

  const [code, setCode] = useState((exercise && isCodeExercise(exercise)) ? exercise.starterCode : '');
  const [isValidating, setIsValidating] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExercisesDropdown, setShowExercisesDropdown] = useState(false);

  const alreadyCompleted = exerciseId ? isExerciseCompleted(exerciseId) : false;

  useEffect(() => {
    if (exercise && isCodeExercise(exercise)) {
      setCode(exercise.starterCode);
      setFeedback(null);
      setShowHint(false);
      setHint('');
      setAttemptCount(0);
      setCompleted(false);
      setIsExpanded(false);
    }
  }, [exercise?.id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!exercise || !lesson || !module) {
    return (
      <div className="text-center py-12">
        <p className="text-black font-bold">Exercise not found</p>
        <Link to="/" className="text-black underline font-bold uppercase">Go back home</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-black font-bold">Please sign in to access this exercise</p>
        <Link to="/" className="text-black underline font-bold uppercase">Go back home</Link>
      </div>
    );
  }

  // Route to QuizPage for quiz exercises
  if (isQuizExercise(exercise)) {
    return (
      <QuizPage
        exercise={exercise}
        lesson={lesson}
        lessonExercises={lessonExercises}
        isExerciseCompleted={isExerciseCompleted}
      />
    );
  }

  const currentIndex = lessonExercises.findIndex(e => e.id === exercise.id);
  const nextExercise = lessonExercises[currentIndex + 1];

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
    <div className="min-h-[calc(100vh-120px)] lg:h-[calc(100vh-120px)] flex flex-col page-enter pb-20 lg:pb-0">
      {/* Header compact */}
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
                    const exCompleted = exerciseId ? isExerciseCompleted(ex.id) : false;
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

      {/* Main grid */}
      <div className="lg:flex-1 grid lg:grid-cols-2 gap-3 lg:min-h-0">
        {/* Left: Instructions + Editor */}
        <div className="flex flex-col gap-3 lg:min-h-0">
          {/* Instructions */}
          <div className="bg-white border-2 border-black p-3 flex-shrink-0">
            <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Instructions</p>
            <p className="text-sm leading-relaxed">{exercise.instructions}</p>
          </div>

          {/* Backdrop for expanded mode */}
          {isExpanded && (
            <div
              className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
              onClick={() => setIsExpanded(false)}
            />
          )}

          {/* Editor */}
          <div className={`${isExpanded ? 'fixed inset-4 lg:inset-8 z-50 bg-gray-900 shadow-2xl border-4 border-black flex flex-col' : 'lg:flex-1 border-2 border-black bg-gray-900 flex flex-col h-[300px] lg:h-auto lg:min-h-[250px]'}`}>
            <div className={`flex items-center justify-between px-3 py-1.5 bg-black text-white text-xs ${isExpanded ? 'mb-0 py-3' : ''}`}>
              <span className="font-bold uppercase flex items-center gap-2">
                Editor {isExpanded && <span className="text-gray-400 font-normal normal-case">- Full Screen Mode</span>}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => { setCode(exercise.starterCode); setFeedback(null); }} className="p-1 hover:bg-gray-700" title="Reset">
                  <RotateCcw className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`p-1 hover:bg-gray-700 flex items-center gap-1 ${isExpanded ? 'bg-red-600 hover:bg-red-700 px-2' : ''}`}
                  title={isExpanded ? "Close" : "Expand"}
                >
                  {isExpanded ? (
                    <>
                      <X className="w-3 h-3" />
                      <span className="font-bold">Close</span>
                    </>
                  ) : <Maximize className="w-3 h-3" />}
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

          {/* Actions - Desktop only (mobile has fixed bar) */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="btn-primary py-2 px-4 flex items-center gap-2"
            >
              {isValidating ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Validate Code
            </button>
            <button
              onClick={handleGetHint}
              disabled={isLoadingHint}
              className="btn-secondary py-2 px-4 flex items-center gap-2"
            >
              {isLoadingHint ? <Loader className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
              Hint
            </button>
            <button
              onClick={() => { setCode(exercise.starterCode); setFeedback(null); }}
              className="btn-secondary py-2 px-4 flex items-center gap-2"
              title="Reset code to original"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Right: Preview + Feedback */}
        <div className="flex flex-col gap-3 lg:min-h-0">
          {/* Feedback - Desktop only (mobile has toast) */}
          {feedback && (
            <div className={`hidden lg:flex p-3 border-2 items-start gap-2 flex-shrink-0 ${feedback.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              {feedback.isCorrect ? <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />}
              <div>
                <p className={`font-bold text-xs uppercase ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {feedback.isCorrect ? 'Correct!' : 'Not quite'}
                </p>
                <p className={`text-xs ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p>
              </div>
            </div>
          )}

          {/* Hint - Desktop only (mobile has toast) */}
          {showHint && hint && (
            <div className="hidden lg:flex p-3 border-2 border-yellow-500 bg-yellow-50 items-start gap-2 flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700">{hint}</p>
            </div>
          )}

          {/* Preview */}
          <div className="lg:flex-1 border-2 border-black flex flex-col h-[200px] lg:h-auto lg:min-h-[200px]">
            <div className="px-3 py-1.5 bg-gray-100 border-b-2 border-black">
              <span className="text-xs font-bold uppercase">Preview</span>
            </div>
            <div className="flex-1 bg-white relative overflow-auto">
              <LivePreview code={code} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile toast for feedback */}
      {feedback && !completed && (
        <div className={`lg:hidden fixed top-20 left-4 right-4 p-3 border-2 z-30 shadow-brutal animate-pop ${feedback.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <div className="flex items-start gap-2">
            {feedback.isCorrect ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm uppercase ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {feedback.isCorrect ? 'Correct!' : 'Not quite'}
              </p>
              <p className={`text-sm ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p>
            </div>
            <button onClick={() => setFeedback(null)} className="p-1 hover:bg-black/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile toast for hint */}
      {showHint && hint && (
        <div className="lg:hidden fixed top-20 left-4 right-4 p-3 border-2 border-yellow-500 bg-yellow-50 z-30 shadow-brutal animate-pop">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-700 flex-1">{hint}</p>
            <button onClick={() => setShowHint(false)} className="p-1 hover:bg-black/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile fixed action bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black p-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-2 max-w-screen-xl mx-auto">
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="btn-primary flex-1 py-3 px-4 flex items-center justify-center gap-2 text-sm"
          >
            {isValidating ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Validate Code
          </button>
          <button
            onClick={handleGetHint}
            disabled={isLoadingHint}
            className="btn-secondary py-3 px-4 flex items-center justify-center gap-2 text-sm"
          >
            {isLoadingHint ? <Loader className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
            Hint
          </button>
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
