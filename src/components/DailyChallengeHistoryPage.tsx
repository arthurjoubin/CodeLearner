import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Lock, CheckCircle, Loader } from 'lucide-react';
import { api } from '../services/api';
import { useUser, UserProvider } from '../context/UserContext';
import Breadcrumb from './Breadcrumb';
import { PageTitle } from './PageTitle';

interface ChallengeHistoryItem {
  date: string;
  language: string;
  difficulty: string;
  title: string | null;
  description: string | null;
}

const difficultyColors: Record<string, string> = {
  easy: 'text-green-600 bg-green-50 border-green-500',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-500',
  hard: 'text-red-600 bg-red-50 border-red-500',
};

const difficultyLabels: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const languageLabels: Record<string, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  rust: 'Rust',
  go: 'Go',
};

function DailyChallengeHistoryContent() {
  const { isExerciseCompleted, loading: userLoading } = useUser();
  const [history, setHistory] = useState<ChallengeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLoading) return;

    const fetchHistory = async () => {
      try {
        const result = await api.getDailyChallengeHistory(30);
        setHistory(result.history);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userLoading]);

  const today = new Date().toISOString().split('T')[0];

  const getChallengeStatus = (date: string) => {
    if (date === today) return 'today';
    if (isExerciseCompleted(`daily-${date}`)) return 'completed';
    if (new Date(date) > new Date(today)) return 'future';
    return 'missed';
  };

  if (loading) {
    return (
      <div className="page-enter max-w-4xl mx-auto py-8">
        <Breadcrumb items={[
          { label: 'Daily Challenge', href: '/codecraft' },
          { label: 'History' },
        ]} />
        <div className="flex flex-col items-center justify-center h-96">
          <Loader className="w-10 h-10 animate-spin text-primary-600 mb-4" />
          <p className="text-gray-500 font-medium">Loading challenge history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-enter max-w-4xl mx-auto py-8">
        <Breadcrumb items={[
          { label: 'Daily Challenge', href: '/codecraft' },
          { label: 'History' },
        ]} />
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-red-600 font-bold mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-4xl mx-auto py-8">
      <Breadcrumb items={[
        { label: 'Daily Challenge', href: '/codecraft' },
        { label: 'History' },
      ]} />

      <div className="mb-10">
        <PageTitle>
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Challenge History</h1>
          </div>
        </PageTitle>
        <p className="text-gray-500 mt-2 font-medium">Browse past and upcoming daily challenges</p>
      </div>

      <div className="space-y-4">
        {history.map((challenge) => {
          const status = getChallengeStatus(challenge.date);
          const isClickable = status === 'today' || status === 'missed';
          const dateObj = new Date(challenge.date);

          return (
            <a
              key={challenge.date}
              href={isClickable ? `/codecraft/daily?date=${challenge.date}` : undefined}
              className={`block border-2 rounded-xl p-5 transition-all duration-200 ${
                isClickable
                  ? 'border-gray-300 hover:border-primary-500 hover:shadow-md bg-white cursor-pointer'
                  : 'border-gray-100 bg-gray-50/50 cursor-default'
              }`}
            >
              <div className="flex items-center gap-6">
                {/* Date */}
                <div className="flex-shrink-0 w-24 text-center border-r-2 border-gray-100 pr-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <p className={`text-2xl font-black ${status === 'today' ? 'text-primary-600' : 'text-gray-900'}`}>{dateObj.getDate()}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</p>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-black text-gray-900 uppercase tracking-tight">
                      {languageLabels[challenge.language] || challenge.language}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border-2 ${difficultyColors[challenge.difficulty]}`}>
                      {difficultyLabels[challenge.difficulty]}
                    </span>
                    {status === 'today' && (
                      <span className="text-[10px] font-black text-white bg-gray-900 px-2 py-0.5 rounded uppercase tracking-widest">
                        TODAY
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-500 truncate">
                    {challenge.title || 'Daily AI-generated coding exercise'}
                  </p>
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                  {status === 'completed' && (
                    <div className="flex items-center gap-2 text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg border-2 border-primary-100">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-tight">Done</span>
                    </div>
                  )}
                  {status === 'future' && (
                    <div className="flex items-center gap-2 text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg border-2 border-gray-200">
                      <Lock className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-tight">Locked</span>
                    </div>
                  )}
                  {(status === 'today' || status === 'missed') && (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-primary-100 transition-colors">
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary-600" />
                    </div>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-12 p-6 border-2 border-gray-200 rounded-2xl bg-white shadow-sm">
        <h3 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">Status Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-900"></div>
            <span className="font-bold text-gray-700">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-500"></div>
            <span className="font-bold text-gray-700">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="font-bold text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-100"></div>
            <span className="font-bold text-gray-700">Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component with UserProvider
export default function DailyChallengeHistoryPage() {
  return (
    <UserProvider>
      <DailyChallengeHistoryContent />
    </UserProvider>
  );
}
