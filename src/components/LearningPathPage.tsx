import { useUser, UserProvider } from '../context/UserContext';
import { getModulesForCourse, getLessonsForModule, getExercisesForLesson } from '../data/modules';
import { Lock, CheckCircle, ArrowLeft, ChevronRight, Code, Clock } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageTitle } from '../components/PageTitle';
import { estimateModuleHours, estimateCourseHours, formatHours } from '../utils/estimateHours';

export interface LearningPathCourse {
  id: string;
  title: string;
  subtitle: string;
  logo: string;
  color: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  phase: number;
}

export interface LearningPathData {
  id: string;
  title: string;
  description: string;
  icon: string;
  courses: LearningPathCourse[];
}

interface LearningPathPageProps {
  pathData: LearningPathData;
}

// Icon mapping for modules
const iconMap: Record<string, React.ElementType> = {
  Code, // Fallback
};

function LearningPathContent({ pathData }: LearningPathPageProps) {
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
          <h1 className="text-2xl font-black text-gray-900 uppercase">{pathData.title}</h1>
        </PageTitle>
        <p className="text-gray-700 mt-1">{pathData.description}</p>
      </div>

      {/* Phase Sections - Courses with Modules */}
      <div className="space-y-8">
        {pathData.courses.map((course, courseIndex) => {
          const courseModules = getModulesForCourse(course.id);
          const prevCourse = courseIndex > 0 ? pathData.courses[courseIndex - 1] : null;
          const prevCourseComplete = prevCourse ? getCourseProgress(prevCourse.id) === 100 : true;
          const isUnlocked = courseIndex === 0 || prevCourseComplete;
          const courseProgress = getCourseProgress(course.id);

          return (
            <div key={course.id}>
              {/* Connector */}
              {courseIndex > 0 && (
                <div className="flex justify-center mb-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-0.5 h-4 ${isUnlocked ? 'bg-primary-400' : 'bg-gray-300'}`} />
                    <ChevronRight className={`w-4 h-4 rotate-90 ${isUnlocked ? 'text-primary-500' : 'text-gray-300'}`} />
                  </div>
                </div>
              )}

              {/* Course Card - Compact Header */}
              <a
                href={`/courses/${course.id}`}
                className={`block border-2 rounded-xl p-4 mb-3 transition-all hover:shadow-md ${isUnlocked ? `${course.borderColor} bg-white` : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-75'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isUnlocked ? course.bgColor : 'bg-gray-200'}`}>
                    <img src={course.logo} alt={course.title} className={`w-7 h-7 object-contain ${!isUnlocked ? 'opacity-40 grayscale' : ''}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isUnlocked ? `${course.bgColor} ${course.textColor}` : 'bg-gray-200 text-gray-500'}`}>
                        Phase {course.phase}
                      </span>
                      {courseProgress === 100 && (
                        <CheckCircle className="w-3.5 h-3.5 text-primary-500" />
                      )}
                      {!isUnlocked && (
                        <Lock className="w-3 h-3 text-gray-400" />
                      )}
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isUnlocked ? 'bg-gray-100 text-gray-600' : 'bg-gray-200 text-gray-500'}`}>
                        <Clock className="w-3 h-3" />
                        {formatHours(estimateCourseHours(course.id))}
                      </span>
                    </div>
                    <h2 className={`font-bold text-base uppercase truncate ${isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>{course.title}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-20 bg-gray-200 rounded-full h-1">
                        <div className={`${course.accentColor} h-1 rounded-full transition-all duration-500`} style={{ width: `${Math.max(2, courseProgress)}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-500">{courseModules.length} modules</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isUnlocked ? 'text-gray-400' : 'text-gray-300'}`} />
                </div>
              </a>

              {/* Modules Grid - Always visible, style varies by lock state */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-4 pl-4 border-l-2 border-gray-200">
                {courseModules.map((module, idx) => {
                  // When course is unlocked, check individual module unlock status
                  // When course is locked, all modules are shown as locked preview
                  const prevMod = idx > 0 ? courseModules[idx - 1] : null;
                  const isModuleUnlocked = isUnlocked && (idx === 0 || (prevMod && isModuleComplete(prevMod.id)));
                  const progress = getModuleProgress(module.id);
                  const isComplete = progress === 100;
                  const lessons = getLessonsForModule(module.id);
                  const completedCount = lessons.filter(l => isLessonEffectivelyDone(l.id)).length;
                  const Icon = iconMap[module.icon] || Code;

                  // Locked preview state (course locked or module locked)
                  if (!isModuleUnlocked) {
                    const moduleHours = estimateModuleHours(module);
                    return (
                      <div key={module.id} className={`flex items-center gap-2 p-2 rounded-lg border ${isUnlocked ? 'bg-gray-100/50 border-gray-200 opacity-60' : 'bg-gray-50/80 border-gray-200 opacity-50'}`}>
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${isUnlocked ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 text-gray-300'}`}>
                          {idx + 1}
                        </div>
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                          <Icon className={`w-3.5 h-3.5 ${isUnlocked ? 'text-gray-300' : 'text-gray-300'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${isUnlocked ? 'text-gray-400' : 'text-gray-400'}`}>{module.title}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock className={`w-3 h-3 ${isUnlocked ? 'text-gray-300' : 'text-gray-300'}`} />
                            <span className={`text-[8px] ${isUnlocked ? 'text-gray-400' : 'text-gray-400'}`}>{formatHours(moduleHours)}</span>
                          </div>
                        </div>
                        <Lock className={`w-3 h-3 ${isUnlocked ? 'text-gray-300' : 'text-gray-300'}`} />
                      </div>
                    );
                  }

                  // Unlocked and accessible
                  const moduleHours = estimateModuleHours(module);
                  return (
                    <a
                      key={module.id}
                      href={`/module/${module.id}`}
                      className="group flex items-center gap-2 p-2.5 rounded-lg bg-white border border-gray-200 hover:border-primary-400 hover:shadow-sm transition-all"
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-colors ${isComplete ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-primary-100'}`}>
                        {isComplete ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <Icon className={`w-3.5 h-3.5 ${isComplete ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate group-hover:text-gray-900">{module.title}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-[8px] text-gray-500">{formatHours(moduleHours)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-10 bg-gray-100 rounded-full h-1">
                          <div className={`h-1 rounded-full transition-all ${isComplete ? 'bg-primary-500' : 'bg-primary-400'}`} style={{ width: `${Math.max(10, progress)}%` }} />
                        </div>
                        <span className="text-[9px] text-gray-400">{completedCount}/{lessons.length}</span>
                      </div>
                    </a>
                  );
                })}
              </div>

              {!isUnlocked && (
                <div className="flex items-center gap-2 py-2 px-4 mt-2">
                  <Lock className="w-3 h-3 text-gray-300" />
                  <span className="text-[10px] text-gray-400">Complete Phase {courseIndex} to unlock</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion banner */}
      <div className="mt-8 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
        <p className="text-2xl mb-2">{pathData.icon}</p>
        <h3 className="font-bold text-gray-900 uppercase mb-1">{pathData.title}</h3>
        <p className="text-xs text-gray-600">Complete all phases to earn your {pathData.title} badge</p>
      </div>
    </div>
  );
}

export default function LearningPathPage({ pathData }: LearningPathPageProps) {
  return (
    <UserProvider>
      <LearningPathContent pathData={pathData} />
    </UserProvider>
  );
}
