import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getLesson, getModule, getExercisesForLesson, getLessonsForModule } from '../data/modules';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Star,
  Code2,
} from 'lucide-react';
import ReactMarkdown from './ReactMarkdown';
import DifficultyBadge from '../components/DifficultyBadge';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user, addXp, completeLesson, isLessonCompleted, isExerciseCompleted } = useUser();

  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const module = lesson ? getModule(lesson.moduleId) : undefined;
  const exercises = lessonId ? getExercisesForLesson(lessonId) : [];
  const moduleLessons = module ? getLessonsForModule(module.id) : [];

  const [completed, setCompleted] = useState(false);

  if (!lesson || !module || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-black font-bold">Lesson not found</p>
        <Link to="/" className="text-black underline font-bold uppercase">
          Go back home
        </Link>
      </div>
    );
  }

  const alreadyCompleted = isLessonCompleted(lesson.id);
  const currentIndex = moduleLessons.findIndex(l => l.id === lesson.id);
  const nextLesson = moduleLessons[currentIndex + 1];
  const prevLesson = moduleLessons[currentIndex - 1];

  const allExercisesCompleted = exercises.length === 0 || exercises.every(ex => isExerciseCompleted(ex.id));
  const completedExercisesCount = exercises.filter(ex => isExerciseCompleted(ex.id)).length;

  const handleComplete = () => {
    if (!alreadyCompleted && allExercisesCompleted) {
      addXp(lesson.xpReward);
      completeLesson(lesson.id);
    }
    setCompleted(true);
  };

  return (
    <div className="page-enter">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <Link to={`/module/${module.id}`} className="p-2 border-2 border-black hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">{module.title} / {currentIndex + 1}</p>
            <h1 className="text-lg font-black text-black uppercase">{lesson.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DifficultyBadge difficulty={lesson.difficulty} />
          <span className="xp-badge text-xs">
            <Star className="w-3 h-3" />
            {lesson.xpReward}
          </span>
          {alreadyCompleted && (
            <div className="bg-primary-500 p-1 border-2 border-black">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}

          {/* Exercise button in header */}
          {exercises.length > 0 && (
            <Link
              to={`/exercise/${exercises[0].id}`}
              className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1.5 ml-2"
            >
              <Code2 className="w-3.5 h-3.5" />
              Exercices ({completedExercisesCount}/{exercises.length})
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border-2 border-black p-5 md:p-6 mb-4">
        <ReactMarkdown content={lesson.content} />

        {lesson.codeExample && (
          <div className="mt-5 pt-4 border-t border-gray-200">
            <p className="font-bold text-xs uppercase mb-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Exemple
            </p>
            <pre className="bg-gray-900 text-gray-100 p-3 overflow-x-auto text-xs border-2 border-black">
              <code>{lesson.codeExample}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between">
        {prevLesson ? (
          <Link to={`/lesson/${prevLesson.id}`} className="btn-secondary text-xs py-1.5 inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Précédent
          </Link>
        ) : <div />}

        {!completed && !alreadyCompleted ? (
          <button onClick={handleComplete} className="btn-primary text-xs py-1.5 inline-flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Terminer +{lesson.xpReward} XP
          </button>
        ) : nextLesson ? (
          <Link to={`/lesson/${nextLesson.id}`} className="btn-primary text-xs py-1.5 inline-flex items-center gap-1.5">
            Suivant <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <Link to={`/module/${module.id}`} className="btn-primary text-xs py-1.5 inline-flex items-center gap-1.5">
            Retour au module <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Completion Modal */}
      {completed && !alreadyCompleted && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black p-6 text-center max-w-xs animate-pop">
            <CheckCircle className="w-12 h-12 text-primary-500 mx-auto mb-3" />
            <h2 className="text-xl font-black mb-2 uppercase">Terminé!</h2>
            <p className="text-sm mb-4 font-bold text-yellow-600">+{lesson.xpReward} XP</p>
            <div className="flex flex-col gap-2">
              {exercises.length > 0 ? (
                <Link to={`/exercise/${exercises[0].id}`} className="btn-primary text-sm">
                  Faire les exercices
                </Link>
              ) : nextLesson ? (
                <Link to={`/lesson/${nextLesson.id}`} className="btn-primary text-sm">
                  Leçon suivante
                </Link>
              ) : (
                <Link to={`/module/${module.id}`} className="btn-primary text-sm">
                  Retour au module
                </Link>
              )}
              <button onClick={() => setCompleted(false)} className="btn-secondary text-xs">
                Revoir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
