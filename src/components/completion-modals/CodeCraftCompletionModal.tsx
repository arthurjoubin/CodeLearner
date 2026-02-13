import { NavButton } from '../NavButton';
import { CompletionModalBase } from './CompletionModalBase';

interface CodeCraftCompletionModalProps {
  isOpen: boolean;
  alreadyCompleted: boolean;
  hasNextExercise: boolean;
  nextExerciseUrl?: string;
  languageUrl: string;
  onStay: () => void;
}

export function CodeCraftCompletionModal({
  isOpen,
  alreadyCompleted,
  hasNextExercise,
  nextExerciseUrl,
  languageUrl,
  onStay,
}: CodeCraftCompletionModalProps) {
  return (
    <CompletionModalBase
      isOpen={isOpen}
      title={alreadyCompleted ? 'Already Completed!' : 'Exercise Complete!'}
      emoji={alreadyCompleted ? '✅' : '🎉'}
    >
      <p className="text-gray-600 mb-4 text-sm">
        {alreadyCompleted
          ? "You've already completed this exercise."
          : 'Great job! You earned experience points.'}
      </p>
      <div className="flex flex-col gap-2">
        {hasNextExercise && nextExerciseUrl && (
          <NavButton
            href={nextExerciseUrl}
            label="Next Exercise"
            variant="primary"
            icon="arrow"
          />
        )}
        <NavButton
          href={languageUrl}
          label="All Exercises"
          variant="dark"
          icon="book"
        />
        <button
          onClick={onStay}
          className="w-full py-2.5 px-5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase"
        >
          Stay Here
        </button>
      </div>
    </CompletionModalBase>
  );
}
