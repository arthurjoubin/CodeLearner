// Link replaced by standard anchor tags

import { useUser } from '../context/UserContext';
import { lessons, modules, getModulesForCourse, getExercisesForLesson } from '../data/modules';
import { ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SectionTitle } from '../components/PageTitle';

const learningPaths = [
  { id: 'html-css-tailwind', title: 'HTML & CSS', description: 'Learn the building blocks of every web page', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/html/html.png', difficulty: 'beginner' as const },
  { id: 'javascript-core', title: 'JavaScript', description: 'Master the language of the web', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png', difficulty: 'beginner' as const },
  { id: 'dev-environment', title: 'Web Fundamentals', description: 'Understand the full web development ecosystem', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png', difficulty: 'beginner' as const },
  { id: 'react', title: 'React', description: 'Learn React and TypeScript', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png', difficulty: 'medium' as const },
  { id: 'git-mastery', title: 'Git', description: 'Master version control with Git', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/git/git.png', difficulty: 'beginner' as const },
  { id: 'node-express', title: 'Node.js & Express', description: 'Build scalable APIs and servers', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png', difficulty: 'medium' as const },
  { id: 'databases', title: 'Databases', description: 'Master data persistence with SQL and NoSQL', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/postgresql/postgresql.png', difficulty: 'medium' as const },
  { id: 'nextjs', title: 'Next.js', description: 'Full-stack React framework', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/nextjs/nextjs.png', difficulty: 'advanced' as const },
];

interface CourseResume {
  courseId: string;
  courseTitle: string;
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

  const getCourseProgress = (courseId: string): CourseResume | null => {
    const courseModules = getModulesForCourse(courseId);
    const courseLessons = courseModules.flatMap(m =>
      lessons.filter(l => l.moduleId === m.id).map(l => ({ ...l, moduleId: m.id }))
    );

    if (courseLessons.length === 0) return null;

    const sortedLessons = courseLessons.sort((a, b) => {
      const moduleA = courseModules.find(m => m.id === a.moduleId);
      const moduleB = courseModules.find(m => m.id === b.moduleId);
      const orderA = courseModules.indexOf(moduleA!);
      const orderB = courseModules.indexOf(moduleB!);
      if (orderA !== orderB) return orderA - orderB;
      return a.order - b.order;
    });

    const completed = sortedLessons.filter(l => isLessonEffectivelyDone(l.id)).length;

    for (const lesson of sortedLessons) {
      if (!isLessonEffectivelyDone(lesson.id)) {
        const mod = courseModules.find(m => m.id === lesson.moduleId);
        const moduleLessons = sortedLessons.filter(l => l.moduleId === lesson.moduleId);
        const moduleLessonsCompleted = moduleLessons.filter(l => isLessonEffectivelyDone(l.id)).length;

        return {
          courseId,
          courseTitle: learningPaths.find(p => p.id === courseId)?.title || courseId,
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
      courseId,
      courseTitle: learningPaths.find(p => p.id === courseId)?.title || courseId,
      nextLesson: { id: sortedLessons[0].id, title: sortedLessons[0].title, moduleId: sortedLessons[0].moduleId, moduleTitle: courseModules.find(m => m.id === sortedLessons[0].moduleId)?.title || '' },
      progress: 100,
      completedLessonsCount: sortedLessons.length,
      totalLessonsCount: sortedLessons.length,
      moduleLessonsCompleted: 0,
      moduleLessonsTotal: 0
    };
  };

  const resumes = (courseIds
    .map(id => getCourseProgress(id))
    .filter((r): r is CourseResume => r !== null && r.progress > 0 && r.progress < 100)
    .sort((a, b) => b.progress - a.progress));

  const getPathProgress = (courseId: string): number => {
    const resume = resumes.find(r => r.courseId === courseId);
    if (resume) {
      return Math.max(1, resume.progress);
    }
    const courseModules = getModulesForCourse(courseId);
    const courseLessons = courseModules.flatMap(m =>
      lessons.filter(l => l.moduleId === m.id)
    );
    if (courseLessons.length === 0) return 0;
    const completed = courseLessons.filter(l => isLessonEffectivelyDone(l.id)).length;
    return Math.round((completed / courseLessons.length) * 100);
  };

  return (
    <div className="page-enter bg-gradient-to-b from-gray-100 to-white min-h-[calc(100vh-120px)] pb-4">
      {resumes.length > 0 && (
        <div className="mb-8">
          <SectionTitle>Continue Learning</SectionTitle>
          <div className="space-y-3 mt-3">
            {resumes.map(resume => {
              const pathData = learningPaths.find(p => p.id === resume.courseId);
              return (
                <a
                  href={`/lesson/${resume.nextLesson.id}`}
                  key={resume.courseId}
                  className="block p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:shadow-md transition-all group bg-white"
                >
                  <div className="space-y-3">
                    {/* Header row */}
                    <div className="flex items-center gap-3">
                      {pathData?.logo ? (
                        <img src={pathData.logo} alt={resume.courseTitle} className="w-6 h-6 object-contain" />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center gap-2">
                        <span className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{resume.courseTitle}</span>
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
                          {resume.completedLessonsCount}/{resume.totalLessonsCount}
                        </span>
                      </div>
                      {pathData?.difficulty && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${pathData.difficulty === 'beginner'
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
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(2, resume.progress)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {resume.nextLesson.moduleTitle && <span className="font-medium text-gray-600">{resume.nextLesson.moduleTitle} ({resume.moduleLessonsCompleted}/{resume.moduleLessonsTotal})</span>}
                        {resume.nextLesson.moduleTitle && resume.nextLesson.title && <span className="mx-1">›</span>}
                        <span className="text-gray-400">{resume.nextLesson.title}</span>
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div className="py-8 md:py-10 border-b-2 border-gray-200">
        <SectionTitle>Learning Paths</SectionTitle>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide p-1">
        {[...learningPaths]
          .sort((a, b) => {
            const progressA = getPathProgress(a.id);
            const progressB = getPathProgress(b.id);
            return progressB - progressA;
          })
          .map((path) => {
          const isAvailable = ['react', 'dev-environment', 'git-mastery', 'javascript-core', 'html-css-tailwind', 'node-express', 'databases', 'nextjs'].includes(path.id);
          const resume = resumes.find(r => r.courseId === path.id);
          const progress = resume
            ? Math.max(1, getPathProgress(path.id))
            : getPathProgress(path.id);

          return (
            <a
              href={isAvailable ? `/learning-path/${path.id}` : '#'}
              key={path.id}
              className={`border-2 border-gray-300 p-3 relative transition-all flex-shrink-0 w-44 rounded-lg bg-white ${isAvailable
                ? 'hover:border-primary-500 hover:shadow-md cursor-pointer'
                : 'opacity-60 grayscale cursor-not-allowed'
                }`}
            >
              {!isAvailable && (
                <div className="absolute bottom-1.5 right-1.5">
                  <span className="px-1.5 py-0.5 bg-gray-300 text-gray-700 text-[8px] font-bold uppercase tracking-wider border border-gray-400 rounded">
                    Soon
                  </span>
                </div>
              )}
              {isAvailable && resume && resume.progress < 100 && (
                <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-primary-500 text-white text-[8px] font-bold uppercase tracking-wider rounded">
                  {progress}%
                </div>
              )}
              {isAvailable && resume && resume.progress === 100 && (
                <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-primary-500 text-white text-[8px] font-bold uppercase tracking-wider rounded">
                  ✓
                </div>
              )}
              {isAvailable && !resume && (
                <div className="absolute bottom-1.5 right-1.5">
                  <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 text-[8px] font-bold uppercase tracking-wider border border-gray-300 rounded">
                    New
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <img
                  src={path.logo}
                  alt={path.title}
                  className="w-6 h-6 object-contain"
                />
                <h3 className="font-bold text-xs uppercase text-gray-900 group-hover:text-primary-700 transition-colors">{path.title}</h3>
              </div>
              {path.difficulty && (
                <span className={`mt-1.5 inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded ${path.difficulty === 'beginner'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : path.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    : 'bg-red-100 text-red-700 border border-red-300'
                  }`}>
                  {path.difficulty}
                </span>
              )}
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
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
