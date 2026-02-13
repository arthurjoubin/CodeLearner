import { LanguageExercise } from '../../types';
import { pythonExercises } from './python';
import { javascriptExercises } from './javascript';
import { typescriptExercises } from './typescript';
import { rustExercises } from './rust';
import { goExercises } from './go';

// Export all exercises
export const languageExercises: LanguageExercise[] = [
  ...pythonExercises,
  ...javascriptExercises,
  ...typescriptExercises,
  ...rustExercises,
  ...goExercises,
];

// Group exercises by language
export const exercisesByLanguage: Record<string, LanguageExercise[]> = {
  python: pythonExercises,
  javascript: javascriptExercises,
  typescript: typescriptExercises,
  rust: rustExercises,
  go: goExercises,
};

// Supported languages with metadata
export const supportedLanguages = [
  { id: 'python', name: 'Python', color: '#3776AB', icon: '🐍' },
  { id: 'javascript', name: 'JavaScript', color: '#F7DF1E', icon: '⚡' },
  { id: 'typescript', name: 'TypeScript', color: '#3178C6', icon: '🔷' },
  { id: 'rust', name: 'Rust', color: '#DEA584', icon: '⚙️' },
  { id: 'go', name: 'Go', color: '#00ADD8', icon: '🐹' },
] as const;

export type SupportedLanguage = typeof supportedLanguages[number]['id'];

// Helper functions
export function getExercisesByLanguage(language: string): LanguageExercise[] {
  return exercisesByLanguage[language] || [];
}

export function getExerciseById(id: string): LanguageExercise | undefined {
  return languageExercises.find(e => e.id === id);
}

export function getNextExercise(currentId: string): LanguageExercise | undefined {
  const current = getExerciseById(currentId);
  if (!current) return undefined;
  
  const exercises = getExercisesByLanguage(current.language);
  const currentIndex = exercises.findIndex(e => e.id === currentId);
  return exercises[currentIndex + 1];
}

export function getPreviousExercise(currentId: string): LanguageExercise | undefined {
  const current = getExerciseById(currentId);
  if (!current) return undefined;
  
  const exercises = getExercisesByLanguage(current.language);
  const currentIndex = exercises.findIndex(e => e.id === currentId);
  return exercises[currentIndex - 1];
}

// Monaco editor language mapping
export const monacoLanguageMap: Record<string, string> = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  rust: 'rust',
  go: 'go',
};
