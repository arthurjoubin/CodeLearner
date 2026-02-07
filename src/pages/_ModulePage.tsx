import { useState } from 'react';
// Link and useParams replaced for Astro compatibility

import { useUser, UserProvider } from '../context/UserContext';
import { getModule, getLessonsForModule, getExercisesForLesson, getLesson } from '../data/modules';
import { CheckCircle, Lock, BookOpen, X, ArrowRight } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageTitle';

const learningPathTitles: Record<string, string> = {
  react: 'React',
  'web-stack': 'Web Stack',
  git: 'Git',
  fastapi: 'FastAPI',
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
        <Breadcrumb items={[
          { label: learningPathTitles[module.courseId] || module.courseId, href: `/learning-path/${module.courseId}` },
        ]} />
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
                    className="p-2 text-gray-600 hover:text-primary-700 hover:bg-gray-100 rounded-lg transition-colors hidden sm:flex"
                    title="Essential to know"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/lesson/${lesson.id}`}
                      className={`inline-flex items-center gap-1 h-[46px] px-4 font-bold rounded-lg transition-colors text-xs uppercase ${isNextUp ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                    >
                      {isNextUp ? <>Continue <ArrowRight className="w-3.5 h-3.5" /></> : 'Read Lesson'}
                    </a>
                    {exercises.length > 0 && (
                      <div className="inline-flex items-center gap-2 border-2 border-gray-300 bg-white rounded-lg px-3 py-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Exercises</span>
                        <div className="flex items-center gap-1.5">
                          {exercises.map((ex, idx) => {
                            const exCompleted = isExerciseCompleted(ex.id);
                            return (
                              <a
                                key={ex.id}
                                href={`/exercise/${ex.id}`}
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${exCompleted
                                  ? 'bg-primary-100 border-primary-500 text-primary-700 hover:bg-primary-200'
                                  : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
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
