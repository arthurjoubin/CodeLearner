import { modules, LEARNING_PATHS, type LearningPathId } from '../data/modules';
import { estimateCourseHours, formatHours } from '../utils/estimateHours';
import type { Module } from '../types';

interface CourseInfo {
  id: string;
  title: string;
  description: string;
  logo: string;
  difficulty: 'beginner' | 'medium' | 'advanced';
  modules: Module[];
  hours: number;
}

export const COURSE_METADATA: Record<string, { title: string; description: string; logo: string; difficulty: 'beginner' | 'medium' | 'advanced' }> = {
  // Web Fundamentals
  'internet-tools': {
    title: 'Internet & Tools',
    description: 'IDE, terminal, debugging, and build tools',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png',
    difficulty: 'beginner'
  },
  'git-mastery': {
    title: 'Git Mastery',
    description: 'Version control from basics to advanced workflows',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/git/git.png',
    difficulty: 'beginner'
  },
  'javascript-core': {
    title: 'JavaScript Core',
    description: 'Modern JavaScript and TypeScript fundamentals',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png',
    difficulty: 'beginner'
  },
  // Frontend
  'html-css-tailwind': {
    title: 'HTML, CSS & Tailwind',
    description: 'Build responsive layouts with modern CSS',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/html/html.png',
    difficulty: 'beginner'
  },
  'react': {
    title: 'React',
    description: 'Component-based UI development with hooks and patterns',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png',
    difficulty: 'medium'
  },
  'frontend-production': {
    title: 'Frontend Production',
    description: 'Testing, performance, security, and PWA basics',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/webpack/webpack.png',
    difficulty: 'medium'
  },
  // Backend
  'node-express': {
    title: 'Node.js & Express',
    description: 'Server-side JavaScript and REST API development',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png',
    difficulty: 'medium'
  },
  'databases': {
    title: 'Databases',
    description: 'SQL fundamentals, SQLite, PostgreSQL, and ORMs',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/postgresql/postgresql.png',
    difficulty: 'medium'
  },
  'auth-security': {
    title: 'Auth & Security',
    description: 'Authentication, JWT, OAuth, and security best practices',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/firebase/firebase.png',
    difficulty: 'medium'
  },
  // Fullstack
  'nextjs': {
    title: 'Next.js',
    description: 'Full-stack React with App Router and server components',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/nextjs/nextjs.png',
    difficulty: 'advanced'
  },
  'architecture-patterns': {
    title: 'Architecture & Patterns',
    description: 'System design, DevOps, and WebSockets',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/docker/docker.png',
    difficulty: 'advanced'
  },
  'deployment': {
    title: 'Deployment',
    description: 'Cloud fundamentals and production deployment',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/aws/aws.png',
    difficulty: 'advanced'
  }
};

const LEARNING_PATH_ORDER: LearningPathId[] = ['web-fundamentals', 'frontend', 'backend', 'fullstack'];

const LEARNING_PATH_ICONS: Record<LearningPathId, string> = {
  'web-fundamentals': 'https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png',
  'frontend': 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png',
  'backend': 'https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png',
  'fullstack': 'https://raw.githubusercontent.com/github/explore/main/topics/nextjs/nextjs.png',
};

function getCoursesForPath(pathId: LearningPathId): CourseInfo[] {
  const pathConfig = LEARNING_PATHS[pathId];
  
  return pathConfig.courses.map((courseId) => {
    const metadata = COURSE_METADATA[courseId];
    if (!metadata) return null;
    
    const courseModules = modules.filter(m => m.courseId === courseId);
    const hours = estimateCourseHours(courseId);
    
    return {
      id: courseId,
      title: metadata.title,
      description: metadata.description,
      logo: metadata.logo,
      difficulty: metadata.difficulty,
      modules: courseModules,
      hours,
    };
  }).filter(Boolean) as CourseInfo[];
}

interface CourseCardProps {
  course: CourseInfo;
}

function CourseCard({ course }: CourseCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 border-green-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    advanced: 'bg-red-100 text-red-700 border-red-300'
  };

  return (
    <a
      href={`/courses/${course.id}`}
      className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group block"
    >
      <div className="flex items-center gap-3 mb-3">
        <img src={course.logo} alt={course.title} className="w-8 h-8 object-contain" />
        <h3 className="font-bold text-sm uppercase text-gray-900 group-hover:text-primary-700 transition-colors">
          {course.title}
        </h3>
      </div>
      <p className="text-xs text-gray-600 mb-3">{course.description}</p>
      <div className="flex items-center gap-2">
        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase border rounded ${difficultyColors[course.difficulty]}`}>
          {course.difficulty === 'beginner' ? 'Beginner' : course.difficulty === 'medium' ? 'Intermediate' : 'Advanced'}
        </span>
        <span className="text-[10px] text-gray-500">
          {course.modules.length} modules • {Math.round(course.hours)} hours
        </span>
      </div>
    </a>
  );
}

interface LearningPathSectionProps {
  pathId: LearningPathId;
}

function LearningPathSection({ pathId }: LearningPathSectionProps) {
  const pathConfig = LEARNING_PATHS[pathId];
  const courses = getCoursesForPath(pathId);
  const pathHours = courses.reduce((total, course) => total + course.hours, 0);
  const pathModules = courses.reduce((total, course) => total + course.modules.length, 0);

  return (
    <div className="mb-10 last:mb-0">
      {/* Learning Path Header */}
      <div className="flex items-center gap-4 mb-4 p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-lg">
        <img 
          src={LEARNING_PATH_ICONS[pathId]} 
          alt={pathConfig.name} 
          className="w-12 h-12 object-contain"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{pathConfig.name}</h3>
          <p className="text-sm text-gray-600">{pathConfig.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-primary-600">{pathModules} modules</div>
          <div className="text-xs text-gray-500">{Math.round(pathHours)} hours</div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

interface CoursesSectionProps {
  title?: string;
  showTotalHours?: boolean;
  showHeader?: boolean;
}

export function CoursesSection({ 
  title = "Our Courses", 
  showTotalHours = true,
  showHeader = true,
}: CoursesSectionProps) {
  const allCourses = LEARNING_PATH_ORDER.flatMap(pathId => getCoursesForPath(pathId));
  const totalHours = allCourses.reduce((total, course) => total + course.hours, 0);

  return (
    <div>
      {showHeader && (
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
          {showTotalHours && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-primary-700">{formatHours(totalHours)} of learning</span>
            </div>
          )}
        </div>
      )}

      {/* Learning Path Sections */}
      <div>
        {LEARNING_PATH_ORDER.map((pathId) => (
          <LearningPathSection key={pathId} pathId={pathId} />
        ))}
      </div>
    </div>
  );
}

export default CoursesSection;
