// Link replaced by standard anchor tags

import { useUser } from '../context/UserContext';
import { lessons, modules, getModulesForCourse, getExercisesForLesson, getLessonsForModule, LEARNING_PATHS, type LearningPathId } from '../data/modules';
import { useState } from 'react';
import { ArrowRight, Clock, ChevronDown } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SectionTitle } from '../components/PageTitle';
import { estimateLessonHours, estimateCourseHours, formatHours } from '../utils/estimateHours';
import { getCourseTitles, getLearningPaths } from '../data/course-metadata';


const courseTitles = getCourseTitles();
const learningPaths = getLearningPaths();

const LEARNING_PATH_ORDER: LearningPathId[] = ['web-fundamentals', 'frontend', 'backend', 'fullstack'];

const LEARNING_PATH_ICONS: Record<LearningPathId, string> = {
  'web-fundamentals': 'https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png',
  'frontend': 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png',
  'backend': 'https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png',
  'fullstack': 'https://raw.githubusercontent.com/github/explore/main/topics/nextjs/nextjs.png',
};

const COURSE_METADATA: Record<string, { title: string; description: string; logo: string; difficulty: 'beginner' | 'medium' | 'advanced' }> = {
  'internet-tools': {
    title: 'Internet & Tools',
    description: 'IDE, terminal, debugging, and build tools',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png',
    difficulty: 'beginner'
  },
  'git-mastery': {
    title: 'Git Mastery',
    description: 'Version control from basics to advanced workflows',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/git/git.png',
    difficulty: 'beginner'
  },
  'javascript-core': {
    title: 'JavaScript Core',
    description: 'Modern JavaScript and TypeScript fundamentals',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png',
    difficulty: 'beginner'
  },
  'html-css-tailwind': {
    title: 'HTML, CSS & Tailwind',
    description: 'Build responsive layouts with modern CSS',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/html/html.png',
    difficulty: 'beginner'
  },
  'react': {
    title: 'React',
    description: 'Component-based UI development with hooks and patterns',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png',
    difficulty: 'medium'
  },
  'frontend-production': {
    title: 'Frontend Production',
    description: 'Testing, performance, security, and PWA basics',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/webpack/webpack.png',
    difficulty: 'medium'
  },
  'node-express': {
    title: 'Node.js & Express',
    description: 'Server-side JavaScript and REST API development',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png',
    difficulty: 'medium'
  },
  'databases': {
    title: 'Databases',
    description: 'SQL fundamentals, SQLite, PostgreSQL, and ORMs',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/postgresql/postgresql.png',
    difficulty: 'medium'
  },
  'auth-security': {
    title: 'Auth & Security',
    description: 'Authentication, JWT, OAuth, and security best practices',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/firebase/firebase.png',
    difficulty: 'medium'
  },
  'nextjs': {
    title: 'Next.js',
    description: 'Full-stack React with App Router and server components',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/nextjs/nextjs.png',
    difficulty: 'advanced'
  },
  'architecture-patterns': {
    title: 'Architecture & Patterns',
    description: 'System design, DevOps, and WebSockets',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/docker/docker.png',
    difficulty: 'advanced'
  },
  'deployment': {
    title: 'Deployment',
    description: 'Cloud fundamentals and production deployment',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/aws/aws.png',
    difficulty: 'advanced'
  }
};

interface LearningPathResume {
  pathId: string;
  pathTitle: string;
  nextLesson: { id: string; title: string; moduleId: string; moduleTitle: string };
  progress: number;
  completedLessonsCount: number;
  currentLessonNumber: number;
  totalLessonsCount: number;
  moduleLessonsCompleted: number;
  currentModuleLessonNumber: number;
  moduleLessonsTotal: number;
}

// Types for courses display
interface CourseInfo {
  id: string;
  title: string;
  description: string;
  logo: string;
  difficulty: 'beginner' | 'medium' | 'advanced';
  modules: typeof modules;
  hours: number;
}

function getCoursesForPath(pathId: LearningPathId): CourseInfo[] {
  const pathConfig = LEARNING_PATHS[pathId];
  
  return pathConfig.courses.map((courseId) => {
    const metadata = COURSE_METADATA[courseId];
    if (!metadata) return null;
    
    const courseModules = modules.filter(m => m.courseId === courseId);
    const hours = estimateCourseHours(courseId);
    
    return {
      id: courseId,
      title: metadata.title,
      description: metadata.description,
      logo: metadata.logo,
      difficulty: metadata.difficulty,
      modules: courseModules,
      hours,
    };
  }).filter(Boolean) as CourseInfo[];
}

