import { ArrowRight, BookOpen } from 'lucide-react';

interface NavButtonProps {
  href: string;
  label: string;
  variant?: 'primary' | 'dark' | 'outline';
  icon?: 'arrow' | 'book' | 'none';
  className?: string;
}

/**
 * Reusable navigation button for lesson/exercise/module navigation.
 * Used in completion modals, next-step banners, and lesson footers.
 */
export function NavButton({
  href,
  label,
  variant = 'dark',
  icon = 'arrow',
  className = '',
}: NavButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold py-2.5 px-5 rounded-lg border-2 transition-colors text-sm uppercase';

  const variants = {
    primary: 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700',
    dark: 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800',
    outline: 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50',
  };

  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`}>
      {icon === 'book' && <BookOpen className="w-4 h-4" />}
      {label}
      {icon === 'arrow' && <ArrowRight className="w-4 h-4" />}
    </a>
  );
}

interface CompleteLessonButtonProps {
  allExercisesDone: boolean;
  alreadyCompleted: boolean;
  onComplete: () => void;
  className?: string;
}

/**
 * "Complete lesson" button for lesson pages.
 * - Disabled (grayed out) if exercises are not all done
 * - On click when disabled: shows a warning message
 * - On click when enabled: completes the lesson and navigates to next
 */
export function CompleteLessonButton({
  allExercisesDone,
  alreadyCompleted,
  onComplete,
  className = '',
}: CompleteLessonButtonProps) {
  const canComplete = allExercisesDone && !alreadyCompleted;
  const isDisabled = !allExercisesDone && !alreadyCompleted;

  if (alreadyCompleted) return null;

  return (
    <button
      onClick={onComplete}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg border-2 transition-all text-sm uppercase w-full sm:w-auto ${
        canComplete
          ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 cursor-pointer'
          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
      } ${className}`}
    >
      Complete lesson
      {canComplete && <ArrowRight className="w-4 h-4" />}
    </button>
  );
}
