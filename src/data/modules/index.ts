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

// ============================================
// LEARNING PATH 1: WEB FUNDAMENTALS
// ============================================

// Course: internet-tools (Internet & Tools) - Reordered for vibe coder progression
import ideSetupData from './ide-setup.json';
import terminalCliData from './terminal-cli.json';
import howWebWorksData from './how-web-works.json';
import dataFormatsLogsData from './data-formats-logs.json';
import devtoolsDebuggingData from './devtools-debugging.json';
import packageManagersData from './package-managers.json';
import buildToolsData from './build-tools.json';
import envConfigData from './env-config.json';
import vibeCodingMasteryData from './vibe-coding-mastery.json';

// Course: git-mastery (Git Mastery)
import gitBasicsData from './git-basics.json';
import gitBranchesData from './git-branches.json';
import gitHistoryData from './git-history.json';
import gitRemotesData from './git-remotes.json';
import gitFlowData from './git-flow.json';
import gitRebaseData from './git-rebase.json';
import gitAdvancedData from './git-advanced.json';

// Course: javascript-core (JavaScript Core)
import jsVariablesTypesData from './js-variables-types.json';
import jsFunctionsData from './js-functions.json';
import jsArraysObjectsData from './js-arrays-objects.json';
import jsAsyncData from './js-async.json';
import jsDomData from './js-dom.json';
import jsModernData from './js-modern.json';
import typescriptBasicsData from './typescript-basics.json';
import jsApiConsumptionData from './js-api-consumption.json';
// Browser Storage moved to frontend-production to avoid duplication

// ============================================
// LEARNING PATH 2: FRONTEND
// ============================================

// Course: html-css-tailwind (HTML, CSS & Tailwind)
import htmlFundamentalsData from './html-fundamentals.json';
import htmlFormsMediaData from './html-forms-media.json';
import cssFundamentalsData from './css-fundamentals.json';
import cssLayoutData from './css-layout.json';
import tailwindBasicsData from './tailwind-basics.json';
import tailwindComponentsData from './tailwind-components.json';
import accessibilityBasicsData from './accessibility-basics.json';

// Course: react (React)
import jsxBasicsData from './jsx-basics.json';
import componentsPropsData from './components-props.json';
import stateHooksData from './state-hooks.json';
import eventsData from './events.json';
import effectsData from './effects.json';
import listsKeysData from './lists-keys.json';
import formsValidationData from './forms-validation.json';
import contextApiData from './context-api.json';
import stateManagementData from './state-management.json';
import customHooksData from './custom-hooks.json';
import reactRouterData from './react-router.json';
import performanceData from './performance.json';
import reactAdvancedPatternsData from './react-advanced-patterns.json';
import typescriptReactData from './typescript-react.json';

// Course: frontend-production (Frontend Production)
import testingBasicsData from './testing-basics.json';
import webPerformanceData from './web-performance.json';
import securityBasicsData from './security-basics.json';
import browserStorageData from './browser-storage.json';
import pwaBasicsData from './pwa-basics.json';
import i18nBasicsData from './i18n-basics.json';

// ============================================
// LEARNING PATH 3: BACKEND
// ============================================

// Course: node-express (Node.js & Express)
import nodejsIntroData from './nodejs-intro.json';
import nodejsModulesData from './nodejs-modules.json';
import nodejsAsyncData from './nodejs-async.json';
import nodejsNpmData from './nodejs-npm.json';
import expressIntroData from './express-intro.json';
import expressMiddlewareData from './express-middleware.json';
import restApiDesignData from './rest-api-design.json';
import expressApisData from './express-apis.json';
import backendTestingData from './backend-testing.json';
// backend-docker and express-production moved to deployment course

// Course: databases (Databases)
import dbConceptsData from './db-concepts.json';
import dbSqlFundamentalsData from './db-sql-fundamentals.json';
import dbSqliteData from './db-sqlite.json';
import dbPostgresqlData from './db-postgresql.json';
import dbOrmsData from './db-orms.json';

// Course: auth-security (Authentication & Security)
import authFundamentalsData from './auth-fundamentals.json';
import authJwtSessionData from './auth-jwt-session.json';
import authOAuthData from './auth-oauth.json';
import authSecurityData from './auth-security.json';

// ============================================
// LEARNING PATH 4: FULLSTACK
// ============================================

