import { useState, useEffect } from 'react';
// Link and useParams replaced for Astro compatibility

import { useUser, UserProvider } from '../context/UserContext';
import { getExercise, getModule, getLesson, getExercisesForLesson } from '../data/modules';
import { api } from '../services/api';
import { isQuizExercise, isCodeExercise } from '../types';
import Editor from '@monaco-editor/react';
import QuizPage from './_QuizPage';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Lightbulb,
  Loader,
  RotateCcw,
  Maximize,
  X,
  BookOpen,
} from 'lucide-react';
import LivePreview from '../components/LivePreview';
import GitSimulator from '../components/GitSimulator';
import Breadcrumb from '../components/Breadcrumb';

interface ExercisePageProps {
  exerciseId?: string;
}

function ExercisePageContent({ exerciseId }: ExercisePageProps) {
  const { user, isGuest, completeExercise, completeLesson, isExerciseCompleted, isLessonCompleted, loading } = useUser();

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
      <div className="loading-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!exercise || !lesson || !module) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-900 font-bold">Exercise not found</p>
        <a href="/" className="text-primary-600 underline font-bold uppercase text-xs">Go back home</a>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-900 font-bold">Please sign in to access this exercise</p>
        <a href="/" className="text-primary-600 underline font-bold uppercase text-xs">Go back home</a>
      </div>
    );
  }

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

  const simpleValidate = (code: string, solution: string): boolean => {
    const normalize = (s: string) => s.replace(/\s+/g, ' ').replace(/['"`]/g, '"').trim().toLowerCase();
    const normalizedCode = normalize(code);
    const normalizedSolution = normalize(solution);
    const solutionParts = normalizedSolution.split(/[;{}()]/g).filter(p => p.trim().length > 5);
    const matchedParts = solutionParts.filter(part => normalizedCode.includes(part.trim()));
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
          completeExercise(exercise.id);
          const otherExercises = lessonExercises.filter(e => e.id !== exercise.id);
          const allOthersDone = otherExercises.every(e => isExerciseCompleted(e.id));
          if (allOthersDone && lesson && !isLessonCompleted(lesson.id)) {
            completeLesson(lesson.id);
          }
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
      const isCorrect = simpleValidate(code, exercise.solution);

      if (isCorrect) {
        if (!alreadyCompleted) {
          completeExercise(exercise.id);
          const otherExercises = lessonExercises.filter(e => e.id !== exercise.id);
          const allOthersDone = otherExercises.every(e => isExerciseCompleted(e.id));
          if (allOthersDone && lesson && !isLessonCompleted(lesson.id)) {
            completeLesson(lesson.id);
          }
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
    <div className="page-enter">
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'React', href: '/learning-path/react' },
          { label: module.title, href: `/module/${module.id}` },
          { label: lesson.title, href: `/lesson/${lesson.id}` },
        ]} />
        <div className="flex items-center justify-between gap-4">
          <div className="relative inline-block group min-w-0 flex-1">
            <h1 className="text-xl font-bold text-gray-900 truncate">{exercise.title}</h1>
            <span className="absolute -bottom-0.5 left-0 w-12 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
          </div>

          <a
            href={`/lesson/${lesson.id}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back to lesson
          </a>
        </div>

        {alreadyCompleted && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-lg border border-primary-200 text-sm text-primary-700">
            <CheckCircle className="w-4 h-4" />
            <span>You've already completed this exercise</span>
          </div>
        )}
      </div>

      <div className="lg:flex-1 grid lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="border-2 border-gray-300 bg-white rounded-lg p-4">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Instructions</p>
            <p className="text-sm leading-relaxed text-gray-700">{exercise.instructions}</p>
          </div>

          {isExpanded && (
            <div
              className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
              onClick={() => setIsExpanded(false)}
            />
          )}

          <div className={`${isExpanded ? 'fixed inset-4 lg:inset-8 z-50 bg-gray-900 shadow-2xl border-2 border-gray-300 flex flex-col' : 'lg:flex-1 border-2 border-gray-300 bg-gray-900 flex flex-col h-[300px] lg:h-auto lg:min-h-[250px]'}`}>
            <div className={`flex items-center justify-between px-4 py-2 bg-gray-800 text-white text-sm ${isExpanded ? '' : ''}`}>
              <span className="font-bold uppercase flex items-center gap-2">
                Editor {isExpanded && <span className="text-gray-400 font-normal normal-case ml-2">- Full Screen Mode</span>}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => { setCode(exercise.starterCode); setFeedback(null); }} className="p-1.5 hover:bg-gray-700 rounded transition-colors" title="Reset">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`p-1.5 hover:bg-gray-700 flex items-center gap-1.5 ${isExpanded ? 'bg-red-600 hover:bg-red-700 px-2 rounded' : ''}`}
                  title={isExpanded ? "Close" : "Expand"}
                >
                  {isExpanded ? (
                    <>
                      <X className="w-4 h-4" />
                      <span className="font-bold">Close</span>
                    </>
                  ) : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              {module?.courseId === 'git' ? (
                <div className="w-full h-full bg-gray-900 flex flex-col font-mono text-sm">
                  <div className="px-3 py-2 bg-gray-800 text-gray-400 text-xs border-b border-gray-700">
                    Terminal - Git Commands
                  </div>
                  <div className="flex-1 p-3 overflow-auto">
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 select-none">$</span>
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-transparent text-gray-100 resize-none outline-none border-none p-0 font-mono text-sm leading-relaxed"
                        style={{ minHeight: '100%', tabSize: 2 }}
                        spellCheck={false}
                        placeholder="# Type your git command here..."
                      />
                    </div>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-primary-600 text-white rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors"
            >
              {isValidating ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Validate Code
            </button>
            <button
              onClick={handleGetHint}
              disabled={isLoadingHint}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-gray-100 text-gray-900 rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-colors"
            >
              {isLoadingHint ? <Loader className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
              Hint
            </button>
            <button
              onClick={() => { setCode(exercise.starterCode); setFeedback(null); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-gray-100 text-gray-900 rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-colors"
              title="Reset code to original"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:min-h-0">
          {feedback && (
            <div className={`hidden lg:flex p-4 border-2 items-start gap-3 flex-shrink-0 rounded-lg ${feedback.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              {feedback.isCorrect ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
              <div>
                <p className={`font-bold text-sm uppercase ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {feedback.isCorrect ? 'Correct!' : 'Not quite'}
                </p>
                <p className={`text-sm ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p>
              </div>
            </div>
          )}

          {showHint && hint && (
            <div className="hidden lg:flex p-4 border-2 border-yellow-500 bg-yellow-50 items-start gap-3 flex-shrink-0 rounded-lg">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700">{hint}</p>
            </div>
          )}

          <div className="lg:flex-1 border-2 border-gray-300 bg-white rounded-lg flex flex-col h-[200px] lg:h-auto lg:min-h-[200px]">
            <div className="px-4 py-2 bg-gray-100 border-b-2 border-gray-300">
              <span className="text-sm font-bold uppercase text-gray-800">
                {module?.courseId === 'git' ? 'Git Simulator' : 'Preview'}
              </span>
            </div>
            <div className="flex-1 bg-white relative overflow-auto">
              {module?.courseId === 'git' ? (
                <GitSimulator command={code} />
              ) : (
                <LivePreview code={code} />
              )}
            </div>
          </div>
        </div>
      </div>

      {feedback && !completed && (
        <div className={`lg:hidden fixed top-20 left-4 right-4 p-4 border-2 z-30 rounded-lg ${feedback.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <div className="flex items-start gap-3">
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

      {showHint && hint && (
        <div className="lg:hidden fixed top-20 left-4 right-4 p-4 border-2 border-yellow-500 bg-yellow-50 z-30 rounded-lg">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-700 flex-1">{hint}</p>
            <button onClick={() => setShowHint(false)} className="p-1 hover:bg-black/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-3 z-30 shadow-lg">
        <div className="flex items-center gap-2 max-w-screen-xl mx-auto">
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-primary-600 text-white rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors flex-1 justify-center"
          >
            {isValidating ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            Validate Code
          </button>
          <button
            onClick={handleGetHint}
            disabled={isLoadingHint}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-gray-100 text-gray-900 rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-colors"
          >
            {isLoadingHint ? <Loader className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
            Hint
          </button>
        </div>
      </div>

      {completed && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 text-center max-w-sm border-2 border-gray-300 shadow-xl">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-xl font-black uppercase text-green-600 mb-1">Well Done!</h2>
            <p className="text-gray-600 mb-4 text-sm">
              {alreadyCompleted ? 'Exercise already completed' : 'You completed this exercise'}
            </p>

            <div className="flex flex-col gap-2">
              {nextExercise ? (
                <a
                  href={`/exercise/${nextExercise.id}`}
                  className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-2.5 px-4 rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors"
                >
                  Next Exercise <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <a
                  href={`/lesson/${lesson.id}`}
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-2.5 px-4 rounded-lg border-2 border-gray-900 hover:bg-gray-800 transition-colors"
                >
                  <BookOpen className="w-4 h-4" /> Continue
                </a>
              )}
              <button
                onClick={() => setCompleted(false)}
                className="text-sm text-gray-500 hover:text-gray-900 font-medium"
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

export default function ExercisePage(props: ExercisePageProps) {
  return (
    <UserProvider>
      <ExercisePageContent {...props} />
    </UserProvider>
  );
}
