import { useUser, UserProvider } from '../context/UserContext';
import { getModulesForCourse, getLessonsForModule, getExercisesForLesson } from '../data/modules';
import { Lock, CheckCircle, Code, Code2, Boxes, Database, MousePointer, Zap, Shield, List, FileInput, FileText, Layers, Settings, Gauge, Navigation, Network, Palette, Server, Target, TestTube, GitBranch, ArrowLeft, ChevronRight } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageTitle } from '../components/PageTitle';

const iconMap: Record<string, React.ElementType> = {
  Code, Code2, Boxes, Database, MousePointer, Zap, Shield, List, FileInput, FileText, Layers, Settings, Gauge, Navigation, Network, Palette, Server, Target, TestTube, GitBranch,
};

interface CoursePhase {
  courseId: string;
  title: string;
  subtitle: string;
  color: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  logo: string;
  phase: number;
}

const phases: CoursePhase[] = [
  {
    courseId: 'html-css',
    title: 'HTML & CSS',
    subtitle: 'Structure & Style',
    color: 'from-orange-400 to-red-500',
    borderColor: 'border-orange-400',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    accentColor: 'bg-orange-500',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/html/html.png',
    phase: 1,
  },
  {
    courseId: 'javascript',
    title: 'JavaScript',
    subtitle: 'Logic & Interactivity',
    color: 'from-yellow-400 to-yellow-600',
    borderColor: 'border-yellow-400',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    accentColor: 'bg-yellow-500',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png',
    phase: 2,
  },
  {
    courseId: 'react',
    title: 'React',
    subtitle: 'Components & State',
    color: 'from-cyan-400 to-blue-500',
    borderColor: 'border-cyan-400',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    accentColor: 'bg-cyan-500',
    logo: 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png',
    phase: 3,
  },
];