// Course: nextjs (Next.js)
import nextjsFundamentalsData from './nextjs-fundamentals.json';
import nextjsServerComponentsData from './nextjs-server-components.json';
import nextjsDataFetchingData from './nextjs-data-fetching.json';
import nextjsApiRoutesData from './nextjs-api-routes.json';
import nextjsAuthData from './nextjs-auth.json';
import nextjsMiddlewareData from './nextjs-middleware.json';
import nextjsDeploymentData from './nextjs-deployment.json';

// Course: architecture-patterns (Architecture & Patterns)
import architecturePatternsData from './architecture-patterns.json';
import makingRightChoiceData from './making-right-choice.json';
import devopsBasicsData from './devops-basics.json';
import websocketsBasicsData from './websockets-basics.json';

// Course: advanced-topics (Advanced Topics)
import frontendFrameworksData from './frontend-frameworks.json';
import backendFrameworksData from './backend-frameworks.json';
import fullstackFrameworksData from './fullstack-frameworks.json';
// dataFormatsLogsData moved to internet-tools course

// ============================================
// LEARNING PATH 4: FULLSTACK - DEPLOYMENT COURSE
// ============================================

// Course: deployment (Deployment)
import deploymentFundamentalsData from './deployment-fundamentals.json';
import expressProductionData from './express-production.json';
import backendDockerData from './backend-docker.json';
// import frontendDeploymentData from './frontend-deployment.json'; // File temporarily disabled due to corruption

// Type for the JSON file structure
interface ModuleData {
  module: Omit<Module, 'lessons'>;
  lessons: Lesson[];
  exercises: Exercise[];
}

