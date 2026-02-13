import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  Loader,
  RotateCcw,
  Maximize,
  X,
  Play,
} from 'lucide-react';
import { useUser, UserProvider } from '../context/UserContext';
import { api } from '../services/api';
import { LanguageExercise } from '../types';
import { supportedLanguages, getExercisesByLanguage } from '../data/language-exercises';
import Breadcrumb from '../components/Breadcrumb';
import { PageTitle } from '../components/PageTitle';
import { NavButton } from '../components/NavButton';
import { CodeCraftCompletionModal } from '../components/completion-modals';
import CodeCraftChat from '../components/CodeCraftChat';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeCraftExercisePageProps {
  language: typeof supportedLanguages[number] | undefined;
  exercise: LanguageExercise | undefined;
}

const languageExtensions: Record<string, any> = {
  python: python(),
  javascript: javascript(),
  typescript: javascript({ jsx: true }),
  rust: [],
  go: [],
};

const difficultyColors = {
  easy: 'text-green-600 bg-green-50 border-green-500',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-500',
  hard: 'text-red-600 bg-red-50 border-red-500',
};

function CodeCraftExercisePageContent({
  language,
  exercise,
}: CodeCraftExercisePageProps) {
  const { user, isGuest, completeExercise, isExerciseCompleted } = useUser();

  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isCodeDirty, setIsCodeDirty] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Output panel states
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Get navigation
  const exercises = language ? getExercisesByLanguage(language.id) : [];
  const currentIndex = exercise ? exercises.findIndex(e => e.id === exercise.id) : -1;
  const nextExercise = exercises[currentIndex + 1];
  const previousExercise = exercises[currentIndex - 1];
  const alreadyCompleted = exercise && user ? isExerciseCompleted(exercise.id) : false;

  // Load code
  useEffect(() => {
    if (exercise) {
      const savedCode = localStorage.getItem(`codecraft_${exercise.id}`);
      setCode(savedCode || exercise.starterCode);
      setFeedback(null);
      setShowHint(false);
      setHint('');
      setAttemptCount(0);
      setCompleted(false);
      setIsCodeDirty(false);
      setIsExpanded(false);
      setOutput('');
    }
  }, [exercise?.id]);

  // Auto-save
  useEffect(() => {
    if (exercise && isCodeDirty) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`codecraft_${exercise.id}`, code);
        setIsCodeDirty(false);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [code, exercise, isCodeDirty]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          handleValidate();
        } else {
          handleRun();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, exercise]);

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
    setIsCodeDirty(true);
  }, []);

  const handleRun = async () => {
    if (!exercise || isRunning) return;

    if (isGuest) {
      setFeedback({
        isCorrect: false,
        message: 'Log in to run your code and save your progress!'
      });
      return;
    }

    setIsRunning(true);
    setOutput('');
    setFeedback(null);

    try {
      const result = await api.executeCode(code, language?.id || 'python');
      setOutput(result.stdout || result.stderr || 'No output');
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Failed to run code'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleValidate = async () => {
    if (!exercise || isValidating) return;

    if (isGuest) {
      setFeedback({
        isCorrect: false,
        message: 'Log in to validate your code and save your progress!'
      });
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
        }
        setFeedback({ isCorrect: true, message: result.feedback || 'Great job!' });
        setCompleted(true);
      } else {
        setFeedback({
          isCorrect: false,
          message: result.feedback || 'Not quite. Try again!',
        });
      }
    } catch {
      const hasExpectedOutput = exercise.expectedOutput &&
        code.toLowerCase().includes(exercise.expectedOutput.toLowerCase());

      if (hasExpectedOutput) {
        if (!alreadyCompleted) {
          completeExercise(exercise.id);
        }
        setFeedback({ isCorrect: true, message: 'Correct!' });
        setCompleted(true);
      } else {
        setFeedback({
          isCorrect: false,
          message: 'Make sure your code produces the expected output.',
        });
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleGetHint = async () => {
    if (!exercise || isLoadingHint) return;

    if (isGuest) {
      setHint('Log in to get AI hints!');
      setShowHint(true);
      return;
    }

    setIsLoadingHint(true);
    try {
      const hintText = await api.getHint(
        code,
        { instructions: exercise.instructions, hints: exercise.hints },
        attemptCount
      );
      setHint(hintText);
      setShowHint(true);
    } catch {
      const fallbackHint = exercise.hints[Math.min(attemptCount, exercise.hints.length - 1)];
      if (fallbackHint) {
        setHint(fallbackHint);
        setShowHint(true);
      }
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleResetCode = () => {
    if (exercise) {
      setCode(exercise.starterCode);
      localStorage.removeItem(`codecraft_${exercise.id}`);
      setIsCodeDirty(false);
      setFeedback(null);
      setOutput('');
    }
  };

  if (!exercise || !language) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-500 font-bold">Exercise not found</p>
          <a href="/codecraft" className="text-primary-600 hover:underline text-xs font-bold uppercase mt-2 inline-block">
            Back to CodeCraft
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter pb-20 lg:pb-0">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'CodeCraft', href: '/codecraft' },
        { label: language.name, href: `/codecraft/${language.id}` },
        { label: exercise.title },
      ]} />

      {/* Title + Badges */}
      <div className="mb-4 lg:mb-6">
        <PageTitle>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-black text-gray-900 uppercase">{exercise.title}</h1>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border-2 ${difficultyColors[exercise.difficulty]}`}>
              {exercise.difficulty}
            </span>
            {alreadyCompleted && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border-2 text-primary-600 bg-primary-50 border-primary-500">
                Completed
              </span>
            )}
          </div>
        </PageTitle>
        <p className="text-gray-600 mt-1">{exercise.description}</p>
      </div>

      <div className="lg:flex-1 grid lg:grid-cols-2 gap-3 lg:gap-4">
        {/* Left Panel - Instructions + Editor */}
        <div className="flex flex-col gap-3 lg:gap-4">
          {/* Instructions Card */}
          <div className="border-2 border-gray-300 bg-white rounded-lg p-3 lg:p-4">
            <p className="text-xs font-bold text-gray-500 uppercase mb-1.5 lg:mb-2">Instructions</p>
            <p className="text-sm leading-relaxed text-gray-700">{exercise.instructions}</p>
          </div>

          {/* Expected Output */}
          {exercise.expectedOutput && (
            <div className="border-2 border-gray-300 bg-gray-900 rounded-lg p-3 lg:p-4">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1.5 lg:mb-2">Expected Output</p>
              <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">{exercise.expectedOutput}</pre>
            </div>
          )}

          {/* Feedback - Desktop */}
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

          {/* Hint - Desktop */}
          {showHint && hint && (
            <div className="hidden lg:flex p-4 border-2 border-yellow-500 bg-yellow-50 items-start gap-3 flex-shrink-0 rounded-lg">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700">{hint}</p>
              <button onClick={() => setShowHint(false)} className="p-1.5 hover:bg-black/10 rounded flex-shrink-0 ml-auto">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-gray-100 text-gray-900 rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-colors"
            >
              {isRunning ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Run
            </button>
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-primary-600 text-white rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors"
            >
              {isValidating ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Validate
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
              onClick={handleResetCode}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-gray-100 text-gray-900 rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-colors"
              title="Reset code to original"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Editor - Now below the buttons */}
          {isExpanded && (
            <div
              className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
              onClick={() => setIsExpanded(false)}
            />
          )}

          <div className={`${isExpanded ? 'fixed inset-2 sm:inset-4 lg:inset-8 z-50 bg-gray-900 shadow-2xl border-2 border-gray-300 flex flex-col' : 'border-2 border-gray-300 bg-gray-900 flex flex-col h-[300px] sm:h-[350px] lg:h-[400px]'}`}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gray-800 text-white">
              <span className="font-bold uppercase text-sm flex items-center gap-2">
                Editor {isCodeDirty && <span className="text-gray-400 font-normal normal-case">• unsaved</span>}
                {isExpanded && <span className="text-gray-400 font-normal normal-case ml-2">- Full Screen Mode</span>}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  title="Reset"
                >
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
                      <span className="font-bold text-sm">Close</span>
                    </>
                  ) : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 min-h-0">
              <CodeMirror
                value={code}
                height="100%"
                theme={oneDark}
                extensions={[languageExtensions[language.id] || []]}
                onChange={handleCodeChange}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: true,
                  highlightSpecialChars: true,
                  foldGutter: true,
                  dropCursor: true,
                  allowMultipleSelections: true,
                  indentOnInput: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                  rectangularSelection: true,
                  crosshairCursor: true,
                  highlightActiveLine: true,
                  highlightSelectionMatches: true,
                  closeBracketsKeymap: true,
                  defaultKeymap: true,
                  searchKeymap: true,
                  historyKeymap: true,
                  foldKeymap: true,
                  completionKeymap: true,
                  lintKeymap: true,
                }}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="hidden lg:flex items-center gap-2 pt-2">
            {previousExercise && (
              <NavButton
                href={`/codecraft/${language.id}/${previousExercise.id}`}
                label="Previous"
                variant="outline"
                icon="none"
              />
            )}
            <NavButton
              href={`/codecraft/${language.id}`}
              label="All Exercises"
              variant="outline"
              icon="none"
            />
            {nextExercise && (
              <NavButton
                href={`/codecraft/${language.id}/${nextExercise.id}`}
                label="Next"
                variant="dark"
                icon="arrow"
              />
            )}
          </div>
        </div>

        {/* Right Panel - Output Only */}
        <div className="flex flex-col gap-3 lg:gap-4">
          {/* Output Panel */}
          {output && (
            <div className="border-2 border-gray-300 bg-gray-900 rounded-lg flex flex-col h-[150px] sm:h-[180px] lg:h-auto lg:min-h-[150px]">
              <div className="px-3 sm:px-4 py-2 bg-gray-800 border-b-2 border-gray-300">
                <span className="text-xs font-bold uppercase text-white">Output</span>
              </div>
              <div className="flex-1 p-3 sm:p-4 overflow-auto">
                <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">{output}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Feedback Toast */}
      {feedback && !completed && (
        <div className={`lg:hidden fixed top-16 left-3 right-3 p-3 border-2 z-30 rounded-lg shadow-lg ${feedback.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <div className="flex items-start gap-2.5">
            {feedback.isCorrect ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-xs uppercase ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {feedback.isCorrect ? 'Correct!' : 'Not quite'}
              </p>
              <p className={`text-xs mt-0.5 ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p>
            </div>
            <button onClick={() => setFeedback(null)} className="p-1.5 hover:bg-black/10 rounded flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Hint Toast */}
      {showHint && hint && (
        <div className="lg:hidden fixed top-16 left-3 right-3 p-3 border-2 border-yellow-500 bg-yellow-50 z-30 rounded-lg shadow-lg">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-700 flex-1 leading-relaxed">{hint}</p>
            <button onClick={() => setShowHint(false)} className="p-1.5 hover:bg-black/10 rounded flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Fixed Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-2 sm:p-3 z-30 shadow-lg safe-area-pb">
        <div className="flex items-center gap-2 max-w-screen-xl mx-auto">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold bg-gray-100 text-gray-900 rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-colors min-h-[44px]"
          >
            {isRunning ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">Run</span>
          </button>
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold bg-primary-600 text-white rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors flex-1 justify-center min-h-[44px]"
          >
            {isValidating ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            <span className="hidden sm:inline">Validate</span>
            <span className="sm:hidden">Validate</span>
          </button>
          <button
            onClick={handleGetHint}
            disabled={isLoadingHint}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold bg-gray-100 text-gray-900 rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-colors min-h-[44px]"
          >
            {isLoadingHint ? <Loader className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
            <span className="hidden sm:inline">Hint</span>
          </button>
        </div>
      </div>

      {/* Completion Modal */}
      {completed && (
        <CodeCraftCompletionModal
          isOpen={true}
          alreadyCompleted={alreadyCompleted}
          hasNextExercise={!!nextExercise}
          nextExerciseUrl={nextExercise ? `/codecraft/${language.id}/${nextExercise.id}` : undefined}
          languageUrl={`/codecraft/${language.id}`}
          onStay={() => setCompleted(false)}
        />
      )}

      {/* AI Chat */}
      <CodeCraftChat
        language={language}
        exercise={exercise}
        code={code}
      />
    </div>
  );
}

// Wrapper component with UserProvider
export default function CodeCraftExercisePageWrapper(props: CodeCraftExercisePageProps) {
  return (
    <UserProvider>
      <CodeCraftExercisePageContent {...props} />
    </UserProvider>
  );
}
