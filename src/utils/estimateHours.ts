import { lessons, modules, getModulesForCourse, getExercisesForLesson, getExercisesForModule } from '../data/modules';
import type { Lesson, Module, Exercise } from '../types';

/**
 * Estimate hours for a single lesson
 * Based on: content length, number of exercises, and difficulty
 */
export function estimateLessonHours(lesson: Lesson): number {
  // If lesson has explicit estimated minutes, use it
  const lessonWithEstimate = lesson as any;
  if (lessonWithEstimate.estimatedMinutes) {
    return lessonWithEstimate.estimatedMinutes / 60;
  }

  // Otherwise estimate based on content and exercises
  const contentLength = lesson.content?.length || 0;
  const exercises = getExercisesForLesson(lesson.id);

  // Base estimation: ~200 words per 10 minutes of reading
  const contentMinutes = Math.max(10, Math.ceil(contentLength / 20 / 10) * 10);

  // Exercise time: 5-15 minutes each depending on difficulty
  const exerciseMinutes = exercises.reduce((total, ex) => {
    const baseMinutes = ex.difficulty === 'easy' ? 5 : ex.difficulty === 'medium' ? 10 : 15;
    return total + baseMinutes;
  }, 0);

  const totalMinutes = contentMinutes + exerciseMinutes;
  return Math.max(0.25, Math.round(totalMinutes / 15) * 0.25); // Round to nearest 15 minutes
}

/**
 * Estimate hours for a module
 */
export function estimateModuleHours(module: Module): number {
  const moduleLessons = lessons.filter(l => l.moduleId === module.id);
  const totalHours = moduleLessons.reduce((total, lesson) => total + estimateLessonHours(lesson), 0);
  return Math.round(totalHours * 10) / 10; // Round to 1 decimal
}

/**
 * Estimate hours for a course (by courseId)
 */
export function estimateCourseHours(courseId: string): number {
  const courseModules = getModulesForCourse(courseId);
  const totalHours = courseModules.reduce((total, module) => total + estimateModuleHours(module), 0);
  return Math.round(totalHours * 10) / 10;
}

/**
 * Estimate hours for a learning path (list of course IDs)
 */
export function estimatePathHours(courseIds: string[]): number {
  const totalHours = courseIds.reduce((total, courseId) => total + estimateCourseHours(courseId), 0);
  return Math.round(totalHours * 10) / 10;
}

/**
 * Get total hours for all content
 */
export function getTotalContentHours(): number {
  const courseIds = [...new Set(modules.map(m => m.courseId))];
  return estimatePathHours(courseIds);
}

/**
 * Format hours for display
 */
export function formatHours(hours: number): string {
  const wholeHours = Math.round(hours);
  return `${wholeHours}h`;
}

/**
 * Get hours remaining for a lesson (estimated - already completed portion)
 */
export function getRemainigLessonHours(lesson: Lesson, isCompleted: boolean): number {
  if (isCompleted) return 0;
  return estimateLessonHours(lesson);
}

/**
 * Get estimated hours for next lesson in a course
 */
export function getEstimatedNextLessonHours(nextLessonId: string): number {
  const nextLesson = lessons.find(l => l.id === nextLessonId);
  return nextLesson ? estimateLessonHours(nextLesson) : 0;
}
