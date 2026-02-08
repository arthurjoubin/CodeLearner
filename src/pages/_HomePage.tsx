// Link replaced by standard anchor tags

import { useUser } from '../context/UserContext';
import { lessons, modules, getModulesForCourse, getExercisesForLesson } from '../data/modules';
import { ArrowRight, Clock } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SectionTitle } from '../components/PageTitle';
import { estimateLessonHours, estimatePathHours, formatHours } from '../utils/estimateHours';

const courseTitles: Record<string, string> = {
  'html-css-tailwind': 'HTML & CSS',
  'javascript-core': 'JavaScript',
  'react': 'React',
  'advanced-topics': 'Web Stack',
  'fastapi': 'FastAPI',
  'git-mastery': 'Git',
  'dev-environment': 'Dev Environment',
  'frontend-production': 'Engineering Practices',
  'node-express': 'Node.js & Express',
  'databases': 'Databases & SQL',
  'auth-security': 'Backend Advanced',
  'nextjs': 'Next.js',
  'deployment': 'Deployment',
  'architecture-patterns': 'Architecture Patterns',
  'internet-tools': 'Internet Tools',
};

const learningPaths = [
  { id: 'web-fundamentals', title: 'Web Fundamentals', description: 'Master the fundamentals of web development', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png', difficulty: 'beginner' as const, courses: ['dev-environment', 'git-mastery', 'javascript-core', 'html-css-tailwind'] },
  { id: 'frontend', title: 'Frontend', description: 'Learn React and build modern web applications', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png', difficulty: 'medium' as const, courses: ['html-css-tailwind', 'react', 'frontend-production'] },
  { id: 'backend', title: 'Backend', description: 'Master server-side development with Node.js', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png', difficulty: 'medium' as const, courses: ['node-express', 'databases', 'auth-security'] },
  { id: 'fullstack', title: 'Fullstack', description: 'Learn full-stack development with Next.js', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/nextjs/nextjs.png', difficulty: 'advanced' as const, courses: ['nextjs', 'architecture-patterns', 'advanced-topics'] },
  { id: 'deployment', title: 'Deployment', description: 'Deploy applications to production', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/docker/docker.png', difficulty: 'advanced' as const, courses: ['deployment'] },
];

interface LearningPathResume {
  pathId: string;
  pathTitle: string;
  nextLesson: { id: string; title: string; moduleId: string; moduleTitle: string };
  progress: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  moduleLessonsCompleted: number;
  moduleLessonsTotal: number;
}

export function HomePageContent() {
  const { user, updateStreak, loading } = useUser();
  updateStreak();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) return null;

  const completedLessons = user.completedLessons || [];
  const completedExercises = user.completedExercises || [];
  const courseIds = [...new Set(modules.map(m => m.courseId))];

  // A lesson is "effectively done" if it's completed OR all its exercises are done
  const isLessonEffectivelyDone = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) return true;
    const exs = getExercisesForLesson(lessonId);
    return exs.length > 0 && exs.every(e => completedExercises.includes(e.id));
  };

  const getPathProgress = (pathId: string): LearningPathResume | null => {
    const path = learningPaths.find(p => p.id === pathId);
    if (!path) return null;

    // Get all modules for all courses in this learning path
    const pathModules = path.courses.flatMap(courseId => getModulesForCourse(courseId));
    const pathLessons = pathModules.flatMap(m =>
      lessons.filter(l => l.moduleId === m.id).map(l => ({ ...l, moduleId: m.id }))
    );

    if (pathLessons.length === 0) return null;

    const sortedLessons = pathLessons.sort((a, b) => {
      const moduleA = pathModules.find(m => m.id === a.moduleId);
      const moduleB = pathModules.find(m => m.id === b.moduleId);
      const orderA = pathModules.indexOf(moduleA!);
      const orderB = pathModules.indexOf(moduleB!);
      if (orderA !== orderB) return orderA - orderB;
      return a.order - b.order;
    });

    const completed = sortedLessons.filter(l => isLessonEffectivelyDone(l.id)).length;

    for (const lesson of sortedLessons) {
      if (!isLessonEffectivelyDone(lesson.id)) {
        const mod = pathModules.find(m => m.id === lesson.moduleId);
        const moduleLessons = sortedLessons.filter(l => l.moduleId === lesson.moduleId);
        const moduleLessonsCompleted = moduleLessons.filter(l => isLessonEffectivelyDone(l.id)).length;

        return {
          pathId,
          pathTitle: path.title,
          nextLesson: { id: lesson.id, title: lesson.title, moduleId: lesson.moduleId, moduleTitle: mod?.title || '' },
          progress: Math.round((completed / sortedLessons.length) * 100),
          completedLessonsCount: completed,
          totalLessonsCount: sortedLessons.length,
          moduleLessonsCompleted: moduleLessonsCompleted,
          moduleLessonsTotal: moduleLessons.length
        };
      }
    }

    return {
      pathId,
      pathTitle: path.title,
      nextLesson: { id: sortedLessons[0].id, title: sortedLessons[0].title, moduleId: sortedLessons[0].moduleId, moduleTitle: pathModules.find(m => m.id === sortedLessons[0].moduleId)?.title || '' },
      progress: 100,
      completedLessonsCount: sortedLessons.length,
      totalLessonsCount: sortedLessons.length,
      moduleLessonsCompleted: 0,
      moduleLessonsTotal: 0
    };
  };

  const pathResumes = (learningPaths
    .map(path => getPathProgress(path.id))
    .filter((r): r is LearningPathResume => r !== null && r.progress > 0 && r.progress < 100)
    .sort((a, b) => b.progress - a.progress));

  const getOverallPathProgress = (pathId: string): number => {
    const resume = pathResumes.find(r => r.pathId === pathId);
    if (resume) {
      return Math.max(1, resume.progress);
    }
    const path = learningPaths.find(p => p.id === pathId);
    if (!path) return 0;
    const pathModules = path.courses.flatMap(courseId => getModulesForCourse(courseId));
    const pathLessons = pathModules.flatMap(m =>
      lessons.filter(l => l.moduleId === m.id)
    );
    if (pathLessons.length === 0) return 0;
    const completed = pathLessons.filter(l => isLessonEffectivelyDone(l.id)).length;
    return Math.round((completed / pathLessons.length) * 100);
  };

  return (
    <div className="page-enter bg-gradient-to-b from-gray-100 to-white min-h-[calc(100vh-120px)] pb-4">
      {pathResumes.length > 0 && (
        <div className="mb-8">
          <SectionTitle>Continue Learning</SectionTitle>
          <div className="space-y-3 mt-3">
            {pathResumes.map(resume => {
              const pathData = learningPaths.find(p => p.id === resume.pathId);
              const courseModule = modules.find(m => m.id === resume.nextLesson.moduleId);
              const courseTitle = courseModule ? (courseTitles[courseModule.courseId] || courseModule.courseId) : '';
              const showCourseTitle = courseTitle && courseTitle !== resume.pathTitle;
              const nextLesson = lessons.find(l => l.id === resume.nextLesson.id);
              const estimatedHours = nextLesson ? estimateLessonHours(nextLesson) : 0;

              return (
                <a
                  href={`/lesson/${resume.nextLesson.id}`}
                  key={resume.pathId}
                  className="block p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:shadow-md transition-all group bg-white"
                >
                  <div className="space-y-3">
                    {/* Header row */}
                    <div className="flex items-center gap-3">
                      {pathData?.logo ? (
                        <img src={pathData.logo} alt={resume.pathTitle} className="w-6 h-6 object-contain" />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{resume.pathTitle}</span>
                          {showCourseTitle && (
                            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
                              {courseTitle}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded flex-shrink-0">
                        {resume.completedLessonsCount}/{resume.totalLessonsCount}
                      </span>
                      {pathData?.difficulty && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors flex-shrink-0 ${pathData.difficulty === 'beginner'
                          ? 'bg-green-100 text-green-700 border-green-300 group-hover:border-green-500'
                          : pathData.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-300 group-hover:border-yellow-500'
                            : 'bg-red-100 text-red-700 border-red-300 group-hover:border-red-500'
                          }`}>
                          {pathData.difficulty}
                        </span>
                      )}
                      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-primary-600 flex-shrink-0" />
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(2, resume.progress)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-500 truncate">
                          {resume.nextLesson.moduleTitle && <span className="font-medium text-gray-600">{resume.nextLesson.moduleTitle} ({resume.moduleLessonsCompleted}/{resume.moduleLessonsTotal})</span>}
                          {resume.nextLesson.moduleTitle && resume.nextLesson.title && <span className="mx-1">›</span>}
                          <span className="text-gray-400">{resume.nextLesson.title}</span>
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          {formatHours(estimatedHours)}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div className="py-8 md:py-10 border-b-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>Learning Paths</SectionTitle>
          <a href="/learning-path" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1">
            View more <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...learningPaths]
          .sort((a, b) => {
            const progressA = getOverallPathProgress(a.id);
            const progressB = getOverallPathProgress(b.id);
            return progressB - progressA;
          })
          .map((path) => {
          const resume = pathResumes.find(r => r.pathId === path.id);
          const progress = resume
            ? Math.max(1, getOverallPathProgress(path.id))
            : getOverallPathProgress(path.id);

          const pathHours = estimatePathHours(path.courses);

          return (
            <a
              href={`/learning-path/${path.id}`}
              key={path.id}
              className="border-2 border-gray-300 p-4 relative transition-all rounded-lg bg-white hover:border-primary-500 hover:shadow-md group"
            >
              {resume && resume.progress < 100 && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-primary-500 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                  {progress}%
                </div>
              )}
              {resume && resume.progress === 100 && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-primary-500 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                  ✓ Complete
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={path.logo}
                  alt={path.title}
                  className="w-8 h-8 object-contain"
                />
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-primary-700 transition-colors">{path.title}</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">{path.description}</p>
              <div className="flex items-center gap-2 mb-3">
                {path.difficulty && (
                  <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${path.difficulty === 'beginner'
                    ? 'bg-green-100 text-green-700'
                    : path.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                    }`}>
                    {path.difficulty}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-gray-100 text-gray-600">
                  <Clock className="w-3 h-3" />
                  {formatHours(pathHours)}
                </span>
              </div>
              {progress > 0 && progress < 100 && (
                <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </a>
          );
        })}
        </div>
      </div>

      <div className="py-8 md:py-10">
        <SectionTitle>Our Method</SectionTitle>

        <div className="border-2 border-gray-300 rounded-lg p-3 bg-white">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="pr-3 md:border-r md:border-gray-200 md:last:border-r-0">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="font-bold text-gray-900 block">Learn by Doing</span>
            </div>
            <p className="text-gray-700 ml-4">Theory meets practice. Every lesson combines concepts with hands-on exercises.</p>
          </div>
          <div className="pr-3 md:border-r md:border-gray-200 md:last:border-r-0 md:pl-2">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="font-bold text-gray-900 block">Progress Through Practice</span>
            </div>
            <p className="text-gray-700 ml-4">Build real skills step by step. Your experience grows as you complete lessons and exercises.</p>
          </div>
          <div className="md:pl-2">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="font-bold text-gray-900 block">Stay Active</span>
            </div>
            <p className="text-gray-700 ml-4">No passive watching. You code, you test, you learn by taking action.</p>
          </div>
        </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  return <HomePageContent />;
}
