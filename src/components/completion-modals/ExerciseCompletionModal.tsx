import { ArrowRight, BookOpen } from 'lucide-react';
import { CompletionModalBase } from './CompletionModalBase';

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
          <a
            href={`/exercise/${nextExerciseId}`}
            className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-2.5 px-4 rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors text-sm"
          >
            Next Exercise <ArrowRight className="w-4 h-4" />
          </a>
        ) : (
          <a
            href={`/lesson/${lessonId}`}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-2.5 px-4 rounded-lg border-2 border-gray-900 hover:bg-gray-800 transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4" /> Continue
          </a>
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
