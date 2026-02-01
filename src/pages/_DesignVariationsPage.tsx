// Link replaced for Astro compatibility

import { useUser, UserProvider } from '../context/UserContext';
import { lessons, modules, getModulesForCourse } from '../data/modules';
import {
  ChevronRight, ArrowRight, ArrowUpRight, Play,
  Code2, GraduationCap, Clock, Check
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';

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

function DesignVariationsPageContent() {
  const { user, updateStreak, loading } = useUser();
  updateStreak();

  if (loading || !user) {
    return <LoadingSpinner />;
  }

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="text-3xl md:text-4xl font-bold tracking-widest">
              HACK<span className="text-primary-500">UP</span>
            </h1>
            <div className="absolute -bottom-1 left-0 w-16 h-1 bg-primary-500" />
          </div>
          <p className="text-gray-500 mt-2">Choose your home page design</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Variation1 resumes={resumes} />
          <Variation2 resumes={resumes} />
          <Variation3 resumes={resumes} />
          <Variation4 resumes={resumes} />
          <Variation5 resumes={resumes} />
          <Variation6 resumes={resumes} />
          <Variation7 resumes={resumes} />
          <Variation8 resumes={resumes} />
          <Variation9 resumes={resumes} />
          <Variation10 resumes={resumes} />
          <Variation11 resumes={resumes} />
          <Variation12 resumes={resumes} />
          <Variation13 resumes={resumes} />
          <Variation14 resumes={resumes} />
          <Variation15 resumes={resumes} />
          <Variation16 resumes={resumes} />
        </div>
      </div>
    </div>
  );
}

function HackupTitle({ subtitle }: { subtitle?: string }) {
  return (
    <div className="relative inline-block group">
      <h2 className="text-2xl font-bold tracking-widest">
        HACK<span className="text-primary-500">UP</span>
      </h2>
      <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary-500 transition-all duration-500"
        style={{ width: `${Math.max(1, progress)}%` }}
      />
    </div>
  );
}

