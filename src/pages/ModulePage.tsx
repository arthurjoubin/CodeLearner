import { useParams, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getModule, getLessonsForModule, getExercisesForLesson } from '../data/modules';
import { ArrowLeft, BookOpen, Code2, CheckCircle, Play, Star, Lock } from 'lucide-react';
import DifficultyBadge from '../components/DifficultyBadge';

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user, isLessonCompleted, isExerciseCompleted } = useUser();

  const module = moduleId ? getModule(moduleId) : undefined;
  const lessons = moduleId ? getLessonsForModule(moduleId) : [];

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
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-2 text-black font-bold uppercase hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>

      {/* Header */}
      <div className="bg-black text-white border-2 border-black p-5 mb-6">
        <h1 className="text-2xl font-black mb-1 uppercase">{module.title}</h1>
        <p className="text-gray-400 text-sm">{module.description}</p>
      </div>

      {/* Lessons - 3 columns */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {lessons.map((lesson, index) => {
          const exercises = getExercisesForLesson(lesson.id);
          const lessonDone = isLessonCompleted(lesson.id);
          const exercisesDone = exercises.filter(e => isExerciseCompleted(e.id)).length;
          const allExercisesDone = exercises.length === 0 || exercisesDone === exercises.length;
          const isFullComplete = lessonDone && allExercisesDone;

          // Unlock: first lesson always unlocked, others need previous lesson completed
          const prevLesson = index > 0 ? lessons[index - 1] : null;
          const isUnlocked = index === 0 || (prevLesson && isLessonCompleted(prevLesson.id));

          // Locked lesson
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
                      <span>Complétez la leçon précédente</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Unlocked lesson
          return (
            <div
              key={lesson.id}
              className={`border-2 border-black p-4 ${isFullComplete ? 'bg-primary-50 border-primary-500' : 'bg-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 flex items-center justify-center font-bold border-2 border-black ${
                  lessonDone ? 'bg-primary-500 text-white' : 'bg-white text-black'
                }`}>
                  {lessonDone ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-black uppercase">{lesson.title}</h3>
                  <div className="flex items-center flex-wrap gap-2 mt-1 mb-2">
                    <DifficultyBadge difficulty={lesson.difficulty} size="sm" />
                    <span className="xp-badge text-xs py-0.5">
                      <Star className="w-3 h-3" />{lesson.xpReward}
                    </span>
                    {exercises.length > 0 && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 border border-black font-bold">
                        <Code2 className="w-3 h-3 inline mr-1" />{exercisesDone}/{exercises.length}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link to={`/lesson/${lesson.id}`} className="btn-primary text-xs py-1.5 inline-flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      {lessonDone ? 'Revoir' : 'Commencer'}
                    </Link>
                    {exercises.map((exercise, i) => (
                      <Link
                        key={exercise.id}
                        to={`/exercise/${exercise.id}`}
                        className={`text-xs py-1.5 px-2.5 border-2 border-black font-bold inline-flex items-center gap-1 ${
                          isExerciseCompleted(exercise.id) ? 'bg-primary-400' : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        {isExerciseCompleted(exercise.id) ? <CheckCircle className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        Ex.{i + 1}
                      </Link>
                    ))}
                  </div>
                </div>

                {isFullComplete && (
                  <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="font-bold">Contenu à venir...</p>
        </div>
      )}
    </div>
  );
}
