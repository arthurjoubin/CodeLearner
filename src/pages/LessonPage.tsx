import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getLesson, getModule, getExercisesForLesson, getLessonsForModule } from '../data/modules';
import { getXpReward } from '../types';
import {
  ArrowRight,
  CheckCircle,
  Code2,
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
    addXp(getXpReward(lesson.xpReward));
    completeLesson(lesson.id);
    setCompleted(true);
  };

  const isLessonEffectivelyDone = (lid: string) => {
    if (isLessonCompleted(lid)) return true;
    const exs = getExercisesForLesson(lid);
    return exs.length > 0 && exs.every(e => isExerciseCompleted(e.id));
  };

  return (
    <div className="page-enter max-w-6xl mx-auto px-3">
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'React', href: '/learning-path/react' },
          { label: module.title, href: `/module/${module.id}` },
        ]} />
        <div className="flex items-center justify-between gap-4">
          <div className="relative inline-block group min-w-0 flex-1">
            <h1 className="text-xl font-black text-gray-900 uppercase truncate">{lesson.title}</h1>
            <span className="absolute -bottom-0.5 left-0 w-12 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
          </div>

          {/* Lesson navigation */}
          <div className="flex items-center gap-2 flex-shrink-0 border-2 border-gray-300 bg-white rounded-lg px-3 py-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Courses</span>
            <div className="flex items-center gap-1.5">
              {moduleLessons.map((mLesson, idx) => {
                const isDone = isLessonEffectivelyDone(mLesson.id);
                const isCurrent = mLesson.id === lesson.id;
                const isUnlocked = idx === 0 || isLessonEffectivelyDone(moduleLessons[idx - 1].id);
                return (
                  <Link
                    key={mLesson.id}
                    to={isUnlocked ? `/lesson/${mLesson.id}` : '#'}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                      !isUnlocked
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : isCurrent
                          ? isDone
                            ? 'bg-primary-500 border-primary-500 text-white'
                            : 'bg-gray-900 border-gray-900 text-white'
                          : isDone
                            ? 'bg-primary-100 border-primary-500 text-primary-700 hover:bg-primary-200'
                            : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                    title={`Lesson ${idx + 1}: ${mLesson.title}${isDone ? ' (completed)' : ''}${!isUnlocked ? ' (locked)' : ''}`}
                  >
                    {isDone && !isCurrent ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Exercise navigation - shown when exercises exist */}
        {exercises.length > 0 && (
          <div className="mt-3 inline-flex items-center gap-3 border-2 border-gray-300 bg-white rounded-lg px-3 py-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Exercises</span>
            <div className="flex items-center gap-1.5">
              {exercises.map((ex, idx) => {
                const isDone = isExerciseCompleted(ex.id);
                return (
                  <Link
                    key={ex.id}
                    to={`/exercise/${ex.id}`}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                      isDone
                        ? 'bg-primary-100 border-primary-500 text-primary-700 hover:bg-primary-200'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                    title={`Exercise ${idx + 1}: ${ex.title}${isDone ? ' (completed)' : ''}`}
                  >
                    {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Complete button */}
        <div className="mt-3 flex items-center gap-3">
          <div className="relative inline-block group">
            <button
              onClick={handleComplete}
              disabled={alreadyCompleted || (exercises.length > 0 && completedExercisesCount !== exercises.length)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-bold border-2 transition-colors text-xs rounded-lg ${
                alreadyCompleted
                  ? 'bg-primary-100 text-primary-700 border-primary-300 cursor-default'
                  : (exercises.length === 0 || completedExercisesCount === exercises.length)
                    ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 cursor-pointer'
                    : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {alreadyCompleted ? 'Completed' : 'Complete Lesson'}
            </button>
            {exercises.length > 0 && completedExercisesCount !== exercises.length && !alreadyCompleted && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Complete exercises first
              </div>
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
              +{getXpReward(lesson.xpReward)} XP
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
