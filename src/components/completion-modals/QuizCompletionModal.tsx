import { CompletionModalBase } from './CompletionModalBase';
import { NavButton } from '../NavButton';

interface QuizCompletionModalProps {
  isOpen: boolean;
  correctCount: number;
  totalQuestions: number;
  alreadyCompleted: boolean;
  hasNextExercise: boolean;
  nextExerciseId?: string;
  lessonId: string;
  onRestart: () => void;
}

export function QuizCompletionModal({
  isOpen,
  correctCount,
  totalQuestions,
  alreadyCompleted,
  hasNextExercise,
  nextExerciseId,
  lessonId,
  onRestart
}: QuizCompletionModalProps) {
  const percentage = (correctCount / totalQuestions) * 100;

  let barColor = 'bg-red-500';
  if (correctCount === totalQuestions) barColor = 'bg-green-500';
  else if (correctCount >= totalQuestions / 2) barColor = 'bg-yellow-500';

  return (
    <CompletionModalBase isOpen={isOpen} title="Quiz Complete!" emoji="📝">
      <p className="text-gray-600 mb-2">
        You got <span className="font-bold">{correctCount}</span> out of <span className="font-bold">{totalQuestions}</span> correct
      </p>

      <div className="w-full bg-gray-200 h-3 rounded-full mb-4 overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${percentage}%` }} />
      </div>

      {alreadyCompleted && (
        <p className="text-sm text-gray-500 mb-4">Already completed</p>
      )}

      <div className="flex flex-col gap-3">
        {hasNextExercise && nextExerciseId ? (
          <NavButton href={`/exercise/${nextExerciseId}`} label="Next Exercise" variant="dark" className="w-full" />
        ) : (
          <NavButton href={`/lesson/${lessonId}`} label="Continue" variant="dark" className="w-full" />
        )}
        <button
          onClick={onRestart}
          className="text-sm text-gray-500 hover:text-black underline"
        >
          Try again
        </button>
      </div>
    </CompletionModalBase>
  );
}
