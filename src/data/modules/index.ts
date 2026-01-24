/**
 * Data loader for course modules
 *
 * This module loads all course data from individual JSON files.
 * Each module is stored in its own JSON file for easy editing and LLM-friendly updates.
 *
 * Structure of each JSON file:
 * {
 *   "module": { id, title, description, icon, requiredXp, color },
 *   "lessons": [ ... ],
 *   "exercises": [ ... ]
 * }
 */

import type { Module, Lesson, Exercise } from '../../types';

// Import all module JSON files
// Type assertions needed since JSON imports are loosely typed
import jsxBasicsData from './jsx-basics.json';
import componentsPropsData from './components-props.json';
import stateHooksData from './state-hooks.json';
import eventsData from './events.json';
import effectsData from './effects.json';
import typescriptReactData from './typescript-react.json';
import listsKeysData from './lists-keys.json';
import formsValidationData from './forms-validation.json';
import contextApiData from './context-api.json';
import customHooksData from './custom-hooks.json';
import performanceData from './performance.json';
import reactRouterData from './react-router.json';

// Type for the JSON file structure
interface ModuleData {
  module: Omit<Module, 'lessons'>;
  lessons: Lesson[];
  exercises: Exercise[];
}

// All module data files with type assertions
const moduleFiles: ModuleData[] = [
  jsxBasicsData as ModuleData,
  componentsPropsData as ModuleData,
  stateHooksData as ModuleData,
  eventsData as ModuleData,
  effectsData as ModuleData,
  typescriptReactData as ModuleData,
  listsKeysData as ModuleData,
  formsValidationData as ModuleData,
  contextApiData as ModuleData,
  customHooksData as ModuleData,
  performanceData as ModuleData,
  reactRouterData as ModuleData,
];

// Type for module metadata in JSON (includes courseId)
interface ModuleMetadata {
  id: string;
  courseId: string;
  title: string;
  description: string;
  icon: string;
  requiredXp: number;
  color: string;
}

// Build the aggregated data structures
export const modules: Module[] = moduleFiles.map(data => ({
  ...(data.module as ModuleMetadata),
  lessons: [], // Keep empty as per original structure
}));

export const lessons: Lesson[] = moduleFiles.flatMap(data => data.lessons);

export const exercises: Exercise[] = moduleFiles.flatMap(data => data.exercises);

// Helper functions (same API as before)

export function getModule(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getLesson(id: string): Lesson | undefined {
  return lessons.find(l => l.id === id);
}

export function getLessonsForModule(moduleId: string): Lesson[] {
  return lessons.filter(l => l.moduleId === moduleId).sort((a, b) => a.order - b.order);
}

export function getExercisesForLesson(lessonId: string): Exercise[] {
  return exercises.filter(e => e.lessonId === lessonId);
}

export function getExercisesForModule(moduleId: string): Exercise[] {
  return exercises.filter(e => e.moduleId === moduleId);
}

export function getExercise(id: string): Exercise | undefined {
  return exercises.find(e => e.id === id);
}

// Course-related helpers

export function getModulesForCourse(courseId: string): Module[] {
  return modules.filter(m => m.courseId === courseId);
}

export function getCourseIds(): string[] {
  const ids = new Set(modules.map(m => m.courseId));
  return Array.from(ids);
}
