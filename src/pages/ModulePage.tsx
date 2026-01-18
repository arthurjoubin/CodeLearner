import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getModule, getLessonsForModule, getExercisesForLesson } from '../data/modules';
import { ArrowLeft, BookOpen, Code2, CheckCircle, Play, Star } from 'lucide-react';

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user, isLessonCompleted, isExerciseCompleted } = useUser();

  const module = moduleId ? getModule(moduleId) : undefined;
  const lessons = moduleId ? getLessonsForModule(moduleId) : [];

  if (!module || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-black font-bold">Module not found</p>
        <Link to="/" className="text-black underline font-bold uppercase">
          Go back home
        </Link>
      </div>
    );
  }

  const isLocked = user.xp < module.requiredXp;

  if (isLocked) {
    navigate('/');
    return null;
  }

  return (
    <div>
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-black font-bold uppercase hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to modules
      </Link>

      {/* Module header */}
      <div className="bg-black text-white border-4 border-black p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2 uppercase">{module.title}</h1>
        <p className="text-gray-300">{module.description}</p>
      </div>

      {/* Lessons list */}
      <div className="space-y-4">
        {lessons.map((lesson, index) => {
          const exercises = getExercisesForLesson(lesson.id);
          const lessonDone = isLessonCompleted(lesson.id);
          const exercisesDone = exercises.filter(e => isExerciseCompleted(e.id)).length;
          const allExercisesDone = exercises.length > 0 && exercisesDone === exercises.length;

          return (
            <div key={lesson.id} className="card">
              {/* Lesson header */}
              <div className="flex items-start gap-4">
                {/* Step number */}
                <div
                  className={`w-12 h-12 flex items-center justify-center font-bold text-lg border-3 border-black ${
                    lessonDone
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-black'
                  }`}
                >
                  {lessonDone ? <CheckCircle className="w-6 h-6" /> : index + 1}
                </div>

                {/* Lesson info */}
                <div className="flex-1">
                  <h3 className="font-bold text-black mb-1 uppercase text-lg">{lesson.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-black mb-3">
                    <span className="flex items-center gap-1 xp-badge">
                      <Star className="w-4 h-4" />
                      {lesson.xpReward} XP
                    </span>
                    <span className="flex items-center gap-1 bg-gray-200 px-2 py-1 border-2 border-black font-bold">
                      <Code2 className="w-4 h-4" />
                      {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/lesson/${lesson.id}`}
                      className="btn-primary inline-flex items-center gap-2 text-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      {lessonDone ? 'Review Lesson' : 'Start Lesson'}
                    </Link>

                    {exercises.map((exercise, i) => (
                      <Link
                        key={exercise.id}
                        to={`/exercise/${exercise.id}`}
                        className={`inline-flex items-center gap-2 text-sm py-2 px-3 border-2 border-black font-bold uppercase transition-all ${
                          isExerciseCompleted(exercise.id)
                            ? 'bg-primary-400 text-black'
                            : 'bg-white text-black hover:bg-gray-100'
                        } hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal`}
                      >
                        {isExerciseCompleted(exercise.id) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        Exercise {i + 1}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Completion indicator */}
                {lessonDone && allExercisesDone && (
                  <div className="bg-primary-500 p-2 border-2 border-black">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12 text-black">
          <p className="font-bold uppercase">Coming soon! More lessons are being added.</p>
        </div>
      )}
    </div>
  );
}
