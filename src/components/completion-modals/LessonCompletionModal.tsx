import { ArrowRight, BookOpen, Star } from 'lucide-react';
import { CompletionModalBase } from './CompletionModalBase';

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
          <a 
            href={`/lesson/${nextLessonId}`} 
            className="w-full py-3 bg-gray-900 text-white font-bold uppercase rounded-lg border-2 border-gray-900 hover:bg-gray-800 transition-colors"
          >
            Next Lesson <ArrowRight className="w-4 h-4 inline ml-1" />
          </a>
        ) : (
          <a 
            href={`/module/${moduleId}`} 
            className="w-full py-3 bg-primary-600 text-white font-bold uppercase rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors"
          >
            <BookOpen className="w-4 h-4 inline mr-1" /> Back to Module
          </a>
        )}
        <button 
          onClick={onReview} 
          className="w-full py-3 font-bold uppercase border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Review
        </button>
      </div>
    </CompletionModalBase>
  );
}
