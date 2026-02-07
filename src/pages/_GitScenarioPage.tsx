import { useState, useEffect, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import type { GitScenarioExercise, Lesson, Exercise } from '../types';
import { useGitState } from '../hooks/useGitState';
import { checkAllObjectives } from '../utils/gitValidation';
import { getModulesForCourse, getLessonsForModule, getExercisesForLesson, lessons as allLessons } from '../data/modules';
import GitTerminal from '../components/GitTerminal';
import GitSimulator from '../components/GitSimulator';
import GitObjectives from '../components/GitObjectives';
import Breadcrumb from '../components/Breadcrumb';
import type { Module } from '../types';
import {
  ArrowLeft,
  RotateCcw,
  Lightbulb,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ExerciseCompletionModal } from '../components/completion-modals';

const learningPathTitles: Record<string, string> = {
  react: 'React',
  'web-stack': 'Web Fundamentals',
  git: 'Git',
  fastapi: 'FastAPI',
};

interface GitScenarioPageProps {
  exercise: GitScenarioExercise;
  lesson: Lesson;
  module: Module;
  lessonExercises: Exercise[];
  isExerciseCompleted: (id: string) => boolean;
}

export default function GitScenarioPage({
  exercise,
  lesson,
  module,
  lessonExercises,
  isExerciseCompleted,
}: GitScenarioPageProps) {
  const { completeExercise, completeLesson, isLessonCompleted, isExerciseCompleted: isExDone } = useUser();
  const { state, terminalHistory, executeCommand, reset, lastAction } = useGitState(exercise.initialState);

  // Course & module level progress for breadcrumb
  const courseModules = getModulesForCourse(module.courseId);
  const courseLessons = courseModules.flatMap(m => allLessons.filter(l => l.moduleId === m.id));
  const isLessonDone = (lid: string) => {
    if (isLessonCompleted(lid)) return true;
    const exs = getExercisesForLesson(lid);
    return exs.length > 0 && exs.every(e => isExDone(e.id));
  };
  const courseLessonsDone = courseLessons.filter(l => isLessonDone(l.id)).length;
  const moduleLessons = getLessonsForModule(module.id);
  const moduleLessonsDone = moduleLessons.filter(l => isLessonDone(l.id)).length;

  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showSimulator, setShowSimulator] = useState(true);

  const alreadyCompleted = isExerciseCompleted(exercise.id);
  const currentIndex = lessonExercises.findIndex(e => e.id === exercise.id);
  const nextExercise = lessonExercises[currentIndex + 1];

  const results = useMemo(
    () => checkAllObjectives(state, exercise.objectives),
    [state, exercise.objectives]
  );
  const allObjectivesMet = results.every(r => r.passed);

  useEffect(() => {
    if (allObjectivesMet && !completed) {
      const timer = setTimeout(() => {
        if (!alreadyCompleted) {
          completeExercise(exercise.id);
          const otherExercises = lessonExercises.filter(e => e.id !== exercise.id);
          const allOthersDone = otherExercises.every(e => isExerciseCompleted(e.id));
          if (allOthersDone && !isLessonCompleted(lesson.id)) {
            completeLesson(lesson.id);
          }
        }
        setCompleted(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [allObjectivesMet, completed, alreadyCompleted, exercise.id, lessonExercises, lesson.id, completeExercise, completeLesson, isExerciseCompleted, isLessonCompleted]);

  const handleReset = () => {
    reset();
    setCompleted(false);
    setShowHint(false);
    setCurrentHintIndex(0);
  };

  const handleNextHint = () => {
    if (!exercise.hints || exercise.hints.length === 0) return;
    if (!showHint) {
      setShowHint(true);
      setCurrentHintIndex(0);
    } else if (currentHintIndex < exercise.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
  };

  return (
    <div className="page-enter pb-20 lg:pb-0">
      <div className="mb-3 lg:mb-4">
        <Breadcrumb items={[
          { label: `${learningPathTitles[module.courseId] || module.courseId} (${courseLessonsDone}/${courseLessons.length})`, href: `/learning-path/${module.courseId}` },
          { label: `${module.title} (${moduleLessonsDone}/${moduleLessons.length})`, href: `/module/${module.id}` },
          { label: lesson.title, href: `/lesson/${lesson.id}` },
        ]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div className="relative inline-block group min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{exercise.title}</h1>
            <span className="absolute -bottom-0.5 left-0 w-12 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
          </div>
          <a
            href={`/lesson/${lesson.id}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Go back to lesson</span>
            <span className="sm:hidden">Back</span>
          </a>
        </div>
        {alreadyCompleted && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 rounded-lg border border-primary-200 text-xs sm:text-sm text-primary-700">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">You've already completed this exercise</span>
            <span className="sm:hidden">Completed</span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 lg:gap-3 mb-6 lg:mb-8">
        {/* Left Column: Story + Objectives + Terminal + Actions */}
        <div className="flex flex-col gap-2 order-1">
          {/* Story */}
          <div className="border-2 border-gray-300 bg-white rounded-lg p-2.5">
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Scenario</p>
            <p className="text-xs sm:text-sm leading-snug text-gray-700">{exercise.story}</p>
          </div>

          {/* Objectives */}
          <GitObjectives objectives={exercise.objectives} state={state} />

          {/* Hint */}
          {showHint && exercise.hints && exercise.hints.length > 0 && (
            <div className="p-2 border-2 border-yellow-400 bg-yellow-50 rounded-lg flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-yellow-700">{exercise.hints[currentHintIndex]}</p>
                {exercise.hints.length > 1 && (
                  <p className="text-[10px] text-yellow-500 mt-0.5">
                    Hint {currentHintIndex + 1} of {exercise.hints.length}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Terminal + Actions Container */}
          <div className="border-2 border-gray-300 bg-gray-900 rounded-lg overflow-hidden flex flex-col">
            <div className="min-h-[140px] sm:min-h-[160px] lg:min-h-[200px]">
              <GitTerminal history={terminalHistory} onExecute={executeCommand} />
            </div>
            
            {/* Actions Bar - collé sous le terminal */}
            <div className="flex items-center gap-2 px-2.5 py-2 bg-gray-800 border-t border-gray-700">
              {exercise.hints && exercise.hints.length > 0 && (
                <button
                  onClick={handleNextHint}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 transition-colors min-h-[28px] touch-manipulation"
                >
                  <Lightbulb className="w-3 h-3" />
                  {!showHint ? 'Hint' : 'Next'}
                </button>
              )}
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 transition-colors min-h-[28px] touch-manipulation"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Simulator */}
        <div className="flex flex-col gap-2 order-2 lg:order-2">
          {/* Collapsible simulator on mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="w-full flex items-center justify-between px-2.5 py-2 bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 touch-manipulation"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Git Visualizer
              </span>
              {showSimulator ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className={`${showSimulator ? '' : 'hidden'} lg:block lg:flex-1 border-2 border-gray-300 bg-white rounded-lg overflow-hidden min-h-[180px] sm:min-h-[200px]`}>
            <GitSimulator state={state} lastAction={lastAction} />
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {completed && (
        <ExerciseCompletionModal
          isOpen={true}
          alreadyCompleted={alreadyCompleted}
          hasNextExercise={!!nextExercise}
          nextExerciseId={nextExercise?.id}
          lessonId={lesson.id}
          onStay={() => setCompleted(false)}
        />
      )}
    </div>
  );
}
