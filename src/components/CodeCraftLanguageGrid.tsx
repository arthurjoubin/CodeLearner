import { useUser, UserProvider } from '../context/UserContext';
import { getExercisesByLanguage } from '../data/language-exercises';

interface LanguageWithStats {
  id: string;
  name: string;
  color: string;
  icon: string;
  exerciseCount: number;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
}

interface CodeCraftLanguageGridProps {
  languagesWithStats: LanguageWithStats[];
}

function CodeCraftLanguageGridContent({ languagesWithStats }: CodeCraftLanguageGridProps) {
  const { isExerciseCompleted } = useUser();

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
      {languagesWithStats.map((lang) => {
        const exercises = getExercisesByLanguage(lang.id);
        const completedCount = exercises.filter(e => isExerciseCompleted(e.id)).length;
        const progress = lang.exerciseCount > 0 ? (completedCount / lang.exerciseCount) * 100 : 0;

        return (
          <a
            key={lang.id}
            href={`/codecraft/${lang.id}`}
            className="group block p-5 border-2 border-gray-300 rounded-lg bg-white hover:border-primary-400 transition-all"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: `${lang.color}15` }}
              >
                {lang.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                  {lang.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {lang.exerciseCount} exercises
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Difficulty breakdown */}
            <div className="flex items-center gap-3 text-xs mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-gray-600">{lang.difficultyBreakdown.easy}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span className="text-gray-600">{lang.difficultyBreakdown.medium}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-gray-600">{lang.difficultyBreakdown.hard}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, backgroundColor: lang.color }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {completedCount}/{lang.exerciseCount} completed
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
}

// Wrapper component with UserProvider
export default function CodeCraftLanguageGrid(props: CodeCraftLanguageGridProps) {
  return (
    <UserProvider>
      <CodeCraftLanguageGridContent {...props} />
    </UserProvider>
  );
}