function FrontendJourneyContent() {
  const { user, updateStreak, isLessonCompleted, isExerciseCompleted, loading } = useUser();
  updateStreak();

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  const isLessonEffectivelyDone = (lessonId: string) => {
    if (isLessonCompleted(lessonId)) return true;
    const exercises = getExercisesForLesson(lessonId);
    return exercises.length > 0 && exercises.every(e => isExerciseCompleted(e.id));
  };

  const isModuleComplete = (moduleId: string) => {
    const lessons = getLessonsForModule(moduleId);
    return lessons.length > 0 && lessons.every(l => isLessonEffectivelyDone(l.id));
  };

  const getCourseProgress = (courseId: string) => {
    const courseModules = getModulesForCourse(courseId);
    if (courseModules.length === 0) return 0;
    const completed = courseModules.filter(m => isModuleComplete(m.id)).length;
    return Math.round((completed / courseModules.length) * 100);
  };

  const getModuleProgress = (moduleId: string) => {
    const lessons = getLessonsForModule(moduleId);
    const done = lessons.filter(l => isLessonEffectivelyDone(l.id)).length;
    return lessons.length > 0 ? Math.round((done / lessons.length) * 100) : 0;
  };

  return (
    <div className="page-enter">
      <div className="relative inline-block group mb-4">
        <a href="/learning-path" className="inline-flex items-center gap-2 text-gray-800 font-bold uppercase hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Paths
        </a>
        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-20 duration-200" />
      </div>

      <div className="mb-8">
        <PageTitle>
          <h1 className="text-2xl font-black text-gray-900 uppercase">Frontend Journey</h1>
        </PageTitle>
        <p className="text-gray-700 mt-1">Master frontend development step by step: HTML &rarr; JavaScript &rarr; React</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {phases.map((phase) => {
          const progress = getCourseProgress(phase.courseId);
          const moduleCount = getModulesForCourse(phase.courseId).length;
          return (
            <div key={phase.courseId} className={`border-2 ${phase.borderColor} rounded-lg p-4 ${phase.bgColor} relative overflow-hidden`}>
              <div className="flex items-center gap-3 mb-2">
                <img src={phase.logo} alt={phase.title} className="w-8 h-8 object-contain" />
                <div>
                  <p className={`text-xs font-bold uppercase ${phase.textColor}`}>Phase {phase.phase}</p>
                  <h3 className="font-bold text-gray-900 text-sm">{phase.title}</h3>
                </div>
              </div>
              <div className="w-full bg-white rounded-full h-2 mb-1">
                <div className={`${phase.accentColor} h-2 rounded-full transition-all duration-500`} style={{ width: `${Math.max(2, progress)}%` }} />
              </div>
              <p className="text-[10px] text-gray-600">{progress}% &middot; {moduleCount} modules</p>
            </div>
          );
        })}
      </div>

      {/* Phase Sections */}
      <div className="space-y-10">
        {phases.map((phase, phaseIndex) => {
          const courseModules = getModulesForCourse(phase.courseId);
          const prevPhase = phaseIndex > 0 ? phases[phaseIndex - 1] : null;
          const prevPhaseComplete = prevPhase ? getCourseProgress(prevPhase.courseId) === 100 : true;
          const isPhaseUnlocked = phaseIndex === 0 || prevPhaseComplete;

          return (
            <div key={phase.courseId}>
              {/* Phase Header with connector */}
              {phaseIndex > 0 && (
                <div className="flex justify-center mb-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-0.5 h-6 ${isPhaseUnlocked ? 'bg-primary-400' : 'bg-gray-300'}`} />
                    <ChevronRight className={`w-5 h-5 rotate-90 ${isPhaseUnlocked ? 'text-primary-500' : 'text-gray-300'}`} />
                  </div>
                </div>
              )}

              <div className={`border-2 rounded-lg p-5 ${isPhaseUnlocked ? `${phase.borderColor} bg-white` : 'border-gray-300 bg-gray-50'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isPhaseUnlocked ? phase.bgColor : 'bg-gray-200'}`}>
                    <img src={phase.logo} alt={phase.title} className={`w-8 h-8 object-contain ${!isPhaseUnlocked ? 'opacity-40 grayscale' : ''}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${isPhaseUnlocked ? `${phase.bgColor} ${phase.textColor}` : 'bg-gray-200 text-gray-500'}`}>
                        Phase {phase.phase}
                      </span>
                      {getCourseProgress(phase.courseId) === 100 && (
                        <CheckCircle className="w-4 h-4 text-primary-500" />
                      )}
                    </div>
                    <h2 className={`font-bold text-lg uppercase ${isPhaseUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>{phase.title}</h2>
                    <p className={`text-xs ${isPhaseUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>{phase.subtitle}</p>
                  </div>
                  {isPhaseUnlocked && (
                    <a href={`/learning-path/${phase.courseId}`} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                      View All <ChevronRight className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {!isPhaseUnlocked ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400 py-4 justify-center">
                    <Lock className="w-4 h-4" />
                    <span>Complete {prevPhase?.title} to unlock</span>
                  </div>
                ) : (
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {courseModules.map((module, idx) => {
                      const prevMod = idx > 0 ? courseModules[idx - 1] : null;
                      const isUnlocked = idx === 0 || (prevMod && isModuleComplete(prevMod.id));
                      const progress = getModuleProgress(module.id);
                      const complete = progress === 100;
                      const lessons = getLessonsForModule(module.id);
                      const completedCount = lessons.filter(l => isLessonEffectivelyDone(l.id)).length;
                      const Icon = iconMap[module.icon] || Code;

                      if (!isUnlocked) {
                        return (
                          <div key={module.id} className="border border-gray-200 bg-gray-50 rounded-lg p-3 opacity-50">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-gray-200 flex items-center justify-center rounded text-xs font-bold text-gray-400">{idx + 1}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-400 truncate">{module.title}</p>
                                <p className="text-[10px] text-gray-400 flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> Locked</p>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <a key={module.id} href={`/module/${module.id}`}
                          className="border border-gray-200 rounded-lg p-3 hover:border-primary-400 hover:shadow-sm transition-all bg-white group">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold ${complete ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 group-hover:bg-primary-100'}`}>
                              {complete ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                            </div>
                            <div className="w-6 h-6 flex items-center justify-center">
                              <Icon className={`w-4 h-4 ${complete ? 'text-primary-600' : 'text-gray-500'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate group-hover:text-primary-700">{module.title}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-100 rounded-full h-1">
                                  <div className="bg-primary-500 h-1 rounded-full transition-all" style={{ width: `${Math.max(2, progress)}%` }} />
                                </div>
                                <span className="text-[10px] text-gray-500">{completedCount}/{lessons.length}</span>
                              </div>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion banner */}
      <div className="mt-8 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
        <p className="text-2xl mb-2">🎓</p>
        <h3 className="font-bold text-gray-900 uppercase mb-1">Frontend Developer</h3>
        <p className="text-xs text-gray-600">Complete all 3 phases to earn your Frontend Developer badge</p>
      </div>
    </div>
  );
}

export default function FrontendJourneyPage() {
  return (
    <UserProvider>
      <FrontendJourneyContent />
    </UserProvider>
  );
}
