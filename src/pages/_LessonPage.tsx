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
import { LessonChat } from '../components/LessonChat';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';

const learningPathTitles = getLearningPathTitles();
const courseTitles = getCourseTitles();

interface LessonPageProps {
  lessonId?: string;
}

function LessonPageContent({ lessonId }: LessonPageProps) {
  const { user, addXp, completeLesson, isLessonCompleted, isExerciseCompleted, loading, debugShowAll } = useUser();

  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const module = lesson ? getModule(lesson.moduleId) : undefined;
  const exercises = lessonId ? getExercisesForLesson(lessonId) : [];
  const moduleLessons = module ? getLessonsForModule(module.id) : [];

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showExerciseWarning, setShowExerciseWarning] = useState(false);
  const [lessonCompletedThisSession, setLessonCompletedThisSession] = useState(false);

  const alreadyCompleted = lesson ? isLessonCompleted(lesson.id) : false;
  const currentIndex = module && lesson ? moduleLessons.findIndex(l => l.id === lesson.id) : -1;
  const nextLesson = currentIndex >= 0 ? moduleLessons[currentIndex + 1] : undefined;

  const completedExercisesCount = exercises.filter(ex => isExerciseCompleted(ex.id)).length;
  const allExercisesDone = exercises.length === 0 || completedExercisesCount === exercises.length;

  const handleComplete = useCallback(() => {
    if (lesson) {
      addXp(getXpReward(lesson.xpReward));
      completeLesson(lesson.id);
      setShowCompletionModal(true);
      setLessonCompletedThisSession(true);
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
  const currentModuleIndex = module ? courseModules.findIndex(m => m.id === module.id) : -1;
  const nextModule = currentModuleIndex >= 0 ? courseModules[currentModuleIndex + 1] : undefined;

  // Position of current lesson in the entire course and module
  const courseLessonIndex = courseLessons.findIndex(l => l.id === lessonId);
  const currentCoursePosition = courseLessonIndex >= 0 ? courseLessonIndex + 1 : 0;
  const currentModulePosition = currentIndex >= 0 ? currentIndex + 1 : 0;

  // Auto-complete lesson only when all exercises are done
  useEffect(() => {
    if (alreadyCompleted || !lesson) return;

    if (exercises.length > 0 && completedExercisesCount === exercises.length) {
      handleComplete();
    }
  }, [exercises.length, completedExercisesCount, alreadyCompleted, lesson, handleComplete]);

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
                const isUnlocked = debugShowAll || idx === 0 || isLessonEffectivelyDone(moduleLessons[idx - 1].id);
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

          {nextLesson ? (
            (debugShowAll || alreadyCompleted || lessonCompletedThisSession || allExercisesDone) ? (
              <a
                href={`/lesson/${nextLesson.id}`}
                onClick={() => { if (!alreadyCompleted && !lessonCompletedThisSession) handleComplete(); }}
                className="inline-flex items-center gap-2 border-2 border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100 hover:border-primary-400 rounded-lg px-3 py-2 transition-colors font-bold text-sm"
              >
                Next Lesson →
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 border-2 border-gray-200 bg-gray-50 text-gray-400 rounded-lg px-3 py-2 font-bold text-sm cursor-not-allowed" title="Complete the lesson first">
                Next Lesson →
              </span>
            )
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-accent-500 font-bold uppercase hidden sm:inline">Last lesson!</span>
              {(alreadyCompleted || lessonCompletedThisSession) ? (
                <a
                  href={nextModule ? `/module/${nextModule.id}` : `/courses/${module.courseId}`}
                  className="inline-flex items-center gap-2 border-2 border-accent-300 bg-accent-50 text-accent-700 hover:bg-accent-100 hover:border-accent-400 rounded-lg px-3 py-2 transition-colors font-bold text-sm"
                >
                  {nextModule ? 'Next Module →' : 'Finish Course →'}
                </a>
              ) : (
                <button
                  onClick={handleCompleteClick}
                  className={`inline-flex items-center gap-2 border-2 rounded-lg px-3 py-2 transition-colors font-bold text-sm ${
                    allExercisesDone
                      ? 'border-accent-300 bg-accent-50 text-accent-700 hover:bg-accent-100 hover:border-accent-400 cursor-pointer'
                      : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {nextModule ? 'Finish Module ✓' : 'Finish Course ✓'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`border-2 rounded-lg p-5 ${(alreadyCompleted || lessonCompletedThisSession) ? 'border-primary-300 bg-primary-50/30' : 'border-gray-300 bg-white'}`}>
        {(alreadyCompleted || lessonCompletedThisSession) && (
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
            <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm rounded-lg border-2 border-gray-700 font-mono language-${lesson.codeLanguage || 'javascript'}`}>
              <code
                className={`language-${lesson.codeLanguage || 'javascript'}`}
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(
                    lesson.codeExample.trim(),
                    Prism.languages[lesson.codeLanguage || 'javascript'] || Prism.languages.javascript,
                    lesson.codeLanguage || 'javascript'
                  )
                }}
              />
            </pre>
          </div>
        )}
      </div>

      {/* Lesson action bar */}
      <div className="mt-4">
        {(alreadyCompleted || lessonCompletedThisSession) ? (
          <div className="border-2 border-primary-300 bg-primary-50 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span className="text-sm font-bold text-primary-800">
                {nextLesson
                  ? `Next up: ${nextLesson.title}`
                  : nextModule
                    ? `Next module: ${nextModule.title}`
                    : 'Course complete!'
                }
              </span>
            </div>
            {nextLesson ? (
              <NavButton href={`/lesson/${nextLesson.id}`} label="Next Lesson" variant="dark" className="flex-shrink-0" />
            ) : nextModule ? (
              <NavButton href={`/module/${nextModule.id}`} label="Next Module" variant="dark" className="flex-shrink-0" />
            ) : (
              <NavButton href={`/courses/${module.courseId}`} label="Back to Course" variant="primary" icon="book" className="flex-shrink-0" />
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
                  (debugShowAll || allExercisesDone)
                    ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
              >
                Complete lesson
                {(alreadyCompleted || lessonCompletedThisSession || allExercisesDone) && <CheckCircle className="w-4 h-4" />}
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

      <LessonCompletionModal
        isOpen={showCompletionModal}
        xpReward={getXpReward(lesson.xpReward)}
        hasNextLesson={!!nextLesson}
        nextLessonId={nextLesson?.id}
        nextModuleId={nextModule?.id}
        courseId={module.courseId}
        onReview={() => setShowCompletionModal(false)}
      />

      <LessonChat
        courseName={courseTitles[module.courseId] || module.courseId}
        moduleName={module.title}
        lessonName={lesson.title}
      />
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
