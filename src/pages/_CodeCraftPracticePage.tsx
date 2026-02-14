import { useState, useCallback, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  Loader,
  Play,
  RotateCcw,
  Sparkles,
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

interface CodeCraftPracticePageProps {
  language: typeof supportedLanguages[number];
}

type PracticeState = 
  | { type: 'selection' }
  | { type: 'loading' }
  | { type: 'exercise'; exercise: LanguageExercise };

const difficultyConfig = {
  easy: {
    label: 'Easy',
    description: 'Basic syntax, simple operations',
    xp: 50,
    color: 'text-green-600 bg-green-50 border-green-500 hover:bg-green-100',
  },
  medium: {
    label: 'Medium',
    description: 'Combine 2-3 concepts',
    xp: 75,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-500 hover:bg-yellow-100',
  },
  hard: {
    label: 'Hard',
    description: 'Algorithm design, complex problems',
    xp: 100,
    color: 'text-red-600 bg-red-50 border-red-500 hover:bg-red-100',
  },
};

function CodeCraftPracticePageContent({ language }: CodeCraftPracticePageProps) {
  const { isGuest, addXp, user } = useUser();
  const [state, setState] = useState<PracticeState>({ type: 'selection' });
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wait for auth to be determined before allowing generation
  useEffect(() => {
    // Auth check is handled by isGuest
  }, [user]);

  const handleGenerate = async (difficulty: 'easy' | 'medium' | 'hard') => {
    if (isGuest) {
      setError('Log in to generate practice exercises!');
      return;
    }

    setState({ type: 'loading' });
    setError(null);

    try {
      const result = await api.generateExercise(language.id, difficulty);
      setState({ type: 'exercise', exercise: result.exercise });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate exercise');
      setState({ type: 'selection' });
    }
  };

  const handleValidateSuccess = useCallback(() => {
    if (state.type === 'exercise') {
      addXp(state.exercise.xpReward);
      setCompleted(true);
    }
  }, [state, addXp]);

  const handleGenerateAnother = () => {
    setState({ type: 'selection' });
    setCompleted(false);
    setError(null);
  };

  const currentExercise = state.type === 'exercise' ? state.exercise : null;

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
    exercise: currentExercise,
    languageId: language.id,
    storagePrefix: 'codecraft-practice',
    onValidateSuccess: handleValidateSuccess,
  });

  // Selection State
  if (state.type === 'selection') {
    return (
      <div className="page-enter">
        <Breadcrumb items={[
          { label: 'CodeCraft', href: '/codecraft' },
          { label: language.name, href: `/codecraft/${language.id}` },
          { label: 'Practice' },
        ]} />

        <PageTitle>
          <h1 className="text-2xl font-black text-gray-900 uppercase">Practice Mode</h1>
        </PageTitle>

        <p className="text-gray-600 mb-6">
          Generate unlimited AI-powered exercises for {language.name}. Choose your difficulty level.
        </p>

        {error && (
          <div className="mb-6 p-4 border-2 border-red-500 bg-red-50 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {(Object.keys(difficultyConfig) as Array<keyof typeof difficultyConfig>).map((diff) => (
            <button
              key={diff}
              onClick={() => handleGenerate(diff)}
              className={`p-6 border-2 rounded-lg text-left transition-colors ${difficultyConfig[diff].color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-black uppercase">{difficultyConfig[diff].label}</span>
                <span className="text-xs font-bold">+{difficultyConfig[diff].xp} XP</span>
              </div>
              <p className="text-sm opacity-80">{difficultyConfig[diff].description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2">
          <NavButton
            href={`/codecraft/${language.id}`}
            label="Back to Exercises"
            variant="outline"
            icon="arrow"
          />
        </div>
      </div>
    );
  }

  // Loading State
  if (state.type === 'loading') {
    return (
      <div className="page-enter">
        <Breadcrumb items={[
          { label: 'CodeCraft', href: '/codecraft' },
          { label: language.name, href: `/codecraft/${language.id}` },
          { label: 'Practice' },
        ]} />

        <div className="flex flex-col items-center justify-center h-96">
          <Loader className="w-12 h-12 animate-spin text-primary-600 mb-4" />
          <p className="text-gray-600 font-bold">Generating exercise...</p>
          <p className="text-gray-500 text-sm">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // Exercise State
  const exercise = state.exercise;

  return (
    <div className="page-enter pb-20 lg:pb-0">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'CodeCraft', href: '/codecraft' },
        { label: language.name, href: `/codecraft/${language.id}` },
        { label: 'Practice' },
      ]} />

      {/* Title + Badges */}
      <div className="mb-4 lg:mb-6">
        <PageTitle>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-black text-gray-900 uppercase">{exercise.title}</h1>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border-2 ${difficultyConfig[exercise.difficulty].color}`}>
              {exercise.difficulty}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border-2 border-primary-200 bg-primary-50 text-primary-600">
              +{exercise.xpReward} XP
            </span>
          </div>
        </PageTitle>
        <p className="text-gray-600 mt-1">{exercise.description}</p>
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
        <div className="flex flex-col gap-4 lg:h-[calc(100vh-200px)]">
          {/* Editor - Takes most space */}
          <div className="flex-1 min-h-[400px]">
            <CodeCraftEditor
              code={code}
              languageId={language.id}
              isCodeDirty={isCodeDirty}
              onChange={handleCodeChange}
              onReset={handleResetCode}
              className="h-full"
            />
          </div>

          {/* Output Panel */}
          <div className={`border-2 border-gray-300 bg-gray-900 rounded-lg flex flex-col transition-all duration-300 ${output ? 'h-48' : 'h-12'}`}>
            <div className="px-4 py-2 bg-gray-800 border-b-2 border-gray-300 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-white">Output</span>
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
              disabled={isValidating}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-primary-600 text-white rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors"
            >
              {isValidating ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Validate
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
            <button
              onClick={handleGenerateAnother}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-bold bg-accent-600 text-white rounded-lg border-2 border-accent-600 hover:bg-accent-700 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate Another
            </button>
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
            disabled={isValidating}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold bg-primary-600 text-white rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors flex-1 justify-center min-h-[44px]"
          >
            {isValidating ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            <span className="hidden sm:inline">Validate</span>
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
              <h2 className="text-2xl font-black text-gray-900 uppercase">Exercise Complete!</h2>
              <p className="text-gray-600 mt-2">Great job! You earned {exercise.xpReward} XP.</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleGenerateAnother}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-accent-600 text-white rounded-lg border-2 border-accent-600 hover:bg-accent-700 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Generate Another
              </button>
              <NavButton
                href={`/codecraft/${language.id}`}
                label={`Back to ${language.name}`}
                variant="outline"
                icon="none"
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
      {currentExercise && (
        <CodeCraftChat
          language={language}
          exercise={currentExercise}
          code={code}
        />
      )}
    </div>
  );
}

// Wrapper component with UserProvider
export default function CodeCraftPracticePageWrapper(props: CodeCraftPracticePageProps) {
  return (
    <UserProvider>
      <CodeCraftPracticePageContent {...props} />
    </UserProvider>
  );
}
