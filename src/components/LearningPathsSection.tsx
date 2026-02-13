import { LEARNING_PATHS, getModulesForLearningPath, type LearningPathId } from '../data/modules';
import { estimatePathHours, formatHours } from '../utils/estimateHours';

interface LearningPathData {
  id: LearningPathId;
  title: string;
  description: string;
  logo: string;
  difficulty: 'beginner' | 'medium' | 'advanced';
  modules: number;
  hours: string;
  color: string;
}

const LEARNING_PATH_LOGOS: Record<LearningPathId, string> = {
  'web-fundamentals': 'https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png',
  'frontend': 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png',
  'backend': 'https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png',
  'fullstack': 'https://raw.githubusercontent.com/github/explore/main/topics/nextjs/nextjs.png',
};

const LEARNING_PATH_DIFFICULTY: Record<LearningPathId, 'beginner' | 'medium' | 'advanced'> = {
  'web-fundamentals': 'beginner',
  'frontend': 'medium',
  'backend': 'medium',
  'fullstack': 'advanced',
};

function getAllLearningPaths(): LearningPathData[] {
  return (Object.keys(LEARNING_PATHS) as LearningPathId[]).map((pathId) => {
    const config = LEARNING_PATHS[pathId];
    const pathModules = getModulesForLearningPath(pathId);
    const hours = estimatePathHours(config.courses);
    
    return {
      id: pathId,
      title: config.name,
      description: config.description,
      logo: LEARNING_PATH_LOGOS[pathId],
      difficulty: LEARNING_PATH_DIFFICULTY[pathId],
      modules: pathModules.length,
      hours: `${Math.round(hours)} hours`,
      color: config.color,
    };
  });
}

interface LearningPathCardProps {
  path: LearningPathData;
}

function LearningPathCard({ path }: LearningPathCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 border-green-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    advanced: 'bg-red-100 text-red-700 border-red-300'
  };

  return (
    <a
      href={`/learning-path/${path.id}`}
      className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group block"
    >
      <div className="flex items-center gap-3 mb-3">
        <img src={path.logo} alt={path.title} className="w-8 h-8 object-contain" />
        <h3 className="font-bold text-sm uppercase text-gray-900 group-hover:text-primary-700 transition-colors">
          {path.title}
        </h3>
      </div>
      <p className="text-xs text-gray-600 mb-3">{path.description}</p>
      <div className="flex items-center gap-2">
        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase border rounded ${difficultyColors[path.difficulty]}`}>
          {path.difficulty === 'beginner' ? 'Beginner' : path.difficulty === 'medium' ? 'Intermediate' : 'Advanced'}
        </span>
        <span className="text-[10px] text-gray-500">
          {path.modules} modules • {path.hours}
        </span>
      </div>
    </a>
  );
}

interface LearningPathsSectionProps {
  title?: string;
  showTotalHours?: boolean;
}

export function LearningPathsSection({ 
  title = "Learning Paths", 
  showTotalHours = true 
}: LearningPathsSectionProps) {
  const paths = getAllLearningPaths();
  const totalHours = paths.reduce((total, path) => {
    const hoursMatch = path.hours.match(/(\d+)/);
    return total + (hoursMatch ? parseInt(hoursMatch[1]) : 0);
  }, 0);

  return (
    <div>
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        {showTotalHours && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-primary-700">{formatHours(totalHours)} of learning</span>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paths.map((path) => (
          <LearningPathCard key={path.id} path={path} />
        ))}
      </div>
    </div>
  );
}

export default LearningPathsSection;
