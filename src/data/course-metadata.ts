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

// Detailed course information
export const COURSE_DETAILS: Record<string, { description: string; objectives: string[] }> = {
  'internet-tools': {
    description: 'Master the essential tools of the modern developer. From the terminal to AI-assisted coding, learn to navigate the digital world with professional speed and efficiency.',
    objectives: [
      'Master the Terminal and CLI commands',
      'Advanced debugging with Browser DevTools',
      'Managing projects with NPM and package managers',
      'Vibe Coding: Working effectively with AI (Cursor, v0, etc.)',
      'Mastering error messages and technical problem solving'
    ]
  },
  'git-mastery': {
    description: 'Version control is the backbone of collaboration. Move from basic commits to professional workflows and advanced history management.',
    objectives: [
      'Git fundamentals (Init, Add, Commit, Push)',
      'Branching strategies for team collaboration',
      'Resolving complex merge conflicts',
      'Advanced history management (Rebase, Cherry-pick, Squash)',
      'Professional workflows like Git Flow and Trunk-based development'
    ]
  },
  'javascript-core': {
    description: 'The foundation of all modern web development. Learn the core logic of JavaScript before moving to advanced frameworks.',
    objectives: [
      'Modern JS logic (ES6+, Async/Await)',
      'Manipulating the DOM and Browser APIs',
      'Working with complex data structures (Arrays & Objects)',
      'Introduction to TypeScript and type safety',
      'Consuming REST APIs and handling external data'
    ]
  },
  'html-css-tailwind': {
    description: 'Build beautiful, responsive, and accessible user interfaces using the industry-standard styling tools.',
    objectives: [
      'Semantic HTML5 and modern layout structures',
      'Mastering CSS Layouts (Flexbox & Grid)',
      'Responsive design and mobile-first approach',
      'Utility-first styling with Tailwind CSS',
      'Web accessibility (A11y) and SEO best practices'
    ]
  },
  'react': {
    description: 'Build powerful, component-based applications with the world\'s most popular frontend library.',
    objectives: [
      'Thinking in Components and Props',
      'Mastering Hooks (useState, useEffect, useMemo)',
      'Global state management with Context and Zustand',
      'Advanced patterns and performance optimization',
      'Building type-safe React apps with TypeScript'
    ]
  },
  'node-express': {
    description: 'Go from frontend to backend. Learn to build scalable APIs and handle server-side logic with Node.js.',
    objectives: [
      'Node.js architecture and asynchronous patterns',
      'Building RESTful APIs with Express',
      'Middleware design and request-response lifecycle',
      'File systems, streams, and system integration',
      'Testing backend logic with Vitest'
    ]
  },
  'databases': {
    description: 'Master data persistence. Learn how to design, query, and optimize relational and in-memory databases.',
    objectives: [
      'Relational database design and SQL fundamentals',
      'Advanced PostgreSQL and SQLite operations',
      'Working with ORMs like Prisma and Drizzle',
      'Database migrations and version control',
      'High-performance caching with Redis'
    ]
  },
  'auth-security': {
    description: 'Protect your applications and your users. Master modern authentication patterns and security best practices.',
    objectives: [
      'JWT and Session-based authentication',
      'Implementing OAuth 2.0 and Social Logins',
      'Implementing Two-Factor Authentication (2FA)',
      'Defending against XSS, CSRF, and SQL Injection',
      'Security headers and production-grade safety'
    ]
  },
  'nextjs': {
    description: 'The fullstack React framework for production. Master the cutting edge of web development with Server Components.',
    objectives: [
      'App Router architecture and Nested Layouts',
      'Server Components vs Client Components',
      'Advanced data fetching and caching strategies',
      'Server Actions and form handling',
      'Middleware, SEO optimization, and Edge rendering'
    ]
  },
  'deployment': {
    description: 'Stop building and start shipping. Learn how to deploy frontend and backend apps to the global cloud.',
    objectives: [
      'Frontend hosting with Vercel, Netlify, and Cloudflare',
      'Containerization with Docker',
      'Automated CI/CD pipelines (GitHub Actions)',
      'Production monitoring and environment management',
      'Domain management, DNS, and SSL security'
    ]
  },
  'frontend-production': {
    description: 'Take your frontend skills to professional levels by mastering engineering practices used at top companies.',
    objectives: [
      'Advanced Web Performance optimization',
      'Unit, Integration, and E2E testing',
      'Internationalization (i18n) for global apps',
      'Advanced PWA and offline-first capabilities',
      'Frontend security and browser storage patterns'
    ]
  },
  'architecture-patterns': {
    description: 'Think like a Senior Developer. Learn the architectural patterns that allow systems to scale to millions of users.',
    objectives: [
      'System design and Scalability principles',
      'Software Design Patterns (SOLID, Clean Architecture)',
      'Real-time communication with WebSockets',
      'Microservices vs Monolith architectures',
      'DevOps fundamentals for developers'
    ]
  }
};

// Helper functions

/**
 * Get the details for a specific course
 */
export function getCourseDetails(courseId: string) {
  return COURSE_DETAILS[courseId] || { 
    description: 'Learn professional web development with hands-on exercises.', 
    objectives: ['Master core concepts', 'Build real projects', 'Practice with exercises'] 
  };
}


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