function getCourseStatus(course: CourseInfo, completedLessons: string[]): 'not-started' | 'in-progress' | 'completed' {
  const allCourseLessons = course.modules.flatMap(m => getLessonsForModule(m.id));
  if (allCourseLessons.length === 0) return 'not-started';
  
  const completedCount = allCourseLessons.filter(l => completedLessons.includes(l.id)).length;
  
  if (completedCount === 0) return 'not-started';
  if (completedCount === allCourseLessons.length) return 'completed';
  return 'in-progress';
}

function CourseCard({ course, completedLessons }: { course: CourseInfo; completedLessons: string[] }) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 border-green-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    advanced: 'bg-red-100 text-red-700 border-red-300'
  };

  const status = getCourseStatus(course, completedLessons);
  
  const statusStyles = {
    'not-started': 'border-2 border-gray-300 bg-white hover:border-primary-500',
    'in-progress': 'border-2 border-primary-400 bg-primary-50/30 hover:border-primary-600 hover:bg-primary-50/50',
    'completed': 'border-2 border-green-400 bg-green-50/30 hover:border-green-600 hover:bg-green-50/50'
  };

  const statusBadges = {
    'not-started': null,
    'in-progress': (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-primary-100 text-primary-700 rounded-full">
        In Progress
      </span>
    ),
    'completed': (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-green-100 text-green-700 rounded-full">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Completed
      </span>
    )
  };

  const allCourseLessons = course.modules.flatMap(m => getLessonsForModule(m.id));
  const completedCount = allCourseLessons.filter(l => completedLessons.includes(l.id)).length;
  const progress = allCourseLessons.length > 0 ? Math.round((completedCount / allCourseLessons.length) * 100) : 0;

  return (
    <a
      href={`/courses/${course.id}`}
      className={`rounded-lg p-5 transition-all group block ${statusStyles[status]}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <img src={course.logo} alt={course.title} className="w-8 h-8 object-contain" />
        <h3 className="font-bold text-sm uppercase text-gray-900 group-hover:text-primary-700 transition-colors">
          {course.title}
        </h3>
      </div>
      <p className="text-xs text-gray-600 mb-3">{course.description}</p>
      
      {/* Progress bar for in-progress courses */}
      {status === 'in-progress' && (
        <div className="mb-3">
          <div className="h-1.5 bg-primary-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-primary-600 mt-1">{progress}% complete</p>
        </div>
      )}
      
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase border rounded ${difficultyColors[course.difficulty]}`}>
          {course.difficulty === 'beginner' ? 'Beginner' : course.difficulty === 'medium' ? 'Intermediate' : 'Advanced'}
        </span>
        <span className="text-[10px] text-gray-500">
          {course.modules.length} modules • {Math.round(course.hours)} hours
        </span>
        {statusBadges[status]}
      </div>
    </a>
  );
}

function LearningPathCoursesSection({ pathId, completedLessons }: { pathId: LearningPathId; completedLessons: string[] }) {
  const pathConfig = LEARNING_PATHS[pathId];
  const courses = getCoursesForPath(pathId);
  const pathHours = courses.reduce((total, course) => total + course.hours, 0);
  const pathModules = courses.reduce((total, course) => total + course.modules.length, 0);

  return (
    <div className="mb-10 last:mb-0">
      {/* Learning Path Header */}
      <div className="flex items-center gap-4 mb-4 p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-lg">
        <img 
          src={LEARNING_PATH_ICONS[pathId]} 
          alt={pathConfig.name} 
          className="w-12 h-12 object-contain"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{pathConfig.name}</h3>
          <p className="text-sm text-gray-600">{pathConfig.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-primary-600">{pathModules} modules</div>
          <div className="text-xs text-gray-500">{Math.round(pathHours)} hours</div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} completedLessons={completedLessons} />
        ))}
      </div>
    </div>
  );
}

