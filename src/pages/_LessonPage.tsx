import { useState, useEffect, useCallback } from 'react';
// Link and useParams replaced for Astro compatibility

import { useUser, UserProvider } from '../context/UserContext';
import { getLesson, getModule, getExercisesForLesson, getLessonsForModule, getModulesForCourse, lessons as allLessons } from '../data/modules';
import { getXpReward } from '../types';
import { getLearningPathTitles, getCourseTitles } from '../data/course-metadata';
import {
  CheckCircle,
  Code2,
  AlertCircle,
} from 'lucide-react';
import ReactMarkdown from './_ReactMarkdown';
import ProgressPath from '../components/ProgressPath';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageTitle';
import { NavButton } from '../components/NavButton';
import { LessonCompletionModal } from '../components/completion-modals';

const learningPathTitles = getLearningPathTitles();
const courseTitles = getCourseTitles();

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
  const [showExerciseWarning, setShowExerciseWarning] = useState(false);

  const alreadyCompleted = lesson ? isLessonCompleted(lesson.id) : false;
  const currentIndex = module && lesson ? moduleLessons.findIndex(l => l.id === lesson.id) : -1;
  const nextLesson = currentIndex >= 0 ? moduleLessons[currentIndex + 1] : undefined;

  const completedExercisesCount = exercises.filter(ex => isExerciseCompleted(ex.id)).length;
  const allExercisesDone = exercises.length === 0 || completedExercisesCount === exercises.length;

  const handleComplete = useCallback(() => {
    if (lesson) {
      addXp(getXpReward(lesson.xpReward));
      completeLesson(lesson.id);
      setCompleted(true);
    }
  }, [lesson, addXp, completeLesson]);

  const handleCompleteClick = useCallback(() => {
    if (!allExercisesDone) {
      setShowExerciseWarning(true);
      setTimeout(() => setShowExerciseWarning(false), 3000);
      return;
    }
    handleComplete();
  }, [allExercisesDone, handleComplete]);

  const isLessonEffectivelyDone = useCallback((lid: string) => {
    if (isLessonCompleted(lid)) return true;
    const exs = getExercisesForLesson(lid);
    return exs.length > 0 && exs.every(e => isExerciseCompleted(e.id));
  }, [isLessonCompleted, isExerciseCompleted]);

  // Course & module level data
  const courseModules = module ? getModulesForCourse(module.courseId) : [];
  const courseLessons = courseModules.flatMap(m => allLessons.filter(l => l.moduleId === m.id));
  
  // Position of current lesson in the entire course and module
  const courseLessonIndex = courseLessons.findIndex(l => l.id === lessonId);
  const currentCoursePosition = courseLessonIndex >= 0 ? courseLessonIndex + 1 : 0;
  const currentModulePosition = currentIndex >= 0 ? currentIndex + 1 : 0;

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
        <div className="mb-2">
          <ProgressPath items={[
            { name: module.title, current: currentModulePosition, total: moduleLessons.length, href: `/module/${module.id}`, parent: { name: courseTitles[module.courseId] || module.courseId, href: `/courses/${module.courseId}` } },
          ]} />
        </div>
        <PageHeader title={lesson.title} />

        {/* Lesson and exercise navigation */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 border-2 border-gray-300 bg-white rounded-lg px-3 py-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Lessons</span>
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

          {nextLesson && (
            <a
              href={`/lesson/${nextLesson.id}`}
              className="inline-flex items-center gap-2 border-2 border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100 hover:border-primary-400 rounded-lg px-3 py-2 transition-colors font-bold text-sm"
            >
              Next Lesson →
            </a>
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

      {/* Lesson action bar */}
      <div className="mt-4">
        {alreadyCompleted ? (
          <div className="border-2 border-primary-300 bg-primary-50 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
              <NavButton href={`/lesson/${nextLesson.id}`} label="Next Lesson" variant="dark" className="flex-shrink-0" />
            ) : (
              <NavButton href={`/module/${module.id}`} label="Back to Module" variant="primary" icon="book" className="flex-shrink-0" />
            )}
          </div>
        ) : (
          <div className="border-2 border-gray-300 bg-white rounded-lg p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                {exercises.length > 0 && (
                  <p className="text-xs text-gray-500 mb-1">
                    Exercises: {completedExercisesCount}/{exercises.length} completed
                  </p>
                )}
                {nextLesson && (
                  <p className="text-sm font-bold text-gray-700">
                    Next up: {nextLesson.title}
                  </p>
                )}
              </div>
              <button
                onClick={handleCompleteClick}
                className={`inline-flex items-center justify-center gap-2 font-bold py-2.5 px-5 rounded-lg border-2 transition-all text-sm uppercase flex-shrink-0 w-full sm:w-auto ${
                  allExercisesDone
                    ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
              >
                Complete lesson
                {allExercisesDone && <CheckCircle className="w-4 h-4" />}
              </button>
            </div>
            {showExerciseWarning && (
              <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Finish the exercises to complete the lesson
              </div>
            )}
          </div>
        )}
      </div>

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