function Variation1({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-white border-2 border-black rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-white px-4 py-3 border-b-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded">1</span>
          <span className="font-bold uppercase text-sm tracking-wider">Original Style</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-primary-500"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <HackupTitle subtitle="Continue Learning" />

        {resumes.length > 0 && (
          <div className="space-y-2">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="block border-2 border-black p-3 bg-white hover:bg-black hover:text-white transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-sm group-hover:bg-primary-500 transition-colors">
                      {Math.max(1, resume.progress)}%
                    </div>
                    <div>
                      <span className="font-bold text-sm uppercase group-hover:text-primary-500 transition-colors">{resume.courseTitle}</span>
                      <p className="text-xs text-gray-500 group-hover:text-gray-400">{resume.nextLesson.title}</p>
                    </div>
                  </div>
                  <Play className="w-5 h-5" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation2({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-primary-500 text-black text-xs font-bold px-2 py-0.5 rounded">2</span>
          <span className="text-gray-400 font-mono text-sm uppercase">Dark Mode</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
      </div>
      <div className="p-5 space-y-4">
        <div className="relative inline-block group">
          <h2 className="text-2xl font-bold tracking-widest text-white">
            HACK<span className="text-primary-500">UP</span>
          </h2>
          <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
        </div>

        {resumes.length > 0 && (
          <div className="space-y-2">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="block border border-gray-700 p-4 bg-gray-800/50 hover:bg-gray-800 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white uppercase">{resume.courseTitle}</span>
                  <span className="text-primary-500 font-bold">{Math.max(1, resume.progress)}%</span>
                </div>
                <ProgressBar progress={resume.progress} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation3({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-primary-500 px-5 py-4 flex items-center gap-2">
        <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded">3</span>
        <h2 className="text-2xl font-bold text-white tracking-widest">
          HACK<span className="text-black">UP</span>
        </h2>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-gray-500 text-sm">Pick up where you left off</p>

        {resumes.length > 0 && (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-all group"
              >
                <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">{Math.max(1, resume.progress)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{resume.courseTitle}</h4>
                  <p className="text-sm text-gray-500">{resume.nextLesson.title}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation4({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-white border-4 border-black rounded-lg overflow-hidden">
      <div className="bg-black px-4 py-3 flex items-center gap-2">
        <span className="bg-primary-500 text-black text-xs font-bold px-2 py-0.5 rounded">4</span>
        <h2 className="text-xl font-bold text-white tracking-widest">
          HACK<span className="text-primary-500">UP</span>
        </h2>
      </div>
      <div className="p-5 space-y-4">
        <div className="border-2 border-black p-4 bg-primary-50">
          <p className="font-bold uppercase text-sm text-primary-700">Your Progress</p>
        </div>

        {resumes.length > 0 && (
          <div className="space-y-3">
            {resumes.map((resume, i) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="block border-2 border-black p-4 bg-white hover:bg-primary-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span className="font-bold uppercase">{resume.courseTitle}</span>
                  </div>
                  <span className="bg-black text-white px-2 py-1 font-bold text-sm">
                    {Math.max(1, resume.progress)}%
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation5({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded">5</span>
        <HackupTitle />
      </div>
      <div className="p-5 space-y-4">
        <p className="text-sm text-gray-500">Continue your learning journey</p>

        {resumes.length > 0 && (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle cx="24" cy="24" r="20" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                      <circle
                        cx="24" cy="24" r="20"
                        stroke="#22c55e"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={125.6}
                        strokeDashoffset={125.6 - (125.6 * Math.max(1, resume.progress)) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                      {Math.max(1, resume.progress)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{resume.courseTitle}</h4>
                    <p className="text-sm text-gray-500">{resume.nextLesson.title}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation6({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-primary-500"></div>
        </div>
        <span className="text-gray-500 text-sm font-mono">6</span>
        <span className="text-gray-500 text-sm font-mono">hackup.app</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 tracking-wide">HACKUP</h2>
            <p className="text-xs text-gray-500">Learn to code by doing</p>
          </div>
        </div>

        {resumes.length > 0 && (
          <div className="space-y-2">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all group"
              >
                <span className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-semibold text-gray-700 text-sm">
                  {Math.max(1, resume.progress)}
                </span>
                <span className="font-medium text-gray-900">{resume.courseTitle}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation7({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="bg-primary-500 text-black text-xs font-bold px-2 py-0.5 rounded">7</span>
          <div className="w-3 h-3 rounded-full bg-primary-500"></div>
          <span className="text-white font-mono text-sm">HACKUP</span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          HACK<span className="text-primary-500">UP</span>
        </h2>
        <p className="text-gray-400 text-sm">Your learning dashboard</p>

        {resumes.length > 0 && (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{resume.courseTitle}</span>
                  <span className="text-primary-500 font-bold">{Math.max(1, resume.progress)}%</span>
                </div>
                <ProgressBar progress={resume.progress} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation8({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-black to-gray-800 px-5 py-6 text-center relative">
        <span className="absolute top-2 right-2 bg-primary-500 text-black text-xs font-bold px-2 py-0.5 rounded">8</span>
        <h2 className="text-3xl font-black text-white tracking-tighter">
          HACK<span className="text-primary-500">UP</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">Keep learning</p>
      </div>
      <div className="p-5 space-y-4">
        {resumes.length > 0 && (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-all group"
              >
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                  {resume.progress === 100 ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white font-bold">{Math.max(1, resume.progress)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{resume.courseTitle}</h4>
                  <p className="text-sm text-gray-500">{resume.nextLesson.title}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation9({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="bg-primary-500 text-black text-xs font-bold px-2 py-0.5 rounded">9</span>
        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
        <span className="font-medium text-gray-700 text-sm">Continue Learning</span>
      </div>
      <div className="p-5">
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tighter">
            HACK<span className="text-primary-500">UP</span>
          </h2>
        </div>

        {resumes.length > 0 && (
          <div className="space-y-0 divide-y divide-gray-100">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="flex items-center gap-4 py-4 hover:bg-gray-50 -mx-5 px-5 transition-all group"
              >
                <div className="w-2 h-2 rounded-full bg-primary-500 group-hover:scale-150 transition-transform"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    {resume.courseTitle}
                  </p>
                  <p className="text-sm text-gray-500">{resume.nextLesson.title}</p>
                </div>
                <span className="text-sm text-gray-400">{Math.max(1, resume.progress)}%</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation10({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden">
      <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center gap-2">
        <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded">10</span>
        <HackupTitle />
      </div>
      <div className="p-5 space-y-4">
        {resumes.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all text-center group"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                  <span className="font-bold text-gray-700 group-hover:text-white">
                    {Math.max(1, resume.progress)}
                  </span>
                </div>
                <p className="font-bold text-gray-900 text-sm">{resume.courseTitle}</p>
                <p className="text-xs text-gray-500 mt-1">{resume.nextLesson.title}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation11({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-black px-5 py-4">
        <h2 className="text-2xl font-bold text-white tracking-widest flex items-center gap-2">
          <span className="bg-primary-500 text-black text-xs font-bold px-2 py-0.5 rounded">11</span>
          HACK<span className="text-primary-500">UP</span>
          <span className="text-xs bg-primary-500 text-black px-2 py-0.5 rounded">BETA</span>
        </h2>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-sm text-gray-500">Start where you left off</p>

        {resumes.length > 0 && (
          <div className="space-y-2">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-gray-50 transition-all"
              >
                <div className="w-10 h-10 bg-primary-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold">{Math.max(1, resume.progress)}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{resume.courseTitle}</p>
                  <p className="text-xs text-gray-500">{resume.nextLesson.title}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation12({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="relative inline-block group">
            <span className="absolute -top-6 left-0 bg-primary-500 text-black text-xs font-bold px-2 py-0.5 rounded">12</span>
            <h2 className="text-2xl font-bold text-white tracking-widest">
              HACK<span className="text-primary-500">UP</span>
            </h2>
            <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Clock className="w-4 h-4" />
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {resumes.length > 0 && (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="block p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:bg-gray-700 hover:border-primary-500 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{resume.courseTitle}</span>
                  <span className="text-primary-500 font-bold">{Math.max(1, resume.progress)}%</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{resume.nextLesson.title}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation13({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded">13</span>
        <HackupTitle />
      </div>
      <div className="p-5">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-900">{resumes.length}</p>
            <p className="text-xs text-gray-500">Courses</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-primary-500">
              {Math.round(resumes.reduce((acc, r) => acc + r.progress, 0) / resumes.length)}%
            </p>
            <p className="text-xs text-gray-500">Avg</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-900">
              {resumes.filter(r => r.progress === 100).length}
            </p>
            <p className="text-xs text-gray-500">Done</p>
          </div>
        </div>

        {resumes.length > 0 && (
          <div className="space-y-2">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{resume.courseTitle}</p>
                    <p className="text-sm text-gray-500">{Math.max(1, resume.progress)}%</p>
                  </div>
                  <ProgressBar progress={resume.progress} />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation14({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <span className="bg-primary-500 text-black text-xs font-bold px-2 py-0.5 rounded">14</span>
        <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">Learning Paths</span>
      </div>
      <div className="p-5 space-y-4">
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">
          HACK<span className="text-primary-500">UP</span>
        </h2>

        {resumes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black hover:bg-black hover:text-white transition-all group"
              >
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold group-hover:bg-white group-hover:text-black transition-colors">
                  {Math.max(1, resume.progress)}
                </span>
                <span className="font-bold text-sm">{resume.courseTitle}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation15({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-gray-100 rounded-xl overflow-hidden">
      <div className="px-5 py-4 bg-white flex items-center gap-2">
        <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded">15</span>
        <HackupTitle />
      </div>
      <div className="p-5 space-y-4">
        <p className="text-sm text-gray-500">Active courses</p>

        {resumes.length > 0 && (
          <div className="space-y-3">
            {resumes.map((resume, i) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{resume.courseTitle}</h4>
                  <p className="text-sm text-gray-500">{resume.nextLesson.title}</p>
                  <div className="mt-2">
                    <ProgressBar progress={resume.progress} />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-primary-500">{Math.max(1, resume.progress)}</span>
                  <span className="text-xs text-gray-400 block">%</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Variation16({ resumes }: { resumes: CourseResume[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="bg-primary-500 text-black text-xs font-bold px-2 py-0.5 rounded">16</span>
        <HackupTitle />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-primary-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">HACKUP</h2>
            <p className="text-sm text-gray-500">Learn. Build. Ship.</p>
          </div>
        </div>

        {resumes.length > 0 && (
          <div className="space-y-2">
            {resumes.map((resume) => (
              <a
                key={resume.courseId}
                href={`/lesson/${resume.nextLesson.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-500 hover:bg-gray-50 transition-all group"
              >
                <ChevronRight className="w-5 h-5 text-primary-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    {resume.courseTitle}
                  </p>
                  <p className="text-sm text-gray-500">{resume.nextLesson.title}</p>
                </div>
                <span className="text-sm font-medium text-gray-400">{Math.max(1, resume.progress)}%</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DesignVariationsPage() {
  return (
    <UserProvider>
      <DesignVariationsPageContent />
    </UserProvider>
  );
}
