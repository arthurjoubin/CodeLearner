import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getModule, getLessonsForModule, getExercisesForLesson, getLesson } from '../data/modules';
import { CheckCircle, Lock, BookOpen, X, Code, ChevronDown, ChevronUp } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user, isLessonCompleted, isExerciseCompleted, loading } = useUser();
  const [showEssentialPopup, setShowEssentialPopup] = useState(false);
  const [essentialContent, setEssentialContent] = useState('');
  const [showExercisesDropdown, setShowExercisesDropdown] = useState<string | null>(null);

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
      setEssentialContent(essentialPart);
      setShowEssentialPopup(true);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-900 font-bold">Module not found</p>
        <Link to="/" className="text-primary-600 underline font-bold uppercase text-xs">Go back home</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-900 font-bold">Please sign in</p>
        <Link to="/" className="text-primary-600 underline font-bold uppercase text-xs">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'React', href: '/learning-path/react' },
        ]} />
        <div className="relative inline-block group">
          <h1 className="text-2xl font-black text-gray-900 uppercase">{module.title}</h1>
          <span className="absolute -bottom-0.5 left-0 w-12 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
        </div>
        <p className="text-gray-700 mt-1">{module.description}</p>
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

          if (!isUnlocked) {
            return (
              <div key={lesson.id} className="border-2 border-gray-300 bg-gray-100 p-4 rounded-lg opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 flex items-center justify-center text-gray-600 font-bold rounded-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-600 uppercase text-sm truncate">{lesson.title}</h3>
                    <p className="text-xs text-gray-500">Locked</p>
                  </div>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            );
          }

          return (
            <div
              key={lesson.id}
              className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${isComplete ? 'border-primary-500 bg-primary-50/50' : 'border-gray-300 bg-white hover:border-primary-500'}`}
            >
              <div className="flex items-start sm:items-center gap-3 flex-col sm:flex-row">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center font-bold border-2 rounded-lg ${isComplete ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-800 border-gray-300'}`}>
                    {isComplete ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                      <h3 className="font-bold text-gray-900 uppercase text-sm truncate">{lesson.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 mt-1 ml-4">
                      <span className="text-xs text-gray-700 font-bold">{lesson.xpReward} XP</span>
                    </div>
                  </div>
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
                    <Link
                      to={`/lesson/${lesson.id}`}
                      className="flex items-center gap-1.5 px-3 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      Course
                    </Link>
                    {exercises.length > 0 && (
                      <div className="relative">
                        <button
                          onClick={() => setShowExercisesDropdown(showExercisesDropdown === lesson.id ? null : lesson.id)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors text-sm"
                        >
                          <Code className="w-4 h-4" />
                          Exercises
                          {showExercisesDropdown === lesson.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        {showExercisesDropdown === lesson.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowExercisesDropdown(null)} />
                            <div className="absolute top-full right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg z-20 min-w-[200px] shadow-lg max-h-[200px] overflow-y-auto">
                              {exercises.map((exercise) => {
                                const exCompleted = isExerciseCompleted(exercise.id);
                                return (
                                  <Link
                                    key={exercise.id}
                                    to={`/exercise/${exercise.id}`}
                                    onClick={() => setShowExercisesDropdown(null)}
                                    className={`flex items-center gap-2 px-3 py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${exCompleted ? 'bg-primary-50' : ''}`}
                                  >
                                    {exCompleted ? (
                                      <CheckCircle className="w-4 h-4 text-primary-600 shrink-0" />
                                    ) : (
                                      <div className="w-4 h-4 border-2 border-gray-300 rounded shrink-0" />
                                    )}
                                    <span className={`text-sm font-medium ${exCompleted ? 'text-primary-700' : 'text-gray-900'}`}>
                                      {exercise.title}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </>
                        )}
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
              <h3 className="font-bold uppercase text-gray-900">Essential to know</h3>
              <button onClick={() => setShowEssentialPopup(false)} className="ml-auto p-1.5 hover:bg-gray-200 rounded transition-colors">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700 space-y-1" dangerouslySetInnerHTML={{ 
              __html: essentialContent
                .replace(/^# Essential to know\n/, '')
                .replace(/^# (.+)$/gm, '<strong>$1</strong>')
                .replace(/^- /m, '<span class="text-primary-500 font-bold">•</span> ')
                .replace(/\n- /g, '\n<span class="text-primary-500 font-bold">•</span> ')
                .replace(/\n/g, '<br/>')
                .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-primary-600 font-mono text-xs">$1</code>')
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
