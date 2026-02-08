export interface User {
  id: string;
  email?: string;
  name: string;
  avatarUrl?: string;
  xp: number;
  recentXp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  completedExercises: string[];
  moduleProgress: Record<string, number>;
  labProgress: Record<string, LabStatus>;
}

export interface LabStatus {
  unlocked: boolean;
  completed: boolean;
  currentStep: number;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  requiredXp: number;
  color: string;
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  requiredLevel: number;
  steps: LabStep[];
  xpReward: number;
  technologies: string[];
}

export interface LabStep {
  id: string;
  title: string;
  instructions: string;
  starterCode: string;
  validationPrompt: string;
  aiHint: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  codeExample?: string;
  xpReward?: number;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Exercice de code (React)
export interface CodeExercise {
  id: string;
  type?: 'code'; // optionnel pour rétro-compatibilité
  lessonId: string;
  moduleId: string;
  order?: number;
  title: string;
  description: string;
  instructions: string;
  starterCode: string;
  solution: string;
  hints: string[];
  validationPrompt: string;
  xpReward?: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'advanced';
}

// Question de quiz
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Exercice quiz (Web Stack)
export interface QuizExercise {
  id: string;
  type: 'quiz';
  lessonId: string;
  moduleId: string;
  title: string;
  description?: string;
  instructions?: string;
  questions: QuizQuestion[];
  xpReward?: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'advanced';
}

// Git scenario exercise - multi-step terminal + visual simulator
export interface GitObjectiveCheck {
  type: 'isInitialized' | 'minCommits' | 'currentBranch' | 'branchExists' |
        'allFilesStaged' | 'allFilesCommitted' | 'fileStatus' | 'noUntrackedFiles' |
        'commitMessageExists' | 'mergedBranch';
  value?: boolean | number | string;
  file?: string;
  status?: string;
}

export interface GitObjective {
  description: string;
  check: GitObjectiveCheck;
}

export interface GitScenarioInitialFile {
  name: string;
  status: 'untracked' | 'modified' | 'staged' | 'committed';
  content?: string;
}

export interface GitScenarioInitialState {
  files: GitScenarioInitialFile[];
  commits: { message: string; files: string[]; branch?: string }[];
  branches: string[];
  currentBranch: string;
  isInitialized: boolean;
}

export interface GitScenarioExercise {
  id: string;
  type: 'git-scenario';
  lessonId: string;
  moduleId: string;
  title: string;
  description?: string;
  story: string;
  hints?: string[];
  initialState: GitScenarioInitialState;
  objectives: GitObjective[];
  xpReward?: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'advanced';
}

// Type union
export type Exercise = CodeExercise | QuizExercise | GitScenarioExercise;

// Type guards
export function isQuizExercise(exercise: Exercise): exercise is QuizExercise {
  return exercise.type === 'quiz';
}

export function isGitScenarioExercise(exercise: Exercise): exercise is GitScenarioExercise {
  return exercise.type === 'git-scenario';
}

export function isCodeExercise(exercise: Exercise): exercise is CodeExercise {
  return exercise.type !== 'quiz' && exercise.type !== 'git-scenario';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
  hints?: string[];
  xpEarned?: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
}

export const DEFAULT_XP_REWARD = 100;

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Novice', minXp: 0, maxXp: 300 },
  { level: 2, title: 'Apprentice', minXp: 300, maxXp: 600 },
  { level: 3, title: 'Practitioner', minXp: 600, maxXp: 1000 },
  { level: 4, title: 'Professional', minXp: 1000, maxXp: 1500 },
  { level: 5, title: 'Expert', minXp: 1500, maxXp: 2300 },
  { level: 6, title: 'Specialist', minXp: 2300, maxXp: 3500 },
  { level: 7, title: 'Master', minXp: 3500, maxXp: 5300 },
  { level: 8, title: 'Scholar', minXp: 5300, maxXp: 8000 },
  { level: 9, title: 'Sage', minXp: 8000, maxXp: 12000 },
  { level: 10, title: 'Architect', minXp: 12000, maxXp: 18000 },
  { level: 11, title: 'Visionary', minXp: 18000, maxXp: 27000 },
  { level: 12, title: 'Legend', minXp: 27000, maxXp: 40500 },
  { level: 13, title: 'Pioneer', minXp: 40500, maxXp: 60800 },
  { level: 14, title: 'Trailblazer', minXp: 60800, maxXp: 91200 },
  { level: 15, title: 'Guardian', minXp: 91200, maxXp: 136800 },
  { level: 16, title: 'Keeper', minXp: 136800, maxXp: 205200 },
  { level: 17, title: 'Elder', minXp: 205200, maxXp: 307800 },
  { level: 18, title: 'Oracle', minXp: 307800, maxXp: 461700 },
  { level: 19, title: 'Titan', minXp: 461700, maxXp: 692600 },
  { level: 20, title: 'Godlike', minXp: 692600, maxXp: Infinity },
];

export function getLevelFromXp(xp: number): LevelInfo {
  return LEVELS.find(l => xp >= l.minXp && xp < l.maxXp) || LEVELS[LEVELS.length - 1];
}

export function getXpProgress(xp: number): number {
  const level = getLevelFromXp(xp);
  if (level.maxXp === Infinity) return 100;
  const xpInLevel = xp - level.minXp;
  const xpNeeded = level.maxXp - level.minXp;
  return Math.round((xpInLevel / xpNeeded) * 100);
}

export function getXpReward(xpReward?: number): number {
  return xpReward ?? DEFAULT_XP_REWARD;
}

// ============================================
// Learning Path Types
// ============================================

export interface LearningPathInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  courses: string[];
  prerequisites?: string[];
  isPrerequisite?: boolean;
  color: string;
}
