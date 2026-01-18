import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { modules, getLessonsForModule, getExercisesForModule } from '../data/modules';
import { Lock, CheckCircle, Code, Boxes, Database, MousePointer, Zap, Shield, List, FileInput, Layers, Settings, Gauge, Navigation } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Code,
  Boxes,
  Database,
  MousePointer,
  Zap,
  Shield,
  List,
  FileInput,
  Layers,
  Settings,
  Gauge,
  Navigation,
};

export default function HomePage() {
  const { user, updateStreak } = useUser();

  // Update streak on visit
  updateStreak();

  if (!user) return null;

  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-black text-white border-4 border-black p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2 uppercase">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-300">
          Continue your React & TypeScript journey. You've earned {user.xp} XP so far!
        </p>
      </div>

      {/* Modules Grid */}
      <h2 className="text-2xl font-bold text-black mb-4 uppercase border-b-4 border-black pb-2">
        Learning Path
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, index) => {
          const isLocked = user.xp < module.requiredXp;
          const lessons = getLessonsForModule(module.id);
          const exercises = getExercisesForModule(module.id);
          const completedLessons = lessons.filter(l =>
            user.completedLessons.includes(l.id)
          ).length;
          const completedExercises = exercises.filter(e =>
            user.completedExercises.includes(e.id)
          ).length;
          const totalItems = lessons.length + exercises.length;
          const completedItems = completedLessons + completedExercises;
          const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
          const isComplete = progress === 100;

          const Icon = iconMap[module.icon] || Code;

          return (
            <Link
              key={module.id}
              to={isLocked ? '#' : `/module/${module.id}`}
              className={`card-interactive relative overflow-hidden ${
                isLocked ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''
              }`}
              onClick={(e) => isLocked && e.preventDefault()}
            >
              {/* Content */}
              <div className="relative">
                {/* Status indicator */}
                <div className="absolute top-0 right-0">
                  {isLocked ? (
                    <div className="flex items-center gap-1 bg-gray-200 text-black text-xs font-bold px-2 py-1 border-2 border-black">
                      <Lock className="w-3 h-3" />
                      <span>{module.requiredXp} XP</span>
                    </div>
                  ) : isComplete ? (
                    <div className="bg-primary-500 p-1 border-2 border-black">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  ) : null}
                </div>

                {/* Number & Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-lg border-2 border-black">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center border-2 border-black">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                </div>

                {/* Module info */}
                <h3 className="font-bold text-black mb-1 uppercase">
                  {module.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {module.description}
                </p>

                {/* Progress bar */}
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-black font-bold mt-1 uppercase">
                  {completedItems}/{totalItems} completed
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-4xl font-bold text-black">{user.xp}</div>
          <div className="text-sm text-gray-600 uppercase font-bold">Total XP</div>
        </div>
        <div className="card text-center bg-orange-100">
          <div className="text-4xl font-bold text-black">{user.streak}</div>
          <div className="text-sm text-gray-600 uppercase font-bold">Day Streak</div>
        </div>
        <div className="card text-center bg-blue-100">
          <div className="text-4xl font-bold text-black">
            {user.completedLessons.length}
          </div>
          <div className="text-sm text-gray-600 uppercase font-bold">Lessons Done</div>
        </div>
        <div className="card text-center bg-purple-100">
          <div className="text-4xl font-bold text-black">
            {user.completedExercises.length}
          </div>
          <div className="text-sm text-gray-600 uppercase font-bold">Exercises Done</div>
        </div>
      </div>
    </div>
  );
}
