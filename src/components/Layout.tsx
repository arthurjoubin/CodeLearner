import { useState, useEffect, useMemo } from 'react';
// Link will be replaced by standard anchor tags for Astro compatibility

import { useUser, UserProvider } from '../context/UserContext';
import { getLevelFromXp, getXpProgress } from '../types';
import { lessons, getModulesForCourse, getExercisesForLesson } from '../data/modules';
import { getLearningPaths, getCourseTitle } from '../data/course-metadata';
import { 
  Flame, 
  FlaskConical, 
  Trophy, 
  Lightbulb, 
  Menu, 
  X, 
  LogOut, 
  BookOpen, 
  Tag, 
  Github, 
  Twitter, 
  Mail, 
  CreditCard,
  ChevronDown,
  Play,
  GraduationCap,
  Code
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

interface PathLesson {
  id: string;
  title: string;
  moduleId: string;
  moduleTitle: string;
  courseId: string;
  courseTitle: string;
  logo: string;
  pathId: string;
  pathTitle: string;
  moduleIndex: number;
  totalModules: number;
  lessonIndex: number;
  totalLessons: number;
  isComplete: boolean;
  currentLessonNumber: number;
  totalLessonsCount: number;
  progress: number;
}

// Get course logo based on courseId
function getCourseLogo(courseId: string): string {
  const logoMap: Record<string, string> = {
    'react': 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png',
    'git-mastery': 'https://raw.githubusercontent.com/github/explore/main/topics/git/git.png',
    'javascript-core': 'https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png',
    'html-css-tailwind': 'https://raw.githubusercontent.com/github/explore/main/topics/html/html.png',
    'advanced-topics': 'https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png',
    'internet-tools': 'https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png',
    'node-express': 'https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png',
    'databases': 'https://raw.githubusercontent.com/github/explore/main/topics/postgresql/postgresql.png',
    'auth-security': 'https://raw.githubusercontent.com/github/explore/main/topics/security/security.png',
    'frontend-production': 'https://raw.githubusercontent.com/github/explore/main/topics/webpack/webpack.png',
    'nextjs': 'https://raw.githubusercontent.com/github/explore/main/topics/nextjs/nextjs.png',
    'deployment': 'https://raw.githubusercontent.com/github/explore/main/topics/docker/docker.png',
    'architecture-patterns': 'https://raw.githubusercontent.com/github/explore/main/topics/architecture/architecture.png',
  };
  return logoMap[courseId] || 'https://raw.githubusercontent.com/github/explore/main/topics/code/code.png';
}

// Wrapped in internal component to allow usage of useUser in the parent
function LayoutContent({ children }: LayoutProps) {
  const { user, isGuest, logout, loading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [levelPopupOpen, setLevelPopupOpen] = useState(false);
  const [streakPopupOpen, setStreakPopupOpen] = useState(false);
  const [lessonDropdownOpen, setLessonDropdownOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Get all paths with their current lesson status
  const pathLessons = useMemo((): PathLesson[] => {
    if (!user || isGuest) return [];
    
    const completedLessons = user.completedLessons || [];
    const completedExercises = user.completedExercises || [];
    const learningPaths = getLearningPaths();

    const isLessonEffectivelyDone = (lessonId: string) => {
      if (completedLessons.includes(lessonId)) return true;
      const exs = getExercisesForLesson(lessonId);
      return exs.length > 0 && exs.every(e => completedExercises.includes(e.id));
    };

    // Check if user is currently viewing a specific lesson
    const currentPath = window.location.pathname;
    const lessonMatch = currentPath.match(/\/lesson\/([^\/]+)/);
    const currentLessonId = lessonMatch ? lessonMatch[1] : null;

    const pathsList: PathLesson[] = [];

    learningPaths.forEach(path => {
      const pathModules = path.courses.flatMap(courseId => getModulesForCourse(courseId));
      const pathLessonsList = pathModules.flatMap(m =>
        lessons.filter(l => l.moduleId === m.id).map(l => ({ ...l, moduleId: m.id }))
      );

      if (pathLessonsList.length === 0) return;

      // Sort by module order, then lesson order
      const sortedLessons = pathLessonsList.sort((a, b) => {
        const moduleA = pathModules.find(m => m.id === a.moduleId);
        const moduleB = pathModules.find(m => m.id === b.moduleId);
        const orderA = pathModules.indexOf(moduleA!);
        const orderB = pathModules.indexOf(moduleB!);
        if (orderA !== orderB) return orderA - orderB;
        return a.order - b.order;
      });

      // Calculate completed lessons
      const completedCount = sortedLessons.filter(l => isLessonEffectivelyDone(l.id)).length;
      const totalLessonsCount = sortedLessons.length;
      const progress = Math.round((completedCount / totalLessonsCount) * 100);

      // Skip if no lessons completed or if complete
      if (completedCount === 0 || progress === 100) return;

      // Determine current lesson: if on a lesson page, use that lesson; otherwise find first incomplete
      let currentLesson = sortedLessons[0];
      if (currentLessonId) {
        // Check if current lesson is in this path
        const foundLesson = sortedLessons.find(l => l.id === currentLessonId);
        if (foundLesson) {
          currentLesson = foundLesson;
        } else {
          currentLesson = sortedLessons.find(l => !isLessonEffectivelyDone(l.id)) || sortedLessons[0];
        }
      } else {
        currentLesson = sortedLessons.find(l => !isLessonEffectivelyDone(l.id)) || sortedLessons[0];
      }

      // Find the module that contains the current lesson
      const mod = pathModules.find(m => m.id === currentLesson.moduleId);
      const currentModuleIndex = mod ? pathModules.indexOf(mod) : 0;

      // Calculate lesson position within the module
      const moduleLessons = sortedLessons.filter(l => l.moduleId === currentLesson.moduleId);
      const lessonPositionInModule = moduleLessons.findIndex(l => l.id === currentLesson.id) + 1;

      // Calculate overall lesson position across entire path
      const currentLessonNumber = sortedLessons.findIndex(l => l.id === currentLesson.id) + 1;

      if (mod) {
        pathsList.push({
          id: currentLesson.id,
          title: currentLesson.title,
          moduleId: currentLesson.moduleId,
          moduleTitle: mod.title,
          courseId: mod.courseId,
          courseTitle: getCourseTitle(mod.courseId),
          logo: getCourseLogo(mod.courseId),
          pathId: path.id,
          pathTitle: path.title,
          moduleIndex: currentModuleIndex + 1,
          totalModules: pathModules.length,
          lessonIndex: lessonPositionInModule,
          totalLessons: moduleLessons.length,
          isComplete: false,
          currentLessonNumber,
          totalLessonsCount,
          progress,
        });
      }
    });

    // Sort by progress descending
    return pathsList.sort((a, b) => b.progress - a.progress);
  }, [user, isGuest]);

  if (loading) {
    return (
      <div className="loading-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const levelInfo = getLevelFromXp(user.xp);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Modern Minimalist Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <span className="text-xl font-bold tracking-wider text-gray-900">HACK<span className="text-primary-500">UP</span></span>
                <div className="absolute -bottom-0.5 left-0 w-6 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
              </div>
            </a>

            {isGuest ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <a
                  href="/learning-path"
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    (currentPath.startsWith('/learning-path') || currentPath.startsWith('/module') || currentPath.startsWith('/lesson') || currentPath.startsWith('/exercise') || currentPath.startsWith('/quiz'))
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Learning</span>
                </a>
                <a
                  href="/courses"
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    currentPath.startsWith('/courses')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Courses</span>
                </a>
                <a
                  href="/resources"
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    (currentPath.startsWith('/resources') || currentPath.startsWith('/lab'))
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Resources</span>
                </a>
                <a
                  href="/codecraft"
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    currentPath.startsWith('/codecraft')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span>CodeCraft</span>
                </a>
                <a
                  href="/pricing"
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    currentPath === '/pricing'
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pricing</span>
                </a>
                <a
                  href="/login"
                  className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 text-sm font-medium hover:bg-gray-800 transition-colors rounded-md ml-2"
                >
                  <span>Login</span>
                </a>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="Menu"
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 bg-black/20 z-40 sm:hidden" onClick={() => setMenuOpen(false)} />
                    <div className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-200 sm:hidden animate-slide-down">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="text-lg font-bold tracking-wider text-gray-900">HACK<span className="text-primary-500">UP</span></span>
                        <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <nav className="px-2 py-2 space-y-1">
                        <a
                          href="/learning-path"
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            currentPath.startsWith('/learning-path') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Lightbulb className="w-4 h-4" /> Learning Paths
                        </a>
                        <a
                          href="/courses"
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            currentPath.startsWith('/courses') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <GraduationCap className="w-4 h-4" /> Courses
                        </a>
                        <a
                          href="/resources"
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            currentPath.startsWith('/resources') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <BookOpen className="w-4 h-4" /> Resources
                        </a>
                        <a
                          href="/codecraft"
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            currentPath.startsWith('/codecraft') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Code className="w-4 h-4" /> CodeCraft
                        </a>
                        <a
                          href="/pricing"
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            currentPath === '/pricing' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <CreditCard className="w-4 h-4" /> Pricing
                        </a>
                      </nav>
                      <div className="px-4 py-3 border-t border-gray-100">
                        <a
                          href="/login"
                          onClick={() => setMenuOpen(false)}
                          className="block w-full text-center bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg"
                        >
                          Login
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Continue Learning Dropdown */}
              {pathLessons.length > 0 && (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setLessonDropdownOpen(!lessonDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all"
                  >
                    <Play className="w-3.5 h-3.5 text-primary-500" />
                    <span className="hidden lg:inline">Continue</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${lessonDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {lessonDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setLessonDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl shadow-gray-200/50 z-50 overflow-hidden border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Continue Learning</span>
                        </div>
                        <div className="p-2 space-y-1">
                          {pathLessons.map((pathLesson) => (
                            <a
                              key={pathLesson.pathId}
                              href={`/lesson/${pathLesson.id}`}
                              onClick={() => setLessonDropdownOpen(false)}
                              className="group block p-3 rounded-xl bg-white border border-gray-100 hover:border-primary-200 hover:shadow-md hover:shadow-primary-500/5 transition-all duration-200"
                            >
                              {/* Header: Course Icon + Module + Progress Badge */}
                              <div className="flex items-start gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0 group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-200 border border-gray-100">
                                  <img
                                    src={pathLesson.logo}
                                    alt={pathLesson.courseTitle}
                                    className="w-6 h-6 object-contain"
                                  />
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                                      {pathLesson.moduleTitle}
                                    </p>
                                    <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-bold tabular-nums border border-primary-100">
                                      {pathLesson.currentLessonNumber}/{pathLesson.totalLessonsCount}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                                    <span className="text-gray-300">›</span>
                                    <span className="truncate font-medium">{pathLesson.title}</span>
                                  </p>
                                </div>
                              </div>
                              {/* Progress Bar */}
                              <div className="mt-3 ml-14">
                                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5">
                                  <span className="font-medium">{pathLesson.courseTitle}</span>
                                  <span className="tabular-nums">{pathLesson.progress}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500 ease-out"
                                    style={{ width: `${pathLesson.progress}%` }}
                                  />
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Labs Button */}
              <a 
                href="/labs" 
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  currentPath.startsWith('/lab')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                title="Labs"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Lab</span>
              </a>

              {/* Courses Button */}
              <a 
                href="/courses" 
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  currentPath.startsWith('/courses')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Courses</span>
              </a>

              {/* CodeCraft Button */}
              <a 
                href="/codecraft" 
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  currentPath.startsWith('/codecraft')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                title="CodeCraft"
              >
                <Code className="w-4 h-4" />
                <span>CodeCraft</span>
              </a>

              {/* Streak Button */}
              <div className="relative">
                <button
                  onClick={() => setStreakPopupOpen(!streakPopupOpen)}
                  className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 text-sm font-medium hover:bg-gray-800 transition-colors rounded-md"
                >
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>{user.streak}</span>
                </button>
                {streakPopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setStreakPopupOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-xs text-gray-700 uppercase tracking-wider">Streak</span>
                        <span className="ml-auto text-primary-600 font-bold">{user.streak} days</span>
                      </div>
                      <div className="p-3 space-y-2 text-xs">
                        <p className="text-gray-600">Daily practice keeps your streak alive.</p>
                        <div className="pt-1 space-y-1">
                          <p className="font-semibold text-gray-700 text-[10px] uppercase tracking-wider">XP Bonus</p>
                          <div className="flex justify-between text-gray-600">
                            <span>7+ days</span>
                            <span className="text-primary-600 font-mono font-bold">+10%</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>30+ days</span>
                            <span className="text-primary-600 font-mono font-bold">+25%</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>100+ days</span>
                            <span className="text-primary-600 font-mono font-bold">+50%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Level Button */}
              <div className="relative">
                <button
                  onClick={() => setLevelPopupOpen(!levelPopupOpen)}
                  className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 transition-colors rounded-md bg-white"
                >
                  <span className="text-xs text-gray-500 uppercase hidden sm:inline">{levelInfo.title}</span>
                  <span className="text-gray-900">Lvl {levelInfo.level}</span>
                </button>
                {levelPopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLevelPopupOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50">
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                        <span className="font-semibold text-xs text-gray-700 uppercase tracking-wider">{levelInfo.title}</span>
                        <span className="ml-auto text-primary-600 font-bold text-xs">{user.xp} XP</span>
                      </div>
                      <div className="p-3 space-y-2 text-xs">
                        {user.recentXp > 0 && (
                          <div className="bg-primary-50 border border-primary-200 rounded px-3 py-2">
                            <div className="text-primary-700 font-semibold text-[10px] uppercase tracking-wider">Recent Session</div>
                            <div className="text-primary-600 font-bold">+{user.recentXp} XP</div>
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-700 text-[10px] uppercase tracking-wider">XP Rewards</p>
                          <div className="flex justify-between text-gray-600">
                            <span>Lesson</span>
                            <span className="font-mono font-bold text-primary-600">+100</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Module</span>
                            <span className="font-mono font-bold text-primary-600">+500</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Learning Path</span>
                            <span className="font-mono font-bold text-primary-600">+2000</span>
                          </div>
                        </div>
                        <div className="border-t border-gray-100 pt-2">
                          {levelInfo.maxXp !== Infinity && (
                            <div>
                              <div className="flex justify-between text-[10px] text-gray-500 mb-1 uppercase font-semibold tracking-wider">
                                <span>Lvl {levelInfo.level}</span>
                                <span>Lvl {levelInfo.level + 1}</span>
                              </div>
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                                  style={{ width: `${getXpProgress(user.xp)}%` }}
                                />
                              </div>
                              <div className="text-center mt-1">
                                <span className="text-[10px] text-gray-500">{levelInfo.maxXp - user.xp} XP to next</span>
                              </div>
                            </div>
                          )}
                          {levelInfo.maxXp === Infinity && (
                            <div className="text-center">
                              <span className="text-[10px] text-gray-500">Max level reached!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-md"
                  title="Menu"
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 bg-black/20 z-40 sm:bg-transparent" onClick={() => setMenuOpen(false)} />
                    <div className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-200 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-56 sm:border sm:border-gray-200 sm:rounded-lg sm:shadow-lg sm:fixed-auto animate-slide-down sm:animate-none">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sm:hidden">
                        <span className="text-lg font-bold tracking-wider text-gray-900">HACK<span className="text-primary-500">UP</span></span>
                        <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Learning Paths Section in Mobile Menu */}
                      {pathLessons.length > 0 && (
                        <div className="px-3 py-3 border-b border-gray-100 sm:hidden">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3">Continue Learning</span>
                          <div className="mt-2 space-y-2">
                            {pathLessons.slice(0, 4).map((pathLesson) => (
                              <a
                                key={pathLesson.pathId}
                                href={`/lesson/${pathLesson.id}`}
                                onClick={() => setMenuOpen(false)}
                                className="group block px-3 py-2.5 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-primary-200 hover:shadow-sm transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                                    <img
                                      src={pathLesson.logo}
                                      alt={pathLesson.courseTitle}
                                      className="w-5 h-5 object-contain"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                                        {pathLesson.moduleTitle}
                                      </p>
                                      <span className="flex-shrink-0 text-xs font-bold text-primary-600 tabular-nums">
                                        {pathLesson.currentLessonNumber}/{pathLesson.totalLessonsCount}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                                      › {pathLesson.title}
                                    </p>
                                  </div>
                                </div>
                                <div className="ml-12 mt-2">
                                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                                    <span>{pathLesson.courseTitle}</span>
                                    <span className="tabular-nums">{pathLesson.progress}%</span>
                                  </div>
                                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                                      style={{ width: `${pathLesson.progress}%` }}
                                    />
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <nav className="px-2 py-2 space-y-1">
                        <a
                          href="/leaderboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Trophy className="w-4 h-4" /> Leaderboard
                        </a>
                        <a
                          href="/learning-path"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Lightbulb className="w-4 h-4" /> Learning Paths
                        </a>
                        <a
                          href="/courses"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <GraduationCap className="w-4 h-4" /> Courses
                        </a>
                        <a
                          href="/resources"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <BookOpen className="w-4 h-4" /> Resources
                        </a>
                        <a
                          href="/codecraft"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Code className="w-4 h-4" /> CodeCraft
                        </a>
                        <a
                          href="/resources/devfinds"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-yellow-700 hover:bg-yellow-50 transition-colors"
                        >
                          <Tag className="w-4 h-4" /> Dev Finds
                        </a>
                      </nav>
                      <div className="px-2 py-2 border-t border-gray-100">
                        <button
                          onClick={() => { logout(); setMenuOpen(false); }}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 text-left transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-3 pt-4 w-full">
        {children}
      </main>

      <footer className="border-t border-gray-200 mt-auto bg-white">
        <div className="max-w-6xl mx-auto px-3 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-gray-900">HACK<span className="text-primary-500">UP</span></span>
              <span className="text-xs text-gray-500">© 2025</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/resources" className="text-xs font-medium text-gray-600 hover:text-primary-600 transition-colors uppercase tracking-wider">Resources</a>
              <a href="/pricing" className="text-xs font-medium text-gray-600 hover:text-primary-600 transition-colors uppercase tracking-wider">Pricing</a>
              <a href="/resources/devfinds" className="text-xs font-medium text-yellow-600 hover:text-yellow-700 transition-colors uppercase tracking-wider">Dev Finds</a>
              <a href="/leaderboard" className="text-xs font-medium text-gray-600 hover:text-primary-600 transition-colors uppercase tracking-wider">Leaderboard</a>
              <a href="/labs" className="text-xs font-medium text-gray-600 hover:text-primary-600 transition-colors uppercase tracking-wider">Labs</a>
              <a href="/codecraft" className="text-xs font-medium text-gray-600 hover:text-primary-600 transition-colors uppercase tracking-wider">CodeCraft</a>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="mailto:hello@hackup.dev" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Understand code___one day at a time</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  );
}
