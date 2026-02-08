// Course page - displays modules for a single course

import { useUser, UserProvider } from '../context/UserContext';
import { getModulesForCourse, getLessonsForModule, getExercisesForLesson } from '../data/modules';
import { Lock, CheckCircle, Code, Code2, Boxes, Database, MousePointer, Zap, Shield, List, FileInput, FileText, Layers, Settings, Gauge, Navigation, Network, Palette, Server, Target, TestTube, GitBranch, ArrowLeft, Route, Globe, Terminal } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageTitle } from '../components/PageTitle';
import Breadcrumb from '../components/Breadcrumb';

interface CoursePageProps {
  courseId?: string;
}

const iconMap: Record<string, React.ElementType> = {
  Code, Code2, Boxes, Database, MousePointer, Zap, Shield, List, FileInput, FileText, Layers, Settings, Gauge, Navigation, Network, Palette, Server, Target, TestTube, GitBranch, Route, Globe, Terminal,
};

function CoursePageContent({ courseId }: CoursePageProps) {
  const { user, updateStreak, isLessonCompleted, isExerciseCompleted, loading } = useUser();
  updateStreak();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) return null;

  const courseTitles: Record<string, string> = {
    'html-css-tailwind': 'HTML & CSS',
    'javascript-core': 'JavaScript',
    'react': 'React',
    'advanced-topics': 'Web Stack',
    'fastapi': 'FastAPI',
    'git-mastery': 'Git',
    'dev-environment': 'Terminal & CLI',
    'frontend-production': 'Engineering Practices',
    'node-express': 'Node.js & Express',
    'databases': 'Databases & SQL',
    'auth-security': 'Backend Advanced',
    'nextjs': 'Next.js',
    'deployment': 'Deployment',
    'architecture-patterns': 'Architecture Patterns',
    'internet-tools': 'Internet Tools',
  };

  const courseDifficulty: Record<string, string> = {
    'html-css-tailwind': 'beginner',
    'javascript-core': 'beginner',
    'advanced-topics': 'beginner',
    'git-mastery': 'beginner',
    'react': 'medium',
    'dev-environment': 'beginner',
    'frontend-production': 'medium',
    'node-express': 'medium',
    'databases': 'medium',
    'auth-security': 'advanced',
    'nextjs': 'advanced',
    'deployment': 'advanced',
    'architecture-patterns': 'advanced',
    'internet-tools': 'beginner',
  };

  const courseTitle = courseTitles[courseId || ''] || 'Course';
  const difficulty = courseDifficulty[courseId || ''];
  const courseModules = getModulesForCourse(courseId || '');

  // Map courses to their learning paths
  const courseToLearningPath: Record<string, { id: string; name: string }> = {
    'html-css-tailwind': { id: 'frontend', name: 'Frontend' },
    'javascript-core': { id: 'frontend', name: 'Frontend' },
    'react': { id: 'frontend', name: 'Frontend' },
    'node-express': { id: 'backend', name: 'Backend' },
    'databases': { id: 'backend', name: 'Backend' },
    'auth-security': { id: 'backend', name: 'Backend' },
    'dev-environment': { id: 'web-fundamentals', name: 'Web Fundamentals' },
    'git-mastery': { id: 'web-fundamentals', name: 'Web Fundamentals' },
    'nextjs': { id: 'fullstack', name: 'Fullstack' },
    'deployment': { id: 'fullstack', name: 'Fullstack' },
    'architecture-patterns': { id: 'fullstack', name: 'Fullstack' },
  };

  const learningPath = courseId ? courseToLearningPath[courseId] : undefined;

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

  // Calculate total lessons in course
  const allCourseLessons = courseModules.flatMap(m => getLessonsForModule(m.id));
  
  // For course page, we show position as 1 (start of course)
  const coursePosition = 1;

  // Build breadcrumb items
  const breadcrumbItems = [];
  if (learningPath) {
    breadcrumbItems.push({ 
      label: `${learningPath.name} Path`, 
      href: `/learning-path/${learningPath.id}` 
    });
  }

  return (
    <div className="page-enter">
      <div className="mb-4">
        {learningPath ? (
          <Breadcrumb items={breadcrumbItems} />
        ) : (
          <div className="relative inline-block group">
            <a href="/courses" className="inline-flex items-center gap-2 text-gray-800 font-bold uppercase hover:text-primary-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> All Courses
            </a>
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-24 duration-200" />
          </div>
        )}
      </div>

      <div className="mb-6">
        <PageTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-gray-900 uppercase">{courseTitle}</h1>
            {difficulty && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider border border-gray-300 rounded">
                {difficulty}
              </span>
            )}
            <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 rounded text-[10px] font-bold border border-primary-200">
              {coursePosition}/{allCourseLessons.length} lessons
            </span>
          </div>
        </PageTitle>
        <p className="text-gray-700 mt-1">Master {courseTitle} from basics to advanced</p>
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
                <div className="space-y-3">
                  {/* Header row */}
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-8 h-8 flex items-center justify-center font-bold border-2 border-gray-300 bg-white text-gray-600 rounded-lg flex-shrink-0">
                      {originalIndex + 1}
                    </div>
                    <div className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-lg flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <h3 className="font-bold text-gray-600 uppercase text-sm">{module.title}</h3>
                    <span className="ml-auto inline-block px-2 py-0.5 bg-gray-200 text-gray-500 text-xs font-semibold rounded">
                      <Lock className="w-3 h-3 inline" />
                    </span>
                  </div>

                  {/* Progress bar - locked */}
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-400 rounded-full w-0" />
                    </div>
                    <p className="text-xs text-gray-600">{module.description}</p>
                  </div>
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

export default function CoursePage(props: CoursePageProps) {
  return (
    <UserProvider>
      <CoursePageContent {...props} />
    </UserProvider>
  );
}
