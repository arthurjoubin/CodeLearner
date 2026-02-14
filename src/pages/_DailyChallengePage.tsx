import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  Loader,
  Play,
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
import ReactMarkdown from './_ReactMarkdown';

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
  const [activeTab, setActiveTab] = useState<'instructions' | 'editor' | 'output'>('instructions');

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

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-2 border-gray-200 rounded-xl bg-white mt-4 p-1 shadow-sm sticky top-[72px] z-20">
        <button
          onClick={() => setActiveTab('instructions')}
          className={`flex-1 py-2 text-xs font-black uppercase tracking-tight rounded-lg transition-all ${activeTab === 'instructions' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Instructions
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2 text-xs font-black uppercase tracking-tight rounded-lg transition-all ${activeTab === 'editor' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Editor
        </button>
        <button
          onClick={() => setActiveTab('output')}
          className={`flex-1 py-2 text-xs font-black uppercase tracking-tight rounded-lg transition-all ${activeTab === 'output' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Output
        </button>
      </div>

      {/* Main Layout - Side by side on desktop */}
      <div className="grid lg:grid-cols-[400px_1fr] gap-4 lg:gap-6 mt-6">
        {/* Left Panel - Problem Description */}
        <div className={`flex flex-col gap-4 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-2 ${activeTab !== 'instructions' ? 'hidden lg:flex' : ''}`}>
          {/* Instructions */}
          <div className="border-2 border-gray-300 bg-white rounded-xl p-5 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Instructions</p>
            <ReactMarkdown content={exercise.instructions} />
          </div>

          {/* Expected Output */}
          {exercise.expectedOutput && (
            <div className="border-2 border-gray-900 bg-gray-900 rounded-xl p-5 shadow-lg">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Expected Output</p>
              <pre className="text-sm font-mono text-primary-400 whitespace-pre-wrap">{exercise.expectedOutput}</pre>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className={`p-5 border-2 items-start gap-4 rounded-xl shadow-sm ${feedback.isCorrect ? 'bg-primary-50 border-primary-500' : 'bg-red-50 border-red-500'} ${activeTab === 'instructions' ? 'flex' : 'hidden lg:flex'}`}>
              {feedback.isCorrect ? <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0" /> : <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />}
              <div>
                <p className={`font-black text-xs uppercase tracking-tight ${feedback.isCorrect ? 'text-primary-700' : 'text-red-700'}`}>
                  {feedback.isCorrect ? 'Correct!' : 'Not quite'}
                </p>
                <p className={`text-sm mt-1 font-medium ${feedback.isCorrect ? 'text-primary-600' : 'text-red-600'}`}>{feedback.message}</p>
              </div>
            </div>
          )}

          {/* Hint */}
          {showHint && hint && (
            <div className={`p-5 border-2 border-yellow-500 bg-yellow-50 items-start gap-4 rounded-xl shadow-sm ${activeTab === 'instructions' ? 'flex' : 'hidden lg:flex'}`}>
              <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-black text-yellow-700 uppercase tracking-tight mb-1">Hint</p>
                <div className="text-sm text-yellow-700 font-medium leading-relaxed">
                  <ReactMarkdown content={hint} />
                </div>
              </div>
              <button onClick={clearHint} className="p-1.5 hover:bg-yellow-200/50 rounded-lg transition-colors flex-shrink-0">
                <XCircle className="w-5 h-5 text-yellow-600" />
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Editor & Output */}
        <div className="flex flex-col gap-4 pb-20 lg:pb-0">
          {/* Editor */}
          <div className={`rounded-xl overflow-hidden border-2 border-gray-300 shadow-sm ${activeTab !== 'editor' ? 'hidden lg:block' : ''}`}>
            <CodeCraftEditor
              code={code}
              languageId={exercise.language}
              isCodeDirty={isCodeDirty}
              onChange={handleCodeChange}
              onReset={handleResetCode}
              className="h-[400px] lg:h-[280px]"
            />
          </div>

          {/* Action Buttons - Between Editor and Output */}
          <div className="hidden lg:flex items-center justify-center gap-4 py-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-black uppercase tracking-tight bg-white text-gray-900 rounded-xl border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              {isRunning ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Run
            </button>
            <button
              onClick={handleValidate}
              disabled={isValidating || alreadyCompleted}
              className="inline-flex items-center gap-2 px-10 py-3 text-sm font-black uppercase tracking-tight bg-primary-600 text-white rounded-xl border-2 border-primary-600 hover:bg-primary-700 hover:border-primary-700 transition-all duration-200 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none"
            >
              {isValidating ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {alreadyCompleted ? 'Completed' : 'Validate'}
            </button>
            <button
              onClick={handleGetHint}
              disabled={isLoadingHint}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-tight bg-white text-gray-600 rounded-xl border-2 border-gray-300 hover:border-yellow-500 hover:text-yellow-600 transition-all duration-200 shadow-sm"
            >
              {isLoadingHint ? <Loader className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
              Hint
            </button>
          </div>

          {/* Output Panel - Auto height based on content */}
          <div className={`border-2 border-gray-900 bg-gray-900 rounded-xl overflow-hidden shadow-lg ${activeTab !== 'output' ? 'hidden lg:block' : ''}`}>
            <div className="px-5 py-3 bg-gray-800/50 border-b-2 border-gray-800 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Output Terminal</span>
              {output && (
                <button 
                  onClick={() => {/* Add clear output functionality if needed */}}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="p-5 min-h-[120px]">
              {output ? (
                <pre className="text-sm font-mono text-primary-400 whitespace-pre-wrap leading-relaxed">{output}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-gray-600">
                  <Play className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest opacity-40">Ready to execute</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Feedback Toast */}
      {feedback && !completed && (
        <div className={`lg:hidden fixed top-16 left-3 right-3 p-3 border-2 z-30 rounded-lg shadow-lg ${feedback.isCorrect ? 'bg-primary-50 border-primary-500' : 'bg-red-50 border-red-500'}`}>
          <div className="flex items-start gap-2.5">
            {feedback.isCorrect ? <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-xs uppercase ${feedback.isCorrect ? 'text-primary-700' : 'text-red-700'}`}>
                {feedback.isCorrect ? 'Correct!' : 'Not quite'}
              </p>
              <p className={`text-xs mt-0.5 ${feedback.isCorrect ? 'text-primary-600' : 'text-red-600'}`}>{feedback.message}</p>
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
            onClick={() => { handleRun(); setActiveTab('output'); }}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold bg-gray-100 text-gray-900 rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-colors min-h-[44px]"
          >
            {isRunning ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => { handleValidate(); setActiveTab('output'); }}
            disabled={isValidating || alreadyCompleted}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold bg-primary-600 text-white rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors flex-1 justify-center min-h-[44px] disabled:opacity-50"
          >
            {isValidating ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            <span className="hidden sm:inline">{alreadyCompleted ? 'Completed' : 'Validate'}</span>
          </button>
          <button
            onClick={() => { handleGetHint(); setActiveTab('instructions'); }}
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
