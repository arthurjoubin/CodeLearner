import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { LanguageExercise } from '../types';
import { useUser } from '../context/UserContext';

interface UseCodeCraftExerciseOptions {
  exercise: LanguageExercise | null;
  languageId: string;
  storagePrefix: string;
  onValidateSuccess?: () => void;
}

export function useCodeCraftExercise({
  exercise,
  languageId,
  storagePrefix,
  onValidateSuccess,
}: UseCodeCraftExerciseOptions) {
  const { isGuest } = useUser();

  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isCodeDirty, setIsCodeDirty] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Load code
  useEffect(() => {
    if (exercise) {
      const savedCode = localStorage.getItem(`${storagePrefix}_${exercise.id}`);
      setCode(savedCode || exercise.starterCode);
      setFeedback(null);
      setShowHint(false);
      setHint('');
      setAttemptCount(0);
      setIsCodeDirty(false);
      setOutput('');
    }
  }, [exercise?.id, storagePrefix]);

  // Auto-save
  useEffect(() => {
    if (exercise && isCodeDirty) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`${storagePrefix}_${exercise.id}`, code);
        setIsCodeDirty(false);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [code, exercise, isCodeDirty, storagePrefix]);

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
  }, [code, exercise, languageId]);

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
    setIsCodeDirty(true);
  }, []);

  const handleRun = useCallback(async () => {
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
      const result = await api.executeCode(code, languageId);
      setOutput(result.stdout || result.stderr || 'No output');
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Failed to run code'}`);
    } finally {
      setIsRunning(false);
    }
  }, [code, exercise, isGuest, isRunning, languageId]);

  const handleValidate = useCallback(async () => {
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
        setFeedback({ isCorrect: true, message: result.feedback || 'Great job!' });
        onValidateSuccess?.();
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
        setFeedback({ isCorrect: true, message: 'Correct!' });
        onValidateSuccess?.();
      } else {
        setFeedback({
          isCorrect: false,
          message: 'Make sure your code produces the expected output.',
        });
      }
    } finally {
      setIsValidating(false);
    }
  }, [code, exercise, isGuest, isValidating, onValidateSuccess]);

  const handleGetHint = useCallback(async () => {
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
  }, [code, exercise, isGuest, attemptCount, isLoadingHint]);

  const handleResetCode = useCallback(() => {
    if (exercise) {
      setCode(exercise.starterCode);
      localStorage.removeItem(`${storagePrefix}_${exercise.id}`);
      setIsCodeDirty(false);
      setFeedback(null);
      setOutput('');
    }
  }, [exercise, storagePrefix]);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  const clearHint = useCallback(() => {
    setShowHint(false);
    setHint('');
  }, []);

  return {
    // States
    code,
    isValidating,
    feedback,
    showHint,
    hint,
    isLoadingHint,
    attemptCount,
    isCodeDirty,
    output,
    isRunning,

    // Handlers
    handleCodeChange,
    handleRun,
    handleValidate,
    handleGetHint,
    handleResetCode,
    clearFeedback,
    clearHint,
  };
}
