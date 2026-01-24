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
  ChevronDown,
  ChevronUp,
  List,
  Lock,
} from 'lucide-react';
import ReactMarkdown from './ReactMarkdown';
import DifficultyBadge from '../components/DifficultyBadge';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user, addXp, completeLesson, isLessonCompleted, isExerciseCompleted, loading } = useUser();

  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const module = lesson ? getModule(lesson.moduleId) : undefined;
  const exercises = lessonId ? getExercisesForLesson(lessonId) : [];
  const moduleLessons = module ? getLessonsForModule(module.id) : [];

  const [completed, setCompleted] = useState(false);
  const [showExercisesDropdown, setShowExercisesDropdown] = useState(false);
  const [showLessonsDropdown, setShowLessonsDropdown] = useState(false);

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

  if (!lesson || !module) {
    return (
      <div className="text-center py-12">
        <p className="text-black font-bold">Lesson not found</p>
        <Link to="/" className="text-black underline font-bold uppercase">
          Go back home
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-black font-bold">Please sign in to access this lesson</p>
        <Link to="/" className="text-black underline font-bold uppercase">Go back home</Link>
      </div>
    );
  }

  const alreadyCompleted = isLessonCompleted(lesson.id);
  const currentIndex = moduleLessons.findIndex(l => l.id === lesson.id);
  const nextLesson = moduleLessons[currentIndex + 1];

  const allExercisesCompleted = exercises.length === 0 || exercises.every(ex => isExerciseCompleted(ex.id));
  const completedExercisesCount = exercises.filter(ex => isExerciseCompleted(ex.id)).length;

  const handleComplete = () => {
    if (!alreadyCompleted && allExercisesCompleted) {
      addXp(lesson.xpReward);
      completeLesson(lesson.id);
    }
    setCompleted(true);
  };

  const isLessonEffectivelyDone = (lid: string) => {
    if (isLessonCompleted(lid)) return true;
    const exs = getExercisesForLesson(lid);
    return exs.length > 0 && exs.every(e => isExerciseCompleted(e.id));
  };

  const isLessonUnlocked = (_lid: string, index: number) => {
    if (index === 0) return true;
    const prevLesson = moduleLessons[index - 1];
    return prevLesson && isLessonEffectivelyDone(prevLesson.id);
  };

  return (
    <div className="page-enter">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 pb-3 border-b-2 border-black">
        <div className="relative group">
          <Link to={`/module/${module.id}`} className="p-2 border-2 border-black hover:bg-primary-500 hover:border-primary-500 transition-colors block">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <p className="text-[10px] text-gray-500 font-bold uppercase hidden md:block">{module.title} / {currentIndex + 1}</p>
        <h1 className="text-base md:text-lg font-black text-black uppercase truncate max-w-[150px] md:max-w-none group-hover:text-primary-600 transition-colors">{lesson.title}</h1>

        <div className="flex items-center gap-2 ml-auto">
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
          {exercises.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowExercisesDropdown(!showExercisesDropdown)}
                className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                Exercises ({completedExercisesCount}/{exercises.length})
                {showExercisesDropdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {showExercisesDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white border-2 border-black z-10 min-w-[200px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {exercises.map((exercise, index) => {
                    const exCompleted = isExerciseCompleted(exercise.id);
                    return (
                      <Link
                        key={exercise.id}
                        to={`/exercise/${exercise.id}`}
                        onClick={() => setShowExercisesDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 border-b border-black last:border-b-0"
                      >
                        {exCompleted ? (
                          <CheckCircle className="w-4 h-4 text-primary-500 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-black shrink-0" />
                        )}
                        <span className="text-xs font-bold uppercase">{index + 1}. {exercise.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border-2 border-black p-5 md:p-6 mb-4">
        <ReactMarkdown content={lesson.content} />

        {lesson.codeExample && (
          <div className="mt-5 pt-4 border-t border-gray-200">
            <p className="font-bold text-xs uppercase mb-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Example
            </p>
            <pre className="bg-gray-900 text-gray-100 p-3 overflow-x-auto text-xs border-2 border-black">
              <code>{lesson.codeExample}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Bottom Nav - Lessons Dropdown */}
      <div className="flex items-center justify-end gap-2">
        <div className="relative">
          <button
            onClick={() => setShowLessonsDropdown(!showLessonsDropdown)}
            className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
          >
            <List className="w-3.5 h-3.5" />
            {currentIndex + 1}/{moduleLessons.length}
            {showLessonsDropdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showLessonsDropdown && (
            <div className="absolute right-0 bottom-full mb-1 bg-white border-2 border-black z-10 min-w-[200px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-[200px] overflow-y-auto">
              {moduleLessons.map((lessonItem, index) => {
                const lessonCompleted = isLessonCompleted(lessonItem.id);
                const unlocked = isLessonUnlocked(lessonItem.id, index);
                return (
                  <div
                    key={lessonItem.id}
                    className={`flex items-center gap-2 px-3 py-2 border-b border-black last:border-b-0 ${!unlocked ? 'bg-gray-50' : lessonItem.id === lesson.id ? 'bg-gray-100' : ''}`}
                  >
                    {unlocked ? (
                      lessonCompleted ? (
                        <CheckCircle className="w-4 h-4 text-primary-500 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-black shrink-0" />
                      )
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                    <span className={`text-xs font-bold uppercase ${!unlocked ? 'text-gray-400' : ''}`}>{index + 1}. {lessonItem.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {(!completed && !alreadyCompleted && !allExercisesCompleted) ? (
          <button onClick={handleComplete} className="btn-primary text-xs py-1.5 inline-flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Complete +{lesson.xpReward} XP
          </button>
        ) : nextLesson ? (
          <Link to={`/lesson/${nextLesson.id}`} className="btn-primary text-xs py-1.5 inline-flex items-center gap-1.5">
            Next <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <Link to={`/module/${module.id}`} className="btn-primary text-xs py-1.5 inline-flex items-center gap-1.5">
            Back to Module <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Completion Modal */}
      {completed && !alreadyCompleted && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black p-6 text-center max-w-xs animate-pop">
            <CheckCircle className="w-12 h-12 text-primary-500 mx-auto mb-3" />
            <h2 className="text-xl font-black mb-2 uppercase">Completed!</h2>
            <p className="text-sm mb-4 font-bold text-yellow-600">+{lesson.xpReward} XP</p>
            <div className="flex flex-col gap-2">
              {exercises.length > 0 && !allExercisesCompleted ? (
                <Link to={`/exercise/${exercises[0].id}`} className="btn-primary text-sm">
                  Do the exercises
                </Link>
              ) : nextLesson ? (
                <Link to={`/lesson/${nextLesson.id}`} className="btn-primary text-sm">
                  Next Lesson <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link to={`/module/${module.id}`} className="btn-primary text-sm">
                  Back to Module <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <button onClick={() => setCompleted(false)} className="btn-secondary text-xs">
                Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
