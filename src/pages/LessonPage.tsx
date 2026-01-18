import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getLesson, getModule, getExercisesForLesson, getLessonsForModule } from '../data/modules';
import { ChatMessage } from '../types';
import { api } from '../services/api';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Send,
  X,
  Star,
  Loader,
  Code2,
} from 'lucide-react';
import ReactMarkdown from './ReactMarkdown';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user, addXp, completeLesson, isLessonCompleted, isExerciseCompleted } = useUser();

  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const module = lesson ? getModule(lesson.moduleId) : undefined;
  const exercises = lessonId ? getExercisesForLesson(lessonId) : [];
  const moduleLessons = module ? getLessonsForModule(module.id) : [];

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const handleComplete = () => {
    if (!alreadyCompleted) {
      addXp(lesson.xpReward);
      completeLesson(lesson.id);
    }
    setCompleted(true);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.chat(
        [...messages, userMessage],
        {
          topic: `${module.title} - ${lesson.title}`,
          lessonContent: lesson.content.substring(0, 1500), // Limit context size
        }
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I had trouble responding. Please try again!',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Back button */}
      <Link
        to={`/module/${module.id}`}
        className="inline-flex items-center gap-2 text-black font-bold uppercase hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {module.title}
      </Link>

      {/* Lesson content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-black font-bold mb-1 uppercase">
                  {module.title}
                </div>
                <h1 className="text-2xl font-bold text-black uppercase">
                  {lesson.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="xp-badge">
                  <Star className="w-4 h-4" />
                  {lesson.xpReward} XP
                </span>
                {alreadyCompleted && (
                  <div className="bg-primary-500 p-1 border-2 border-black">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-gray max-w-none">
              <ReactMarkdown content={lesson.content} />
            </div>

            {/* Code example */}
            {lesson.codeExample && (
              <div className="mt-6">
                <h3 className="font-bold text-black mb-2 flex items-center gap-2 uppercase">
                  <Code2 className="w-5 h-5" />
                  Live Example
                </h3>
                <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm border-3 border-black">
                  <code>{lesson.codeExample}</code>
                </pre>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t-3 border-black">
              {prevLesson ? (
                <Link
                  to={`/lesson/${prevLesson.id}`}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Link>
              ) : (
                <div />
              )}

              {!completed && !alreadyCompleted ? (
                <button
                  onClick={handleComplete}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Complete (+{lesson.xpReward} XP)
                </button>
              ) : nextLesson ? (
                <Link
                  to={`/lesson/${nextLesson.id}`}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Next Lesson
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : exercises.length > 0 ? (
                <Link
                  to={`/exercise/${exercises[0].id}`}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Start Exercises
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to={`/module/${module.id}`}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Back to Module
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Exercises */}
          {exercises.length > 0 && (
            <div className="card">
              <h3 className="font-bold text-black mb-3 uppercase">Practice Exercises</h3>
              <div className="space-y-2">
                {exercises.map((exercise, i) => (
                  <Link
                    key={exercise.id}
                    to={`/exercise/${exercise.id}`}
                    className={`block p-3 transition-all border-2 border-black ${
                      isExerciseCompleted(exercise.id)
                        ? 'bg-primary-100'
                        : 'bg-white hover:bg-gray-100'
                    } hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-black uppercase">
                        {i + 1}. {exercise.title}
                      </span>
                      {isExerciseCompleted(exercise.id) && (
                        <CheckCircle className="w-5 h-5 text-primary-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-black mt-1">
                      <span
                        className={`px-2 py-0.5 text-xs font-bold uppercase border-2 border-black ${
                          exercise.difficulty === 'easy'
                            ? 'bg-green-400 text-black'
                            : exercise.difficulty === 'medium'
                            ? 'bg-yellow-400 text-black'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {exercise.difficulty}
                      </span>
                      <span className="font-bold">+{exercise.xpReward} XP</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ask AI button */}
          <button
            onClick={() => setShowChat(true)}
            className="w-full card-interactive flex items-center justify-center gap-2 text-black font-bold uppercase"
          >
            <MessageCircle className="w-5 h-5" />
            Ask AI Tutor
          </button>
        </div>
      </div>

      {/* Chat panel */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black w-full max-w-lg h-[600px] flex flex-col">
            {/* Chat header */}
            <div className="p-4 border-b-3 border-black flex items-center justify-between bg-yellow-400">
              <div>
                <h3 className="font-bold text-black uppercase">AI Tutor</h3>
                <p className="text-sm text-black">Ask anything about {lesson.title}</p>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-yellow-500 border-2 border-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-black py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-bold">Ask me anything about this lesson!</p>
                  <div className="mt-4 space-y-2">
                    {[
                      "Can you explain this simpler?",
                      "Why is this important?",
                      "Show me another example",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setInput(suggestion)}
                        className="block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 border-2 border-black text-sm font-mono"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 border-2 border-black ${
                      msg.role === 'user'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-black'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-p:my-1 prose-pre:my-2 prose-code:text-primary-600">
                        <ReactMarkdown content={msg.content} />
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 border-2 border-black">
                    <Loader className="w-5 h-5 animate-spin text-black" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat input */}
            <div className="p-4 border-t-3 border-black">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your question..."
                  className="input-brutal flex-1"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="btn-primary p-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion celebration */}
      {completed && !alreadyCompleted && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-8 text-center max-w-md animate-pop">
            <div className="w-20 h-20 bg-primary-500 flex items-center justify-center mx-auto mb-4 border-3 border-black">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2 uppercase">
              Lesson Complete!
            </h2>
            <p className="text-black mb-4">
              You earned {lesson.xpReward} XP. Keep up the great work!
            </p>
            <div className="flex gap-3 justify-center">
              {exercises.length > 0 ? (
                <Link
                  to={`/exercise/${exercises[0].id}`}
                  className="btn-primary"
                >
                  Start Exercises
                </Link>
              ) : nextLesson ? (
                <Link
                  to={`/lesson/${nextLesson.id}`}
                  className="btn-primary"
                >
                  Next Lesson
                </Link>
              ) : (
                <Link to={`/module/${module.id}`} className="btn-primary">
                  Continue
                </Link>
              )}
              <button
                onClick={() => setCompleted(false)}
                className="btn-secondary"
              >
                Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
