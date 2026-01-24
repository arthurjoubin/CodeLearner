import { useParams, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getModule, getLessonsForModule, getExercisesForLesson } from '../data/modules';
import { ArrowLeft, BookOpen, CheckCircle, Play, Star, Lock } from 'lucide-react';
import DifficultyBadge from '../components/DifficultyBadge';

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user, isLessonCompleted, isExerciseCompleted } = useUser();

  const module = moduleId ? getModule(moduleId) : undefined;
  const lessons = moduleId ? getLessonsForModule(moduleId) : [];

  const isLessonEffectivelyDone = (lessonId: string) => {
    if (isLessonCompleted(lessonId)) return true;
    const exercises = getExercisesForLesson(lessonId);
    return exercises.length > 0 && exercises.every(e => isExerciseCompleted(e.id));
  };

  if (!module || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-black font-bold">Module not found</p>
        <Link to="/" className="text-black underline font-bold uppercase">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <Link to="/learning-path/react" className="inline-flex items-center gap-2 text-black font-bold uppercase hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="bg-black text-white border-2 border-black p-5 mb-6">
        <h1 className="text-2xl font-black mb-1 uppercase">{module.title}</h1>
        <p className="text-gray-400 text-sm">{module.description}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {lessons.map((lesson, index) => {
          const exercises = getExercisesForLesson(lesson.id);
          const lessonDone = isLessonCompleted(lesson.id);
          const exercisesDone = exercises.filter(e => isExerciseCompleted(e.id)).length;
          const allExercisesDone = exercises.length === 0 || exercisesDone === exercises.length;
          const isAnythingDone = lessonDone || allExercisesDone;

          const prevLesson = index > 0 ? lessons[index - 1] : null;
          const isUnlocked = index === 0 || (prevLesson && isLessonEffectivelyDone(prevLesson.id));

          if (!isUnlocked) {
            return (
              <div key={lesson.id} className="border-2 border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-gray-400 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-400 uppercase">{lesson.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <Lock className="w-3 h-3" />
                      <span>Complete previous lesson</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          const progressPercent = exercises.length > 0
            ? Math.round((exercisesDone / exercises.length) * 100)
            : lessonDone ? 100 : 0;

          return (
            <div
              key={lesson.id}
              className={`border-2 border-black p-3 ${isAnythingDone ? 'bg-green-100 border-green-500' : 'bg-white'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 flex items-center justify-center font-bold border-2 border-black flex-shrink-0 text-sm ${lessonDone ? 'bg-primary-500 text-white' : 'bg-white text-black'
                  }`}>
                  {lessonDone ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-black uppercase text-sm mb-1.5">{lesson.title}</h3>
                  <div className="flex items-center flex-wrap gap-1.5 mb-2">
                    <DifficultyBadge difficulty={lesson.difficulty} size="sm" />
                    <span className="xp-badge text-xs py-0.5">
                      <Star className="w-3 h-3" />{lesson.xpReward}
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">Progress</span>
                      <span className="text-[9px] font-bold text-gray-600">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 border border-black overflow-hidden">
                      <div
                        className="h-full bg-primary-500 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <Link to={`/lesson/${lesson.id}`} className={`btn-primary text-xs py-1.5 inline-flex items-center gap-1.5 w-full justify-center ${isAnythingDone ? 'bg-green-500 hover:bg-green-600' : ''}`}>
                      <BookOpen className="w-3.5 h-3.5" />
                      {isAnythingDone ? '↺ Redo Course' : 'Start Course'}
                    </Link>
                  </div>

                  {exercises.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {exercises.map((exercise, i) => (
                        <Link
                          key={exercise.id}
                          to={`/exercise/${exercise.id}`}
                          className={`text-xs py-1 px-2 border-2 border-black font-bold inline-flex items-center gap-1 transition-all ${isExerciseCompleted(exercise.id) ? 'bg-primary-400 text-white' : 'bg-white hover:bg-gray-100 hover:shadow-brutal-sm'
                            }`}
                        >
                          {isExerciseCompleted(exercise.id) ? <CheckCircle className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          Exo {i + 1}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="font-bold">Coming soon...</p>
        </div>
      )}
    </div>
  );
}
