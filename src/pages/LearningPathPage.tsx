import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getModulesForCourse, getLessonsForModule, getExercisesForLesson } from '../data/modules';
import { Lock, CheckCircle, Code, Code2, Boxes, Database, MousePointer, Zap, Shield, List, FileInput, FileText, Layers, Settings, Gauge, Navigation, Network, Palette, Server, Target, TestTube, GitBranch, ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';

const iconMap: Record<string, React.ElementType> = {
  Code, Code2, Boxes, Database, MousePointer, Zap, Shield, List, FileInput, FileText, Layers, Settings, Gauge, Navigation, Network, Palette, Server, Target, TestTube, GitBranch,
};

export default function LearningPathPage() {
  const { pathId } = useParams<{ pathId: string }>();
  const { user, updateStreak, isLessonCompleted, isExerciseCompleted, loading } = useUser();
  updateStreak();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const learningPathTitles: Record<string, string> = {
    react: 'React',
    'web-stack': 'Web Stack Essentials',
    python: 'Python',
    javascript: 'JavaScript',
    fastapi: 'FastAPI',
    git: 'Git',
  };

  const pathTitle = learningPathTitles[pathId || ''] || 'Learning Path';
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

  return (
    <div className="page-enter">
      <Link to="/" className="inline-flex items-center gap-2 text-black font-bold uppercase hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-black text-black uppercase">{pathTitle}</h1>
        <p className="text-gray-600">Master {pathTitle} from basics to advanced</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-1">
        {courseModules.map((module, index) => {
          const prevModule = index > 0 ? courseModules[index - 1] : null;
          const isUnlocked = index === 0 || (prevModule && isModuleComplete(prevModule.id));

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
                className="border-2 border-gray-200 bg-gray-50 p-4 relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-gray-400 font-bold">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-400 mb-1 uppercase">{module.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{module.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Lock className="w-3 h-3" />
                  <span>Complete the previous module</span>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={module.id}
              to={`/module/${module.id}`}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`border-2 border-black p-4 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal ${isComplete ? 'bg-primary-50 border-primary-500' : 'bg-white'
                }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 flex items-center justify-center font-bold border-2 border-black ${isComplete ? 'bg-primary-500 text-white' : 'bg-black text-white'
                  }`}>
                  {isComplete ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center border-2 border-black">
                  <Icon className="w-5 h-5 text-black" />
                </div>
              </div>

              <h3 className="font-bold text-black mb-1 uppercase">{module.title}</h3>
              <p className="text-xs text-gray-600 mb-3">{module.description}</p>

              <div className="h-2.5 bg-gray-200 border border-black mb-1 overflow-hidden">
                <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[10px] text-gray-500 font-bold">{completedLessons}/{totalLessons} lessons • {progress}%</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
