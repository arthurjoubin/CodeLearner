import { CheckCircle } from 'lucide-react';
import { useUser, UserProvider } from '../context/UserContext';
import { LanguageExercise } from '../types';

interface CodeCraftExerciseListProps {
  exercises: LanguageExercise[];
  language: { id: string; name: string; color: string };
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  hard: 'bg-red-100 text-red-700 border-red-200',
};

const difficultyLabels: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

function CodeCraftExerciseListContent({ exercises, language }: CodeCraftExerciseListProps) {
  const { isExerciseCompleted } = useUser();

  const completedCount = exercises.filter(e => isExerciseCompleted(e.id)).length;
  const progress = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-gray-700">Progress</p>
          <p className="text-sm text-gray-600">{completedCount}/{exercises.length} completed</p>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: language.color }}
          ></div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-3">
        {exercises.map((exercise, index) => {
          const isCompleted = isExerciseCompleted(exercise.id);

          return (
            <a
              key={exercise.id}
              href={`/codecraft/${language.id}/${exercise.id}`}
              className="group flex items-center gap-4 p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-primary-400 transition-all"
            >
              {/* Number / Check */}
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500 font-medium group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors"
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                    {exercise.title}
                  </h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${difficultyColors[exercise.difficulty]}`}>
                    {difficultyLabels[exercise.difficulty]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{exercise.description}</p>
              </div>

              {/* Arrow */}
              <svg
                className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// Wrapper component with UserProvider
export default function CodeCraftExerciseList(props: CodeCraftExerciseListProps) {
  return (
    <UserProvider>
      <CodeCraftExerciseListContent {...props} />
    </UserProvider>
  );
}
