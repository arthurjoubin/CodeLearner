import { Zap } from 'lucide-react';
import { CompletionModalBase } from './CompletionModalBase';
import { NavButton } from '../NavButton';

interface LessonCompletionModalProps {
  isOpen: boolean;
  xpReward: number;
  hasNextLesson: boolean;
  nextLessonId?: string;
  nextModuleId?: string;
  courseId: string;
  onReview: () => void;
}

export function LessonCompletionModal({
  isOpen,
  xpReward,
  hasNextLesson,
  nextLessonId,
  nextModuleId,
  courseId,
  onReview
}: LessonCompletionModalProps) {
  return (
    <CompletionModalBase isOpen={isOpen} title="Lesson Complete!" emoji="⭐" accentColor="green">
      {/* XP reward badge */}
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 px-5 py-2.5 rounded-full font-black text-lg mb-6 shadow-lg">
        <Zap className="w-5 h-5 fill-amber-900" />
        +{xpReward} XP
      </div>

      <div className="flex flex-col gap-2.5">
        {hasNextLesson && nextLessonId ? (
          <NavButton href={`/lesson/${nextLessonId}`} label="Continue" variant="dark" className="w-full !py-3.5 !text-base !rounded-xl" />
        ) : nextModuleId ? (
          <NavButton href={`/module/${nextModuleId}`} label="Next Module" variant="dark" className="w-full !py-3.5 !text-base !rounded-xl" />
        ) : (
          <NavButton href={`/courses/${courseId}`} label="Back to Course" variant="primary" icon="book" className="w-full !py-3.5 !text-base !rounded-xl" />
        )}
        <button
          onClick={onReview}
          className="w-full py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors text-sm rounded-xl"
        >
          Review lesson
        </button>
      </div>
    </CompletionModalBase>
  );
}
