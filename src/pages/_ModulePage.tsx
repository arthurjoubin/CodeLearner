import { useState } from 'react';
// Link and useParams replaced for Astro compatibility

import { useUser, UserProvider } from '../context/UserContext';
import { getModule, getLessonsForModule, getExercisesForLesson, getLesson, getModulesForCourse, lessons as allLessons } from '../data/modules';
import { CheckCircle, Lock, BookOpen, X, ArrowRight } from 'lucide-react';
import ProgressPath from '../components/ProgressPath';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageTitle';

const courseTitles: Record<string, string> = {
  'html-css-tailwind': 'HTML & CSS',
  'javascript-core': 'JavaScript',
  'react': 'React',
  'advanced-topics': 'Web Stack',
  'fastapi': 'FastAPI',
  'git-mastery': 'Git',
  'dev-environment': 'Web Fundamentals',
  'frontend-production': 'Engineering Practices',
  'node-express': 'Node.js & Express',
  'databases': 'Databases & SQL',
  'auth-security': 'Backend Advanced',
  'nextjs': 'Next.js',
  'deployment': 'Deployment',
  'architecture-patterns': 'Architecture Patterns',
  'internet-tools': 'Internet Tools',
};

interface ModulePageProps {
  moduleId?: string;
}

function ModulePageContent({ moduleId }: ModulePageProps) {
  const { user, isLessonCompleted, isExerciseCompleted, loading } = useUser();
  const [showEssentialPopup, setShowEssentialPopup] = useState(false);
  const [essentialContent, setEssentialContent] = useState('');
  const [essentialTitle, setEssentialTitle] = useState('');

  const module = moduleId ? getModule(moduleId) : undefined;
  const lessons = moduleId ? getLessonsForModule(moduleId) : [];

  const isLessonEffectivelyDone = (lessonId: string) => {
    if (isLessonCompleted(lessonId)) return true;
    const exs = getExercisesForLesson(lessonId);
    return exs.length > 0 && exs.every(e => isExerciseCompleted(e.id));
  };

  // Course-level data
  const courseModules = module ? getModulesForCourse(module.courseId) : [];
  const courseLessons = courseModules.flatMap(m => allLessons.filter(l => l.moduleId === m.id));
  
  // Module position in course (0-based index, need to +1 for position)
  const moduleIndex = module ? courseModules.findIndex(m => m.id === module.id) : -1;
  
  // Count lessons in previous modules to get course position
  let lessonsBeforeCurrentModule = 0;
  for (let i = 0; i < moduleIndex; i++) {
    lessonsBeforeCurrentModule += allLessons.filter(l => l.moduleId === courseModules[i].id).length;
  }
  // Position at start of current module (first lesson of this module)
  const currentCoursePosition = lessonsBeforeCurrentModule + 1;

  const handleShowEssential = (lessonId: string) => {
    const lesson = getLesson(lessonId);
    if (lesson) {
      const content = lesson.content;
      const essentialPart = content.split('---')[0].trim();
      setEssentialTitle(lesson.title);
      setEssentialContent(essentialPart);
      setShowEssentialPopup(true);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!module) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-900 font-bold">Module not found</p>
        <a href="/" className="text-primary-600 underline font-bold uppercase text-xs">Go back home</a>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-900 font-bold">Please sign in</p>
        <a href="/" className="text-primary-600 underline font-bold uppercase text-xs">Go back home</a>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="mb-6">
        <div className="mb-2">
          <ProgressPath items={[
            { name: module.title, current: currentCoursePosition, total: courseLessons.length, href: `/courses/${module.courseId}`, parent: { name: courseTitles[module.courseId] || module.courseId, href: `/courses/${module.courseId}` } },
          ]} />
        </div>
        <PageHeader
          title={module.title}
          subtitle={module.description}
        />
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, index) => {
          const exercises = getExercisesForLesson(lesson.id);
          const lessonDone = isLessonCompleted(lesson.id);
          const exercisesDone = exercises.filter(e => isExerciseCompleted(e.id)).length;
          const allExercisesDone = exercises.length === 0 || exercisesDone === exercises.length;
          const isAnythingDone = lessonDone || allExercisesDone;
          const isComplete = isAnythingDone;

          const prevLesson = index > 0 ? lessons[index - 1] : null;
          const isUnlocked = index === 0 || (prevLesson && isLessonEffectivelyDone(prevLesson.id));

          // Is this the next lesson to do? (first unlocked + not complete)
          const isNextUp = isUnlocked && !isComplete && !lessons.slice(0, index).some((l, i) => {
            const prevL = i > 0 ? lessons[i - 1] : null;
            const unlocked = i === 0 || (prevL && isLessonEffectivelyDone(prevL.id));
            return unlocked && !isLessonEffectivelyDone(l.id);
          });

          if (!isUnlocked) {
            return (
              <div key={lesson.id} className="border-2 border-gray-300 bg-gray-100 p-4 rounded-lg opacity-60 grayscale cursor-not-allowed" title="Complete previous lesson first">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 flex items-center justify-center text-gray-500 font-bold rounded-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-500 uppercase text-sm truncate">{lesson.title}</h3>
                    <p className="text-xs text-gray-400">Locked</p>
                  </div>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            );
          }

          return (
            <div
              key={lesson.id}
              className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${isComplete ? 'border-primary-500 bg-primary-50/50' : isNextUp ? 'border-primary-500 bg-white ring-2 ring-primary-200' : 'border-gray-300 bg-white hover:border-primary-500'}`}
            >
              {isNextUp && (
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-primary-200">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-primary-700 uppercase">Continue here</span>
                </div>
              )}
              <div className="flex items-start sm:items-center gap-3 flex-col sm:flex-row">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a href={`/lesson/${lesson.id}`} className={`w-10 h-10 flex-shrink-0 flex items-center justify-center font-bold border-2 rounded-lg transition-all hover:shadow-md ${isComplete ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-800 border-gray-300 hover:border-primary-500'}`}>
                    {isComplete ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </a>
                  <a href={`/lesson/${lesson.id}`} className="flex-1 min-w-0 group">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                      <h3 className="font-bold text-gray-900 uppercase text-sm truncate group-hover:text-primary-600 transition-colors">{lesson.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 mt-1 ml-4">
                      <span className="text-xs text-gray-700 font-bold">{lesson.xpReward || 100} XP</span>
                    </div>
                  </a>
                </div>
                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end sm:justify-start ml-0 sm:ml-auto">
                  <button
                    onClick={() => handleShowEssential(lesson.id)}
                    className="p-2 text-gray-600 border border-gray-300 rounded hover:border-primary-500 hover:text-primary-700 transition-colors hidden sm:flex"
                    title="Essential to know"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/lesson/${lesson.id}`}
                      className={`inline-flex items-center gap-1 px-4 h-10 font-bold text-xs uppercase rounded border transition-all justify-center ${isNextUp ? 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800 hover:border-gray-800' : isComplete ? 'border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-700 underline-offset-2 hover:underline' : 'border-primary-500 text-primary-700 hover:bg-primary-50'}`}
                    >
                      {isNextUp ? <>Continue <ArrowRight className="w-3 h-3" /></> : isComplete ? 'View again' : 'Start'}
                    </a>
                    {exercises.length > 0 && (
                      <div className="inline-flex items-center gap-2 border border-gray-300 bg-white rounded px-3 py-2 h-10 hover:bg-gray-50 transition-colors">
                        <span className="text-xs font-bold text-gray-500 uppercase">Exercises</span>
                        <div className="flex items-center gap-1.5">
                          {exercises.map((ex, idx) => {
                            const exCompleted = isExerciseCompleted(ex.id);
                            return (
                              <a
                                key={ex.id}
                                href={`/exercise/${ex.id}`}
                                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-all border ${exCompleted
                                  ? 'bg-primary-100 border-primary-500 text-primary-700 hover:bg-primary-200 hover:border-primary-700'
                                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-primary-500'
                                  }`}
                                title={`Exercise ${idx + 1}: ${ex.title}${exCompleted ? ' (completed)' : ''}`}
                              >
                                {exCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <p className="font-bold">Coming soon...</p>
        </div>
      )}

      {showEssentialPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEssentialPopup(false)}>
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg border-2 border-gray-300 p-5 max-w-md w-full max-h-[70vh] overflow-y-auto shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-200">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
              <h3 className="font-bold uppercase text-gray-900">{essentialTitle}</h3>
              <button onClick={() => setShowEssentialPopup(false)} className="ml-auto p-1.5 hover:bg-gray-200 rounded transition-colors">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700 space-y-1" dangerouslySetInnerHTML={{
              __html: essentialContent
                .replace(/^# Essential to know\n/, '')
                .replace(/^# (.+)$/gm, '<strong>$1</strong>')
                .split('\n')
                .map(line => {
                  const trimmed = line.trim();
                  if (!trimmed) return '';
                  if (trimmed.startsWith('- ')) {
                    const content = trimmed.substring(2);
                    const withCode = content.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-primary-600 font-mono text-xs">$1</code>');
                    const withBold = withCode.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
                    return `<span class="text-primary-500 font-bold">•</span> <span>${withBold}</span>`;
                  }
                  return line;
                })
                .join('\n')
                .replace(/\n/g, '<br/>')
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ModulePage(props: ModulePageProps) {
  return (
    <UserProvider>
      <ModulePageContent {...props} />
    </UserProvider>
  );
}
