/**
 * Centralized course and learning path metadata
 *
 * Single source of truth for all course display names, learning paths, and configuration.
 * Import from this file instead of maintaining duplicate mappings in every page component.
 */

// Course display names - update here and changes propagate everywhere
const COURSE_TITLES: Record<string, string> = {
  'html-css-tailwind': 'HTML & CSS',
  'javascript-core': 'JavaScript',
  'react': 'React',
  'advanced-topics': 'Web Stack',
  'git-mastery': 'Git',
  'frontend-production': 'Engineering Practices',
  'node-express': 'Node.js & Express',
  'databases': 'Databases & SQL',
  'auth-security': 'Backend Advanced',
  'nextjs': 'Next.js',
  'deployment': 'Deployment',
  'architecture-patterns': 'Architecture Patterns',
  'internet-tools': 'Internet & Tools',
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
  'frontend-production': 'Frontend Production',
  'nextjs': 'Next.js',
  'deployment': 'Deployment',
  'internet-tools': 'Internet & Tools',
};

// Course difficulty levels
const COURSE_DIFFICULTY: Record<string, string> = {
  'html-css-tailwind': 'beginner',
  'javascript-core': 'beginner',
  'advanced-topics': 'beginner',
  'git-mastery': 'beginner',
  'react': 'medium',
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

// Learning paths - centralized configuration
export const LEARNING_PATHS_DATA = {
  'web-fundamentals': {
    title: 'Web Fundamentals',
    description: 'Master the fundamentals of web development',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png',
    difficulty: 'beginner' as const,
    courses: ['internet-tools', 'git-mastery', 'javascript-core'],
  },
  'frontend': {
    title: 'Frontend',
    description: 'Learn React and build modern web applications',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png',
    difficulty: 'medium' as const,
    courses: ['html-css-tailwind', 'react', 'frontend-production'],
  },
  'backend': {
    title: 'Backend',
    description: 'Master server-side development with Node.js',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png',
    difficulty: 'medium' as const,
    courses: ['node-express', 'databases', 'auth-security'],
  },
  'fullstack': {
    title: 'Fullstack',
    description: 'Learn full-stack development with Next.js',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/nextjs/nextjs.png',
    difficulty: 'advanced' as const,
    courses: ['nextjs', 'architecture-patterns', 'advanced-topics'],
  },
  'deployment': {
    title: 'Deployment',
    description: 'Deploy applications to production',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/docker/docker.png',
    difficulty: 'advanced' as const,
    courses: ['deployment'],
  },
};

/**
 * Get all learning paths as an array
 */
export function getLearningPaths() {
  return Object.entries(LEARNING_PATHS_DATA).map(([id, data]) => ({
    id,
    ...data,
  }));
}

/**
 * Get a specific learning path
 */
export function getLearningPath(id: string) {
  return LEARNING_PATHS_DATA[id as keyof typeof LEARNING_PATHS_DATA];
}

// Export raw maps for backwards compatibility if needed
export { COURSE_TITLES, LEARNING_PATH_TITLES, COURSE_DIFFICULTY };
