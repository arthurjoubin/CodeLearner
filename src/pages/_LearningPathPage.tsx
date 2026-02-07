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
    'web-stack': 'Web Stack Essentials',
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
              className="border-2 border-gray-300 rounded-lg p-4 transition-all hover:border-primary-500 hover:shadow-md bg-white relative"
            >
              <div className="absolute top-3 right-3 flex flex-col items-center">
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle cx="20" cy="20" r="17" stroke="#d1d5db" strokeWidth="3" fill="none" />
                    <circle
                      cx="20" cy="20" r="17"
                      stroke="#22c55e"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={106.8}
                      strokeDashoffset={106.8 - (106.8 * Math.max(1, progress)) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800">
                    {Math.max(1, progress)}
                  </span>
                </div>
                <p className="text-[10px] text-gray-700 font-bold mt-0.5">{completedLessons}/{totalLessons}</p>
              </div>

              <div className="flex items-center gap-3 mb-3 pr-12">
                <div className={`w-10 h-10 flex items-center justify-center font-bold border-2 border-gray-300 rounded-lg transition-colors ${isComplete ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-800 border-gray-300 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500'}`}>
                  {isComplete ? <CheckCircle className="w-5 h-5" /> : originalIndex + 1}
                </div>
                <div className="w-10 h-10 bg-primary-100 flex items-center justify-center rounded-lg">
                  <Icon className="w-5 h-5 text-primary-700" />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full group-hover:scale-150 transition-transform" />
                <h3 className="font-bold text-gray-900 uppercase group-hover:text-primary-700 transition-colors">{module.title}</h3>
              </div>
              <p className="text-xs text-gray-700 mb-3 ml-4">{module.description}</p>
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