function CoursesByLearningPath() {
  const { user } = useUser();
  const completedLessons = user?.completedLessons || [];
  
  const allCourses = LEARNING_PATH_ORDER.flatMap(pathId => getCoursesForPath(pathId));
  const totalHours = allCourses.reduce((total, course) => total + course.hours, 0);

  return (
    <div className="py-8 md:py-10 border-b-2 border-gray-200">
      <div className="flex items-end justify-between mb-6">
        <SectionTitle>All Courses</SectionTitle>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg">
          <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold text-primary-700">{formatHours(totalHours)} of learning</span>
        </div>
      </div>

      {/* Learning Path Sections */}
      <div>
        {LEARNING_PATH_ORDER.map((pathId) => (
          <LearningPathCoursesSection key={pathId} pathId={pathId} completedLessons={completedLessons} />
        ))}
      </div>
    </div>
  );
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
        // Get lessons only from this specific module (not all lessons with same moduleId across different paths)
        const moduleLessons = getLessonsForModule(lesson.moduleId).sort((a, b) => a.order - b.order);
        const moduleLessonsCompleted = moduleLessons.filter(l => isLessonEffectivelyDone(l.id)).length;

        const currentLessonIndex = sortedLessons.findIndex(l => l.id === lesson.id);
        const currentLessonNumber = currentLessonIndex + 1;
        const currentModuleLessonNumber = moduleLessonsCompleted + 1;

        return {
          pathId,
          pathTitle: path.title,
          nextLesson: { id: lesson.id, title: lesson.title, moduleId: lesson.moduleId, moduleTitle: mod?.title || '' },
          progress: Math.round((completed / sortedLessons.length) * 100),
          completedLessonsCount: completed,
          currentLessonNumber,
          totalLessonsCount: sortedLessons.length,
          moduleLessonsCompleted: moduleLessonsCompleted,
          currentModuleLessonNumber,
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
      currentLessonNumber: sortedLessons.length,
      totalLessonsCount: sortedLessons.length,
      moduleLessonsCompleted: 0,
      currentModuleLessonNumber: 0,
      moduleLessonsTotal: 0
    };
  };

  const pathResumes = (learningPaths
    .map(path => getPathProgress(path.id))
    .filter((r): r is LearningPathResume => r !== null && r.progress > 0 && r.progress < 100)
    .sort((a, b) => b.progress - a.progress));

  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  const toggleExpand = (pathId: string) => {
    setExpandedPath(expandedPath === pathId ? null : pathId);
  };

  return (
    <div className="page-enter bg-gray-50 min-h-[calc(100vh-120px)] pb-4">
      {pathResumes.length > 0 && (
        <div className="mb-8">
          <SectionTitle>Continue Learning</SectionTitle>
          <div className="space-y-3">
            {pathResumes.map(resume => {
              const pathData = learningPaths.find(p => p.id === resume.pathId);
              const courseModule = modules.find(m => m.id === resume.nextLesson.moduleId);
              const courseTitle = courseModule ? (courseTitles[courseModule.courseId] || courseModule.courseId) : '';
              const showCourseTitle = courseTitle && courseTitle !== resume.pathTitle;
              const nextLesson = lessons.find(l => l.id === resume.nextLesson.id);
              const estimatedHours = nextLesson ? estimateLessonHours(nextLesson) : 0;
              const isExpanded = expandedPath === resume.pathId;

              return (
                  <div
                    key={resume.pathId}
                    className="border border-gray-300 rounded-xl hover:border-gray-400 transition-all duration-200 bg-transparent overflow-hidden"
                  >
                  {/* Header - Clickable */}
                  <button
                    onClick={() => toggleExpand(resume.pathId)}
                    className="w-full p-4 text-left hover:bg-gray-100/50 transition-colors duration-200"
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
                            <span className="font-bold text-gray-900">{resume.pathTitle}</span>
                            {showCourseTitle && (
                              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
                                {courseTitle}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded flex-shrink-0">
                          {resume.currentLessonNumber}/{resume.totalLessonsCount}
                        </span>
                        {pathData?.difficulty && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors flex-shrink-0 ${pathData.difficulty === 'beginner'
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : pathData.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                              : 'bg-red-100 text-red-700 border-red-300'
                            }`}>
                            {pathData.difficulty}
                          </span>
                        )}
                        <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
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
                            {resume.nextLesson.moduleTitle && <span className="font-medium text-gray-600">{resume.nextLesson.moduleTitle} ({resume.currentModuleLessonNumber}/{resume.moduleLessonsTotal})</span>}
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
                  </button>

                  {/* Expanded Content - Single Line */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 pb-4 pt-2 border-t border-gray-200/50 bg-gray-100/30">
                      <div className="flex items-center gap-4">
                        {/* Module */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Module</span>
                          <p className="text-sm font-semibold text-gray-900 truncate">{resume.nextLesson.moduleTitle}</p>
                        </div>
                        
                        {/* Lesson */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lesson</span>
                          <p className="text-sm font-medium text-gray-700 truncate">{resume.nextLesson.title}</p>
                        </div>
                        
                        {/* CTA */}
                        <a
                          href={`/lesson/${resume.nextLesson.id}`}
                          className="flex items-center gap-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0 shadow-[0_1px_2px_rgba(34,197,94,0.3)]"
                        >
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Courses grouped by Learning Path */}
      <CoursesByLearningPath />

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