// All module data files with type assertions
const moduleFiles: ModuleData[] = [
  // ============================================
  // LEARNING PATH 1: WEB FUNDAMENTALS
  // ============================================

  // Course: internet-tools (Reordered: IDE → Terminal → Web → Data/Logs → DevTools → Package Mgrs → Build → Env → Vibe Coding)
  ideSetupData as ModuleData,
  terminalCliData as ModuleData,
  howWebWorksData as ModuleData,
  dataFormatsLogsData as ModuleData,
  devtoolsDebuggingData as ModuleData,
  packageManagersData as ModuleData,
  buildToolsData as ModuleData,
  envConfigData as ModuleData,
  vibeCodingMasteryData as ModuleData,
  
  // Course: git-mastery
  gitBasicsData as ModuleData,
  gitBranchesData as ModuleData,
  gitHistoryData as ModuleData,
  gitRemotesData as ModuleData,
  gitFlowData as ModuleData,
  gitRebaseData as ModuleData,
  gitAdvancedData as ModuleData,
  
  // Course: javascript-core (Browser Storage removed - now only in frontend-production)
  jsVariablesTypesData as ModuleData,
  jsFunctionsData as ModuleData,
  jsArraysObjectsData as ModuleData,
  jsAsyncData as ModuleData,
  jsApiConsumptionData as ModuleData,
  jsDomData as ModuleData,
  jsModernData as ModuleData,
  typescriptBasicsData as ModuleData,
  
  // ============================================
  // LEARNING PATH 2: FRONTEND
  // ============================================
  
  // Course: html-css-tailwind
  htmlFundamentalsData as ModuleData,
  htmlFormsMediaData as ModuleData,
  cssFundamentalsData as ModuleData,
  cssLayoutData as ModuleData,
  tailwindBasicsData as ModuleData,
  tailwindComponentsData as ModuleData,
  accessibilityBasicsData as ModuleData,
  
  // Course: react
  jsxBasicsData as ModuleData,
  componentsPropsData as ModuleData,
  stateHooksData as ModuleData,
  eventsData as ModuleData,
  effectsData as ModuleData,
  listsKeysData as ModuleData,
  formsValidationData as ModuleData,
  contextApiData as ModuleData,
  stateManagementData as ModuleData,
  customHooksData as ModuleData,
  reactRouterData as ModuleData,
  performanceData as ModuleData,
  reactAdvancedPatternsData as ModuleData,
  typescriptReactData as ModuleData,
  
  // Course: frontend-production
  testingBasicsData as ModuleData,
  webPerformanceData as ModuleData,
  securityBasicsData as ModuleData,
  browserStorageData as ModuleData,
  pwaBasicsData as ModuleData,
  i18nBasicsData as ModuleData,
  
  // ============================================
  // LEARNING PATH 3: BACKEND
  // ============================================
  
  // Course: node-express (Docker and Express Production moved to deployment)
  nodejsIntroData as ModuleData,
  nodejsModulesData as ModuleData,
  nodejsAsyncData as ModuleData,
  nodejsNpmData as ModuleData,
  expressIntroData as ModuleData,
  expressMiddlewareData as ModuleData,
  restApiDesignData as ModuleData,
  expressApisData as ModuleData,
  backendTestingData as ModuleData,
  
  // Course: databases
  dbConceptsData as ModuleData,
  dbSqlFundamentalsData as ModuleData,
  dbSqliteData as ModuleData,
  dbPostgresqlData as ModuleData,
  dbOrmsData as ModuleData,
  
  // Course: auth-security
  authFundamentalsData as ModuleData,
  authJwtSessionData as ModuleData,
  authOAuthData as ModuleData,
  authSecurityData as ModuleData,
  
  // ============================================
  // LEARNING PATH 4: FULLSTACK
  // ============================================
  
  // Course: nextjs
  nextjsFundamentalsData as ModuleData,
  nextjsServerComponentsData as ModuleData,
  nextjsDataFetchingData as ModuleData,
  nextjsApiRoutesData as ModuleData,
  nextjsAuthData as ModuleData,
  nextjsMiddlewareData as ModuleData,
  nextjsDeploymentData as ModuleData,
  
  // Course: architecture-patterns
  architecturePatternsData as ModuleData,
  makingRightChoiceData as ModuleData,
  devopsBasicsData as ModuleData,
  websocketsBasicsData as ModuleData,
  
  // Course: advanced-topics (dataFormatsLogsData moved to internet-tools)
  frontendFrameworksData as ModuleData,
  backendFrameworksData as ModuleData,
  fullstackFrameworksData as ModuleData,
  
  // ============================================
  // LEARNING PATH 4: FULLSTACK - DEPLOYMENT COURSE
  // ============================================

  // Course: deployment (includes Express Production and Docker from Backend path)
  deploymentFundamentalsData as ModuleData,
  expressProductionData as ModuleData,
  backendDockerData as ModuleData,
  // frontendDeploymentData as ModuleData, // File temporarily disabled
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

// ============================================
// Helper functions (same API as before)
// ============================================

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

// ============================================
// Course-related helpers
// ============================================

export function getModulesForCourse(courseId: string): Module[] {
  return modules.filter(m => m.courseId === courseId);
}

export function getCourseIds(): string[] {
  const ids = new Set(modules.map(m => m.courseId));
  return Array.from(ids);
}

// ============================================
// Learning Path helpers (new)
// ============================================

export interface LearningPathConfig {
  name: string;
  description: string;
  courses: string[];
  prerequisites?: string[];
  isPrerequisite?: boolean;
  color: string;
}

export const LEARNING_PATHS: Record<string, LearningPathConfig> = {
  'web-fundamentals': {
    name: 'Web Fundamentals',
    description: 'Prerequisite knowledge for everything',
    courses: ['internet-tools', 'git-mastery', 'javascript-core'],
    isPrerequisite: true,
    color: 'from-gray-600 to-gray-800'
  },
  'frontend': {
    name: 'Frontend',
    description: 'Building user interfaces with HTML, CSS, and React',
    courses: ['html-css-tailwind', 'react'],
    // Note: Testing, performance, and security modules will be integrated into React course later
    // For now, browser-storage and pwa-basics remain in frontend-production courseId but not in path
    prerequisites: ['web-fundamentals'], // JavaScript Core is in web-fundamentals, no duplication
    color: 'from-blue-500 to-purple-600'
  },
  'backend': {
    name: 'Backend',
    description: 'Server-side development',
    courses: ['node-express', 'databases', 'auth-security'],
    prerequisites: ['web-fundamentals'],
    color: 'from-green-500 to-teal-600'
  },
  'fullstack': {
    name: 'Fullstack',
    description: 'Modern full-stack with Next.js',
    courses: ['nextjs', 'architecture-patterns', 'deployment'],
    prerequisites: ['frontend', 'backend'],
    color: 'from-orange-500 to-red-600'
  }
};

export type LearningPathId = 'web-fundamentals' | 'frontend' | 'backend' | 'fullstack';

export function getCoursesForLearningPath(pathId: LearningPathId): string[] {
  return LEARNING_PATHS[pathId]?.courses || [];
}

export function getModulesForLearningPath(pathId: LearningPathId): Module[] {
  const courses = getCoursesForLearningPath(pathId);
  return modules.filter(m => courses.includes(m.courseId));
}

export function getLearningPathIds(): LearningPathId[] {
  return Object.keys(LEARNING_PATHS) as LearningPathId[];
}

export function getLearningPathInfo(pathId: LearningPathId): LearningPathConfig | undefined {
  return LEARNING_PATHS[pathId];
}
