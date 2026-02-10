import { BookOpen } from 'lucide-react';
import { CompletionModalBase } from './CompletionModalBase';
import { NavButton } from '../NavButton';

interface ExerciseCompletionModalProps {
  isOpen: boolean;
  alreadyCompleted: boolean;
  hasNextExercise: boolean;
  nextExerciseId?: string;
  lessonId: string;
  onStay: () => void;
}

export function ExerciseCompletionModal({
  isOpen,
  alreadyCompleted,
  hasNextExercise,
  nextExerciseId,
  lessonId,
  onStay
}: ExerciseCompletionModalProps) {
  return (
    <CompletionModalBase isOpen={isOpen} title="Well Done!">
      <p className="text-gray-600 mb-4 text-sm">
        {alreadyCompleted ? 'Exercise already completed' : 'You completed this exercise'}
      </p>

      <div className="flex flex-col gap-2">
        {hasNextExercise && nextExerciseId ? (
          <NavButton href={`/exercise/${nextExerciseId}`} label="Next Exercise" variant="primary" className="w-full" />
        ) : (
          <NavButton href={`/lesson/${lessonId}`} label="Continue" variant="dark" icon="book" className="w-full" />
        )}
        <button
          onClick={onStay}
          className="text-sm text-gray-500 hover:text-gray-900 font-medium py-2"
        >
          Stay on this exercise
        </button>
      </div>
    </CompletionModalBase>
  );
}
