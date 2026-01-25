import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getLesson, getModule, getExercisesForLesson, getLessonsForModule } from '../data/modules';
import {
  ArrowRight,
  CheckCircle,
  Code2,
  ChevronDown,
  ChevronUp,
  List,
  Lock,
  BookOpen,
  Star,
} from 'lucide-react';
import ReactMarkdown from './ReactMarkdown';
import Breadcrumb from '../components/Breadcrumb';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user, addXp, completeLesson, isLessonCompleted, isExerciseCompleted, loading } = useUser();

  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const module = lesson ? getModule(lesson.moduleId) : undefined;
  const exercises = lessonId ? getExercisesForLesson(lessonId) : [];
  const moduleLessons = module ? getLessonsForModule(module.id) : [];

  const [completed, setCompleted] = useState(false);
  const [showLessonsDropdown, setShowLessonsDropdown] = useState(false);
  const [showExercisesDropdown, setShowExercisesDropdown] = useState(false);

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

  if (!lesson || !module) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-900 font-bold">Lesson not found</p>
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

  const alreadyCompleted = isLessonCompleted(lesson.id);
  const currentIndex = moduleLessons.findIndex(l => l.id === lesson.id);
  const nextLesson = moduleLessons[currentIndex + 1];

  const completedExercisesCount = exercises.filter(ex => isExerciseCompleted(ex.id)).length;

  const handleComplete = () => {
    if (!alreadyCompleted) {
      addXp(lesson.xpReward);
      completeLesson(lesson.id);
    }
    setCompleted(true);
  };

  const isLessonEffectivelyDone = (lid: string) => {
    if (isLessonCompleted(lid)) return true;
    const exs = getExercisesForLesson(lid);
    return exs.length > 0 && exs.every(e => isExerciseCompleted(e.id));
  };

  return (
    <div className="page-enter">
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'React', href: '/learning-path/react' },
          { label: module.title, href: `/module/${module.id}` },
        ]} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative inline-block group">
            <h1 className="text-xl font-black text-gray-900 uppercase">{lesson.title}</h1>
            <span className="absolute -bottom-0.5 left-0 w-12 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowLessonsDropdown(!showLessonsDropdown)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-900 font-bold border-2 border-gray-300 hover:border-gray-900 transition-colors text-xs"
              >
                <List className="w-3.5 h-3.5" />
                Lessons
                {showLessonsDropdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {showLessonsDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowLessonsDropdown(false)} />
                  <div className="absolute top-full right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg z-20 min-w-[200px] shadow-lg max-h-[250px] overflow-y-auto">
                    <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                      <span className="text-xs font-bold text-gray-700 uppercase">{module.title}</span>
                    </div>
                    {moduleLessons.map((mLesson, idx) => {
                      const lessonCompleted = isLessonCompleted(mLesson.id);
                      const unlocked = idx === 0 || moduleLessons.slice(0, idx).some(l => isLessonEffectivelyDone(l.id));
                      return (
                        <Link
                          key={mLesson.id}
                          to={unlocked ? `/lesson/${mLesson.id}` : '#'}
                          onClick={() => { if (unlocked) setShowLessonsDropdown(false); }}
                          className={`flex items-center gap-2 px-3 py-2 border-b border-gray-100 last:border-b-0 ${!unlocked ? 'bg-gray-50 opacity-60 cursor-not-allowed' : 'hover:bg-primary-50'}`}
                        >
                          {!unlocked ? (
                            <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                          ) : lessonCompleted ? (
                            <CheckCircle className="w-4 h-4 text-primary-600 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded shrink-0" />
                          )}
                          <span className={`text-sm font-bold ${!unlocked ? 'text-gray-400' : lessonCompleted ? 'text-primary-700' : 'text-gray-900'}`}>
                            {idx + 1}. {mLesson.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            {exercises.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowExercisesDropdown(!showExercisesDropdown)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white font-bold border-2 border-gray-900 hover:bg-gray-800 transition-colors text-xs"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Exercises ({completedExercisesCount}/{exercises.length})
                  {showExercisesDropdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showExercisesDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowExercisesDropdown(false)} />
                    <div className="absolute top-full right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg z-20 min-w-[200px] shadow-lg max-h-[200px] overflow-y-auto">
                      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                        <span className="text-xs font-bold text-gray-700 uppercase">{lesson.title}</span>
                      </div>
                      {exercises.map((exercise) => {
                        const exCompleted = isExerciseCompleted(exercise.id);
                        return (
                          <Link
                            key={exercise.id}
                            to={`/exercise/${exercise.id}`}
                            onClick={() => setShowExercisesDropdown(false)}
                            className={`flex items-center gap-2 px-3 py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${exCompleted ? 'bg-primary-50' : ''}`}
                          >
                            {exCompleted ? (
                              <CheckCircle className="w-4 h-4 text-primary-600 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded shrink-0" />
                            )}
                            <span className={`text-sm font-bold ${exCompleted ? 'text-primary-700' : 'text-gray-900'}`}>
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
            {!alreadyCompleted && (
              <button
                onClick={handleComplete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white font-bold border-2 border-primary-600 hover:bg-primary-700 transition-colors text-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Complete Course
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`border-2 rounded-lg p-5 ${alreadyCompleted ? 'border-primary-300 bg-primary-50/30' : 'border-gray-300 bg-white'}`}>
        {alreadyCompleted && (
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary-200">
            <CheckCircle className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-bold text-primary-700">Lesson completed</span>
          </div>
        )}
        <ReactMarkdown content={lesson.content} />

        {lesson.codeExample && (
          <div className="mt-5 pt-4 border-t-2 border-gray-200">
            <p className="font-bold text-sm uppercase mb-3 flex items-center gap-2 text-gray-900">
              <Code2 className="w-4 h-4 text-primary-600" /> Example
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm rounded-lg border-2 border-gray-700">
              <code>{lesson.codeExample}</code>
            </pre>
          </div>
        )}
      </div>

      {completed && !alreadyCompleted && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-primary-500 p-8 text-center max-w-sm animate-pop shadow-brutal">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-black uppercase text-primary-600 mb-1">WELL DONE!</h2>
            <p className="text-gray-700 mb-2">Course completed</p>
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 border-2 border-black font-black text-lg mb-6">
              <Star className="w-5 h-5" />
              +{lesson.xpReward} XP
            </div>
            <div className="flex flex-col gap-2">
              {nextLesson ? (
                <Link to={`/lesson/${nextLesson.id}`} className="w-full py-3 bg-gray-900 text-white font-black uppercase border-2 border-black hover:bg-gray-800 transition-colors">
                  Next Lesson <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>
              ) : (
                <Link to={`/module/${module.id}`} className="w-full py-3 bg-primary-600 text-white font-black uppercase border-2 border-black hover:bg-primary-700 transition-colors">
                  <BookOpen className="w-4 h-4 inline mr-1" /> Back to Module
                </Link>
              )}
              <button onClick={() => setCompleted(false)} className="w-full py-3 font-black uppercase border-2 border-gray-300 hover:bg-gray-50 transition-colors">
                Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
