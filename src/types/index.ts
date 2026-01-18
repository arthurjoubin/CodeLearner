export interface User {
  id: string;
  name: string;
  xp: number;
  level: number;
  hearts: number;
  maxHearts: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  completedExercises: string[];
  moduleProgress: Record<string, number>;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  requiredXp: number;
  color: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  codeExample?: string;
  xpReward: number;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Exercise {
  id: string;
  lessonId: string;
  moduleId: string;
  title: string;
  description: string;
  instructions: string;
  starterCode: string;
  solution: string;
  hints: string[];
  validationPrompt: string;
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
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

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'React Novice', minXp: 0, maxXp: 100 },
  { level: 2, title: 'JSX Explorer', minXp: 100, maxXp: 250 },
  { level: 3, title: 'Component Crafter', minXp: 250, maxXp: 500 },
  { level: 4, title: 'State Manager', minXp: 500, maxXp: 800 },
  { level: 5, title: 'Hook Hunter', minXp: 800, maxXp: 1200 },
  { level: 6, title: 'Effect Expert', minXp: 1200, maxXp: 1700 },
  { level: 7, title: 'TypeScript Tamer', minXp: 1700, maxXp: 2300 },
  { level: 8, title: 'React Warrior', minXp: 2300, maxXp: 3000 },
  { level: 9, title: 'Frontend Hero', minXp: 3000, maxXp: 4000 },
  { level: 10, title: 'React Master', minXp: 4000, maxXp: Infinity },
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
