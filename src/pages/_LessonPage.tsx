import { useState, useEffect, useCallback } from 'react';
// Link and useParams replaced for Astro compatibility

import { useUser, UserProvider } from '../context/UserContext';
import { getLesson, getModule, getExercisesForLesson, getLessonsForModule, getModulesForCourse, lessons as allLessons } from '../data/modules';
import { getXpReward } from '../types';
import {
  CheckCircle,
  Code2,
} from 'lucide-react';
import ReactMarkdown from './_ReactMarkdown';
import Breadcrumb from '../components/Breadcrumb';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageTitle';
import { LessonCompletionModal } from '../components/completion-modals';

const learningPathTitles: Record<string, string> = {
  react: 'React',
  'web-stack': 'Web Fundamentals',
  git: 'Git',
  fastapi: 'FastAPI',
};

interface LessonPageProps {
  lessonId?: string;
}

function LessonPageContent({ lessonId }: LessonPageProps) {
  const { user, addXp, completeLesson, isLessonCompleted, isExerciseCompleted, loading } = useUser();

  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const module = lesson ? getModule(lesson.moduleId) : undefined;
  const exercises = lessonId ? getExercisesForLesson(lessonId) : [];
  const moduleLessons = module ? getLessonsForModule(module.id) : [];

  const [completed, setCompleted] = useState(false);

  const alreadyCompleted = lesson ? isLessonCompleted(lesson.id) : false;
  const currentIndex = module && lesson ? moduleLessons.findIndex(l => l.id === lesson.id) : -1;
  const nextLesson = currentIndex >= 0 ? moduleLessons[currentIndex + 1] : undefined;

  const completedExercisesCount = exercises.filter(ex => isExerciseCompleted(ex.id)).length;

  const handleComplete = useCallback(() => {
    if (lesson) {
      addXp(getXpReward(lesson.xpReward));
      completeLesson(lesson.id);
      setCompleted(true);
    }
  }, [lesson, addXp, completeLesson]);

  const isLessonEffectivelyDone = useCallback((lid: string) => {
    if (isLessonCompleted(lid)) return true;
    const exs = getExercisesForLesson(lid);
    return exs.length > 0 && exs.every(e => isExerciseCompleted(e.id));
  }, [isLessonCompleted, isExerciseCompleted]);

  // Course & module level progress for breadcrumb
  const courseModules = module ? getModulesForCourse(module.courseId) : [];
  const courseLessons = courseModules.flatMap(m => allLessons.filter(l => l.moduleId === m.id));
  const courseLessonsDone = courseLessons.filter(l => isLessonEffectivelyDone(l.id)).length;
  const moduleLessonsDone = moduleLessons.filter(l => isLessonEffectivelyDone(l.id)).length;

  // Auto-complete lesson when all exercises are done
  useEffect(() => {
    if (exercises.length > 0 && completedExercisesCount === exercises.length && !alreadyCompleted) {
      handleComplete();
    }
  }, [completedExercisesCount, exercises.length, alreadyCompleted, handleComplete]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!lesson || !module) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-900 font-bold">Lesson not found</p>
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
    <div className="page-enter max-w-6xl mx-auto px-3">
      <div className="mb-6">
        <Breadcrumb items={[
          { label: `${learningPathTitles[module.courseId] || module.courseId} (${courseLessonsDone}/${courseLessons.length})`, href: `/learning-path/${module.courseId}` },
          { label: `${module.title} (${moduleLessonsDone}/${moduleLessons.length})`, href: `/module/${module.id}` },
        ]} />
        <PageHeader title={lesson.title} />

        {/* Lesson and exercise navigation */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 border-2 border-gray-300 bg-white rounded-lg px-3 py-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Courses</span>
            <div className="flex items-center gap-1.5">
              {moduleLessons.map((mLesson, idx) => {
                const isDone = isLessonEffectivelyDone(mLesson.id);
                const isCurrent = mLesson.id === lesson.id;
                const isUnlocked = idx === 0 || isLessonEffectivelyDone(moduleLessons[idx - 1].id);
                return (
                  <a
                    key={mLesson.id}
                    href={isUnlocked ? `/lesson/${mLesson.id}` : '#'}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${!isUnlocked
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
                  </a>
                );
              })}
            </div>
          </div>

          {exercises.length > 0 && (
            <div className="inline-flex items-center gap-2 border-2 border-gray-300 bg-white rounded-lg px-3 py-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Exercises</span>
              <div className="flex items-center gap-1.5">
                {exercises.map((ex, idx) => {
                  const isDone = isExerciseCompleted(ex.id);
                  return (
                    <a
                      key={ex.id}
                      href={`/exercise/${ex.id}`}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${isDone
                        ? 'bg-primary-100 border-primary-500 text-primary-700 hover:bg-primary-200'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                      title={`Exercise ${idx + 1}: ${ex.title}${isDone ? ' (completed)' : ''}`}
                    >
                      {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
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

      {/* Persistent next step banner for already-completed lessons */}
      {alreadyCompleted && !completed && (
        <div className="mt-4 border-2 border-primary-300 bg-primary-50 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
            <span className="text-sm font-bold text-primary-800">
              {nextLesson
                ? `Next up: ${nextLesson.title}`
                : 'All lessons in this module done!'
              }
            </span>
          </div>
          {nextLesson ? (
            <a
              href={`/lesson/${nextLesson.id}`}
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-gray-800 transition-colors text-sm uppercase flex-shrink-0"
            >
              Next Lesson <span className="ml-1">&rarr;</span>
            </a>
          ) : (
            <a
              href={`/module/${module.id}`}
              className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-primary-700 transition-colors text-sm uppercase flex-shrink-0"
            >
              Back to Module
            </a>
          )}
        </div>
      )}

      {completed && !alreadyCompleted && (
        <LessonCompletionModal
          isOpen={true}
          xpReward={getXpReward(lesson.xpReward)}
          hasNextLesson={!!nextLesson}
          nextLessonId={nextLesson?.id}
          moduleId={module.id}
          onReview={() => setCompleted(false)}
        />
      )}
    </div>
  );
}

export default function LessonPage(props: LessonPageProps) {
  return (
    <UserProvider>
      <LessonPageContent {...props} />
    </UserProvider>
  );
}
