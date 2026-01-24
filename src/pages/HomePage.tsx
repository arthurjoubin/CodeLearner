import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { lessons, modules, getModulesForCourse } from '../data/modules';
import { Play } from 'lucide-react';

const learningPaths = [
  { id: 'web-stack', title: 'VIBECODER BASIS', description: 'Understand the full web development ecosystem', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png' },
  { id: 'react', title: 'React', description: 'Learn React and TypeScript', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png' },
  { id: 'python', title: 'Python', description: 'Learn Python basics and programming', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/python/python.png' },
  { id: 'fastapi', title: 'FastAPI', description: 'Build modern APIs with FastAPI', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/fastapi/fastapi.png' },
  { id: 'git', title: 'Git', description: 'Master version control with Git', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/git/git.png' },
];

interface CourseResume {
  courseId: string;
  courseTitle: string;
  nextLesson: { id: string; title: string; moduleId: string };
  progress: number;
}

export default function HomePage() {
  const { user, updateStreak, loading } = useUser();
  updateStreak();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const completedLessons = user.completedLessons || [];
  const courseIds = [...new Set(modules.map(m => m.courseId))];
  
  const getCourseProgress = (courseId: string): CourseResume | null => {
    const courseModules = getModulesForCourse(courseId);
    const courseLessons = courseModules.flatMap(m => 
      lessons.filter(l => l.moduleId === m.id).map(l => ({ ...l, moduleId: m.id }))
    );
    
    if (courseLessons.length === 0) return null;
    
    const sortedLessons = courseLessons.sort((a, b) => {
      const moduleA = courseModules.find(m => m.id === a.moduleId);
      const moduleB = courseModules.find(m => m.id === b.moduleId);
      const orderA = courseModules.indexOf(moduleA!);
      const orderB = courseModules.indexOf(moduleB!);
      if (orderA !== orderB) return orderA - orderB;
      return a.order - b.order;
    });
    
    for (const lesson of sortedLessons) {
      if (!completedLessons.includes(lesson.id)) {
        const completed = sortedLessons.filter(l => completedLessons.includes(l.id)).length;
        return {
          courseId,
          courseTitle: learningPaths.find(p => p.id === courseId)?.title || courseId,
          nextLesson: { id: lesson.id, title: lesson.title, moduleId: lesson.moduleId },
          progress: Math.round((completed / sortedLessons.length) * 100)
        };
      }
    }
    
    return {
      courseId,
      courseTitle: learningPaths.find(p => p.id === courseId)?.title || courseId,
      nextLesson: { id: sortedLessons[0].id, title: sortedLessons[0].title, moduleId: sortedLessons[0].moduleId },
      progress: 100
    };
  };

  const resumes = courseIds.map(id => getCourseProgress(id)).filter(Boolean) as CourseResume[];

  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-black uppercase mb-2">Choose your Learning Path</h1>
        <p className="text-gray-600">Start your coding journey with one of our curated paths</p>
      </div>

      {resumes.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-sm uppercase text-gray-500 mb-3">Continue Learning</h2>
          <div className="space-y-2">
            {resumes.map(resume => (
              <Link
                key={resume.courseId}
                to={`/lesson/${resume.nextLesson.id}`}
                className="block border-2 border-black p-3 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-sm">
                      {resume.progress}%
                    </div>
                    <div>
                      <span className="font-bold text-sm uppercase">{resume.courseTitle}</span>
                      <p className="text-xs text-gray-600">{resume.nextLesson.title}</p>
                    </div>
                  </div>
                  <Play className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide p-1">
        {learningPaths.map((path) => {
          const isAvailable = path.id === 'react' || path.id === 'web-stack';

          return (
            <Link
              key={path.id}
              to={isAvailable ? `/learning-path/${path.id}` : '#'}
              className={`border-2 border-black p-3 relative transition-all flex-shrink-0 w-48 ${isAvailable 
                ? 'bg-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal cursor-pointer' 
                : 'bg-gray-100 opacity-60 grayscale cursor-not-allowed'
              }`}
            >
              {!isAvailable && (
                <div className="absolute top-1.5 right-1.5">
                  <span className="px-1.5 py-0.5 bg-gray-300 text-gray-600 text-[8px] font-bold uppercase tracking-wider border border-gray-400">
                    Soon
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-1.5">
                <img 
                  src={path.logo} 
                  alt={path.title} 
                  className="w-6 h-6 object-contain"
                />
                <div>
                  <h3 className="font-bold text-sm uppercase">{path.title}</h3>
                  {isAvailable && (
                    <span className="text-[8px] text-green-600 font-bold">Available</span>
                  )}
                </div>
              </div>
              <p className="text-[9px] mb-1 text-gray-600 line-clamp-2">{path.description}</p>
              {isAvailable && (
                <span className="text-[9px] font-bold text-primary-600">Start →</span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="border-2 border-black p-3 mt-8">
        <h2 className="font-black text-sm uppercase mb-2">Our Method</h2>
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="pr-3 md:border-r md:border-gray-300 md:last:border-r-0">
            <span className="font-bold text-black block mb-0.5">Learn by Doing</span>
            <p className="text-gray-600">Theory meets practice. Every lesson combines concepts with hands-on exercises.</p>
          </div>
          <div className="pr-3 md:border-r md:border-gray-300 md:last:border-r-0 md:pl-2">
            <span className="font-bold text-black block mb-0.5">Progress Through Practice</span>
            <p className="text-gray-600">Build real skills step by step. Your experience grows as you complete lessons and exercises.</p>
          </div>
          <div className="md:pl-2">
            <span className="font-bold text-black block mb-0.5">Stay Active</span>
            <p className="text-gray-600">No passive watching. You code, you test, you learn by taking action.</p>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
