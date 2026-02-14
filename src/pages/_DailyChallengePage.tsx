import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  Loader,
  Play,
  RotateCcw,
  Calendar,
  History,
} from 'lucide-react';
import { useUser, UserProvider } from '../context/UserContext';
import { useCodeCraftExercise } from '../hooks/useCodeCraftExercise';
import { CodeCraftEditor } from '../components/CodeCraftEditor';
import { LanguageExercise } from '../types';
import { supportedLanguages } from '../data/language-exercises';
import Breadcrumb from '../components/Breadcrumb';
import { PageTitle } from '../components/PageTitle';
import { NavButton } from '../components/NavButton';
import CodeCraftChat from '../components/CodeCraftChat';
import { api } from '../services/api';

interface DailyChallengeData {
  date: string;
  exercise: LanguageExercise;
}

const difficultyColors = {
  easy: 'text-green-600 bg-green-50 border-green-500',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-500',
  hard: 'text-red-600 bg-red-50 border-red-500',
};

function CodeCraftDailyPageContent() {
  const { isGuest, isExerciseCompleted, completeExercise, addXp, user, loading: userLoading } = useUser();
  const [challenge, setChallenge] = useState<DailyChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [challengeDate, setChallengeDate] = useState<string | null>(null);

  useEffect(() => {
    // Get date from URL params
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get('date');
    setChallengeDate(dateParam);
  }, []);

  useEffect(() => {
    // Wait for auth state to be determined
    if (userLoading) {
      return; // Still loading auth state
    }

    if (isGuest) {
      setError('Log in to access the daily challenge!');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchDaily = async () => {
      try {
        let result;
        if (challengeDate) {
          // Fetch specific date challenge
          result = await api.getDailyChallengeByDate(challengeDate);
        } else {
          // Fetch today's challenge
          result = await api.getDailyChallenge();
        }
        if (!cancelled) {
          setChallenge(result);
          // Check if already completed
          if (isExerciseCompleted(`daily-${result.date}`)) {
            setCompleted(true);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load daily challenge');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDaily();

    return () => {
      cancelled = true;
    };
  }, [isGuest, isExerciseCompleted, user, userLoading, challengeDate]);

  const handleValidateSuccess = useCallback(() => {
    if (challenge) {
      const exerciseId = `daily-${challenge.date}`;
      if (!isExerciseCompleted(exerciseId)) {
        completeExercise(exerciseId);
        addXp(75);
      }
      setCompleted(true);
    }
  }, [challenge, isExerciseCompleted, completeExercise, addXp]);

  const {
    code,
    isValidating,
    feedback,
    showHint,
    hint,
    isLoadingHint,
    isCodeDirty,
    output,
    isRunning,
    handleCodeChange,
    handleRun,
    handleValidate,
    handleGetHint,
    handleResetCode,
    clearFeedback,
    clearHint,
  } = useCodeCraftExercise({
    exercise: challenge?.exercise || null,
    languageId: challenge?.exercise.language || 'python',
    storagePrefix: 'codecraft-daily',
    onValidateSuccess: handleValidateSuccess,
  });

  // Loading State
  if (loading) {
    return (
      <div className="page-enter">
        <Breadcrumb items={[
          { label: 'Daily Challenge', href: '/codecraft' },
          { label: 'Daily Challenge' },
        ]} />

        <div className="flex flex-col items-center justify-center h-96">
          <Loader className="w-12 h-12 animate-spin text-primary-600 mb-4" />
          <p className="text-gray-600 font-bold">Loading daily challenge...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !challenge) {
    return (
      <div className="page-enter">
        <Breadcrumb items={[
          { label: 'Daily Challenge', href: '/codecraft' },
          { label: 'Daily Challenge' },
        ]} />

        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-red-600 font-bold mb-4">{error || 'Failed to load daily challenge'}</p>
          <NavButton
            href="/codecraft"
            label="Back to CodeCraft"
            variant="outline"
            icon="arrow"
          />
        </div>
      </div>
    );
  }

  const exercise = challenge.exercise;
  const language = supportedLanguages.find(l => l.id === exercise.language);
  const alreadyCompleted = isExerciseCompleted(`daily-${challenge.date}`);

  return (
    <div className="page-enter pb-20 lg:pb-0">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Daily Challenge', href: '/codecraft' },
        { label: 'Daily Challenge' },
      ]} />

      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <div className="flex items-start justify-between gap-4">
          <PageTitle className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <Calendar className="w-6 h-6 text-primary-600" />
              <h1 className="text-xl font-black text-gray-900 uppercase">Daily Challenge</h1>
              <span className="text-sm text-gray-500">{challenge.date}</span>
            </div>
          </PageTitle>
          <a
            href="/codecraft/daily-history"
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-accent-50 border-2 border-accent-200 rounded-lg hover:bg-accent-100 hover:border-accent-300 transition-all group flex-shrink-0"
          >
            <History className="w-4 h-4 text-accent-600" />
            <span className="text-xs font-bold text-accent-700">History</span>
          </a>
        </div>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {language && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border-2 bg-gray-100 text-gray-700 border-gray-300">
              {language.name}
            </span>
          )}
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border-2 ${difficultyColors[exercise.difficulty]}`}>
            {exercise.difficulty}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border-2 border-primary-200 bg-primary-50 text-primary-600">
            +75 XP
          </span>
          {alreadyCompleted && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border-2 text-green-600 bg-green-50 border-green-500">
              Completed Today
            </span>
          )}
          <a
            href="/codecraft/daily-history"
            className="sm:hidden inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border-2 border-accent-200 bg-accent-50 text-accent-700 hover:bg-accent-100 transition-colors ml-auto"
          >
            <History className="w-3 h-3" />
            History
          </a>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mt-3">{exercise.title}</h2>
        <p className="text-gray-600">{exercise.description}</p>
      </div>

      {/* Main Layout - Side by side on desktop */}
      <div className="grid lg:grid-cols-[400px_1fr] gap-4 lg:gap-6">
        {/* Left Panel - Problem Description */}
        <div className="flex flex-col gap-4 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-2">
          {/* Instructions */}
          <div className="border-2 border-gray-300 bg-white rounded-lg p-4">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Instructions</p>
            <p className="text-sm leading-relaxed text-gray-700">{exercise.instructions}</p>
          </div>

          {/* Expected Output */}
          {exercise.expectedOutput && (
            <div className="border-2 border-gray-300 bg-gray-900 rounded-lg p-4">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Expected Output</p>
              <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">{exercise.expectedOutput}</pre>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className={`hidden lg:flex p-4 border-2 items-start gap-3 rounded-lg ${feedback.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              {feedback.isCorrect ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
              <div>
                <p className={`font-bold text-sm uppercase ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {feedback.isCorrect ? 'Correct!' : 'Not quite'}
                </p>
                <p className={`text-sm ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p>
              </div>
            </div>
          )}

          {/* Hint */}
          {showHint && hint && (
            <div className="hidden lg:flex p-4 border-2 border-yellow-500 bg-yellow-50 items-start gap-3 rounded-lg">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700 flex-1">{hint}</p>
              <button onClick={clearHint} className="p-1.5 hover:bg-black/10 rounded flex-shrink-0">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Editor & Output */}
        <div className="flex flex-col gap-4 min-h-[calc(100vh-280px)] lg:min-h-[calc(100vh-200px)] pb-20 lg:pb-0">
          {/* Editor - Takes available space */}
          <div className="flex-1 min-h-[300px] lg:min-h-[400px]">
            <CodeCraftEditor
              code={code}
              languageId={exercise.language}
              isCodeDirty={isCodeDirty}
              onChange={handleCodeChange}
              onReset={handleResetCode}
              className="h-full"
            />
          </div>

          {/* Output Panel - Expands when there's output */}
          <div className={`border-2 border-gray-300 bg-gray-900 rounded-lg flex flex-col transition-all duration-300 ${output ? 'min-h-[200px] h-[200px]' : 'min-h-[48px] h-[48px]'}`}>
            <div className="px-4 py-2 bg-gray-800 border-b-2 border-gray-300 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-bold uppercase text-white">Output</span>
              {output && (
                <button 
                  onClick={() => {/* Add clear output functionality if needed */}}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex-1 p-4 overflow-auto">
              {output ? (
                <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">{output}</pre>
              ) : (
                <p className="text-sm text-gray-500 italic">Run your code to see output here...</p>
              )}
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-gray-100 text-gray-900 rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-colors"
            >
              {isRunning ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Run
            </button>
            <button
              onClick={handleValidate}
              disabled={isValidating || alreadyCompleted}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary-600 text-white rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isValidating ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {alreadyCompleted ? 'Already Completed' : 'Validate'}
            </button>
            <button
              onClick={handleGetHint}
              disabled={isLoadingHint}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-bold bg-gray-100 text-gray-900 rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-colors"
            >
              {isLoadingHint ? <Loader className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
              Hint
            </button>
            <button
              onClick={handleResetCode}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-bold bg-gray-100 text-gray-900 rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <div className="flex-1"></div>
            <NavButton
              href="/codecraft"
              label="Back"
              variant="outline"
              icon="arrow"
            />
          </div>
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
            <button onClick={clearFeedback} className="p-1.5 hover:bg-black/10 rounded flex-shrink-0">
              <XCircle className="w-4 h-4" />
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
            <button onClick={clearHint} className="p-1.5 hover:bg-black/10 rounded flex-shrink-0">
              <XCircle className="w-4 h-4" />
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
          </button>
          <button
            onClick={handleValidate}
            disabled={isValidating || alreadyCompleted}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold bg-primary-600 text-white rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors flex-1 justify-center min-h-[44px] disabled:opacity-50"
          >
            {isValidating ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            <span className="hidden sm:inline">{alreadyCompleted ? 'Completed' : 'Validate'}</span>
          </button>
          <button
            onClick={handleGetHint}
            disabled={isLoadingHint}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold bg-gray-100 text-gray-900 rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-colors min-h-[44px]"
          >
            {isLoadingHint ? <Loader className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Completion Modal */}
      {completed && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gray-300 rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">🎉</div>
              <h2 className="text-2xl font-black text-gray-900 uppercase">Daily Challenge Complete!</h2>
              <p className="text-gray-600 mt-2">
                {alreadyCompleted 
                  ? "You've already completed today's challenge. Come back tomorrow!"
                  : "Great job! You earned 75 XP. See you tomorrow!"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <NavButton
                href="/codecraft"
                label="Back to CodeCraft"
                variant="primary"
                icon="arrow"
              />
              <button
                onClick={() => setCompleted(false)}
                className="w-full py-2.5 px-5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase"
              >
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat */}
      {language && (
        <CodeCraftChat
          language={language}
          exercise={exercise}
          code={code}
        />
      )}
    </div>
  );
}

// Wrapper component with UserProvider
export default function CodeCraftDailyPageWrapper() {
  return (
    <UserProvider>
      <CodeCraftDailyPageContent />
    </UserProvider>
  );
}
