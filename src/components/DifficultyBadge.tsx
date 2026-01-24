interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'advanced';
  size?: 'sm' | 'md';
}

export default function DifficultyBadge({ difficulty, size = 'md' }: DifficultyBadgeProps) {
  const baseClasses = 'font-bold uppercase border-2 border-black inline-block';

  const sizeClasses = size === 'sm'
    ? 'px-1.5 py-0.5 text-xs'
    : 'px-2 py-1 text-xs';

  const colorClasses = {
    easy: 'bg-green-400 text-black',
    beginner: 'bg-green-400 text-black',
    medium: 'bg-yellow-400 text-black',
    intermediate: 'bg-yellow-400 text-black',
    hard: 'bg-red-500 text-white',
    advanced: 'bg-red-500 text-white',
  };

  const labels = {
    easy: 'Easy',
    beginner: 'Beginner',
    medium: 'Medium',
    intermediate: 'Intermediate',
    hard: 'Hard',
    advanced: 'Advanced',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses} ${colorClasses[difficulty]}`}>
      {labels[difficulty]}
    </span>
  );
}
