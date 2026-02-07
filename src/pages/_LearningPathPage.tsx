// Link and useParams replaced for Astro compatibility

import { useUser, UserProvider } from '../context/UserContext';
import { getModulesForCourse, getLessonsForModule, getExercisesForLesson } from '../data/modules';
import { Lock, CheckCircle, Code, Code2, Boxes, Database, MousePointer, Zap, Shield, List, FileInput, FileText, Layers, Settings, Gauge, Navigation, Network, Palette, Server, Target, TestTube, GitBranch, ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageTitle } from '../components/PageTitle';
interface LearningPathPageProps {
  pathId?: string;
}

const iconMap: Record<string, React.ElementType> = {
  Code, Code2, Boxes, Database, MousePointer, Zap, Shield, List, FileInput, FileText, Layers, Settings, Gauge, Navigation, Network, Palette, Server, Target, TestTube, GitBranch,
};

function LearningPathPageContent({ pathId }: LearningPathPageProps) {
  const { user, updateStreak, isLessonCompleted, isExerciseCompleted, loading } = useUser();
  updateStreak();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) return null;

  const learningPathTitles: Record<string, string> = {
    'html-css': 'HTML & CSS',
    javascript: 'JavaScript',
    react: 'React',
    'web-stack': 'Web Fundamentals',
    fastapi: 'FastAPI',
    git: 'Git',
  };

  const learningPathDifficulty: Record<string, string> = {
    'html-css': 'beginner',
    javascript: 'beginner',
    'web-stack': 'beginner',
    git: 'beginner',
    react: 'medium',
  };

  const pathTitle = learningPathTitles[pathId || ''] || 'Learning Path';
  const pathDifficulty = learningPathDifficulty[pathId || ''];
  const courseModules = getModulesForCourse(pathId || '');

  const isLessonEffectivelyDone = (lessonId: string) => {
    if (isLessonCompleted(lessonId)) return true;
    const exercises = getExercisesForLesson(lessonId);
    return exercises.length > 0 && exercises.every(e => isExerciseCompleted(e.id));
  };

  const isModuleComplete = (moduleId: string) => {
    const lessons = getLessonsForModule(moduleId);
    return lessons.length > 0 && lessons.every(l => isLessonEffectivelyDone(l.id));
  };

  const getModuleProgress = (moduleId: string) => {
    const lessons = getLessonsForModule(moduleId);
    const completedLessons = lessons.filter(l => isLessonEffectivelyDone(l.id)).length;
    return lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;
  };

  // Sort modules: completed or in-progress first, then by original order
  const sortedModules = [...courseModules].sort((a, b) => {
    const progressA = getModuleProgress(a.id);
    const progressB = getModuleProgress(b.id);
    return progressB - progressA;
  });

  return (
    <div className="page-enter">
      <div className="relative inline-block group mb-4">
        <a href="/" className="inline-flex items-center gap-2 text-gray-800 font-bold uppercase hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </a>
        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-20 duration-200" />
      </div>

      <div className="mb-6">
        <PageTitle>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 uppercase">{pathTitle}</h1>
            {pathDifficulty && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider border border-gray-300 rounded">
                {pathDifficulty}
              </span>
            )}
          </div>
        </PageTitle>
        <p className="text-gray-700 mt-1">Master {pathTitle} from basics to advanced</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-1">
        {sortedModules.map((module, displayIndex) => {
          // Find original index for unlock logic
          const originalIndex = courseModules.findIndex(m => m.id === module.id);
          const prevModule = originalIndex > 0 ? courseModules[originalIndex - 1] : null;
          const isUnlocked = originalIndex === 0 || (prevModule && isModuleComplete(prevModule.id));

          const lessons = getLessonsForModule(module.id);
          const completedLessons = lessons.filter(l => isLessonEffectivelyDone(l.id)).length;
          const totalLessons = lessons.length;
          const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
          const isComplete = progress === 100;

          const Icon = iconMap[module.icon] || Code;

          if (!isUnlocked) {
            return (
              <div
                key={module.id}
                className="border-2 border-gray-300 bg-gray-100 p-4 relative opacity-60 rounded-lg"
                style={{ animationDelay: `${displayIndex * 50}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 flex items-center justify-center text-gray-600 font-bold rounded-lg">
                    {originalIndex + 1}
                  </div>
                  <div className="w-10 h-10 bg-gray-300 flex items-center justify-center rounded-lg">
                    <Icon className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-600 mb-1 uppercase">{module.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{module.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Lock className="w-3 h-3" />
                  <span>Complete the previous module</span>
                </div>
              </div>
            );
          }

          return (
            <a
              key={module.id}
              href={`/module/${module.id}`}
              style={{ animationDelay: `${displayIndex * 50}ms` }}
              className="border-2 border-gray-300 rounded-lg p-4 transition-all hover:border-primary-500 hover:shadow-md bg-white"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-center gap-2 mb-0.5">
                  <div className={`w-8 h-8 flex items-center justify-center font-bold border-2 rounded-lg transition-colors flex-shrink-0 ${isComplete ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-800 border-gray-300'}`}>
                    {isComplete ? <CheckCircle className="w-4 h-4" /> : originalIndex + 1}
                  </div>
                  <div className="w-8 h-8 bg-primary-100 flex items-center justify-center rounded-lg flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary-700" />
                  </div>
                  <h3 className="font-bold text-gray-900 uppercase group-hover:text-primary-700 transition-colors text-sm">{module.title}</h3>
                  <span className="ml-auto inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
                    {completedLessons}/{totalLessons}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(2, progress)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-700">{module.description}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function LearningPathPage(props: LearningPathPageProps) {
  return (
    <UserProvider>
      <LearningPathPageContent {...props} />
    </UserProvider>
  );
}
