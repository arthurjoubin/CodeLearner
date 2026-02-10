import { Star } from 'lucide-react';
import { CompletionModalBase } from './CompletionModalBase';
import { NavButton } from '../NavButton';

interface LessonCompletionModalProps {
  isOpen: boolean;
  xpReward: number;
  hasNextLesson: boolean;
  nextLessonId?: string;
  moduleId: string;
  onReview: () => void;
}

export function LessonCompletionModal({
  isOpen,
  xpReward,
  hasNextLesson,
  nextLessonId,
  moduleId,
  onReview
}: LessonCompletionModalProps) {
  return (
    <CompletionModalBase isOpen={isOpen} title="Lesson Complete!" emoji="⭐">
      <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg border-2 border-yellow-500 font-bold text-sm mb-4">
        <Star className="w-5 h-5" />
        +{xpReward} XP
      </div>

      <div className="flex flex-col gap-2">
        {hasNextLesson && nextLessonId ? (
          <NavButton href={`/lesson/${nextLessonId}`} label="Next Lesson" variant="dark" className="w-full" />
        ) : (
          <NavButton href={`/module/${moduleId}`} label="Back to Module" variant="primary" icon="book" className="w-full" />
        )}
        <button
          onClick={onReview}
          className="w-full py-3 font-bold uppercase border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Review
        </button>
      </div>
    </CompletionModalBase>
  );
}
