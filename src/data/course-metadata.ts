/**
 * Centralized course metadata
 *
 * Single source of truth for all course display names, paths, and configuration.
 * Import from this file instead of maintaining duplicate mappings in every page component.
 */

// Course display names - update here and changes propagate everywhere
const COURSE_TITLES: Record<string, string> = {
  'html-css-tailwind': 'HTML & CSS',
  'javascript-core': 'JavaScript',
  'react': 'React',
  'advanced-topics': 'Web Stack',
  'git-mastery': 'Git',
  'dev-environment': 'Terminal & CLI',
  'frontend-production': 'Engineering Practices',
  'node-express': 'Node.js & Express',
  'databases': 'Databases & SQL',
  'auth-security': 'Backend Advanced',
  'nextjs': 'Next.js',
  'deployment': 'Deployment',
  'architecture-patterns': 'Architecture Patterns',
  'internet-tools': 'Internet Tools',
};

// Learning path titles - for breadcrumbs and navigation
const LEARNING_PATH_TITLES: Record<string, string> = {
  'react': 'React',
  'advanced-topics': 'Web Stack',
  'git-mastery': 'Git',
  'javascript-core': 'JavaScript',
  'html-css-tailwind': 'HTML & CSS',
  'node-express': 'Backend',
  'databases': 'Backend',
  'auth-security': 'Backend',
  'dev-environment': 'Terminal & CLI',
  'frontend-production': 'Frontend Production',
  'nextjs': 'Next.js',
  'deployment': 'Deployment',
  'internet-tools': 'Internet Tools',
};

// Course difficulty levels
const COURSE_DIFFICULTY: Record<string, string> = {
  'html-css-tailwind': 'beginner',
  'javascript-core': 'beginner',
  'advanced-topics': 'beginner',
  'git-mastery': 'beginner',
  'react': 'medium',
  'dev-environment': 'beginner',
  'frontend-production': 'medium',
  'node-express': 'medium',
  'databases': 'medium',
  'auth-security': 'advanced',
  'nextjs': 'advanced',
  'deployment': 'advanced',
  'architecture-patterns': 'advanced',
  'internet-tools': 'beginner',
};

// Helper functions

/**
 * Get the display name for a course
 * @param courseId - The course ID
 * @returns The display name, or the courseId if not found
 */
export function getCourseTitles(): Record<string, string> {
  return { ...COURSE_TITLES };
}

export function getCourseTitle(courseId: string): string {
  return COURSE_TITLES[courseId] || courseId;
}

export function getLearningPathTitles(): Record<string, string> {
  return { ...LEARNING_PATH_TITLES };
}

export function getLearningPathTitle(courseId: string): string {
  return LEARNING_PATH_TITLES[courseId] || courseId;
}

export function getCourseDifficulty(): Record<string, string> {
  return { ...COURSE_DIFFICULTY };
}

export function getCourseDifficultyLevel(courseId: string): string {
  return COURSE_DIFFICULTY[courseId] || 'beginner';
}

// Export raw maps for backwards compatibility if needed
export { COURSE_TITLES, LEARNING_PATH_TITLES, COURSE_DIFFICULTY };
