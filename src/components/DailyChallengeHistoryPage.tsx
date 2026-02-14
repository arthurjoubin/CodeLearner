import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Lock, CheckCircle, Loader } from 'lucide-react';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';
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

export default function DailyChallengeHistoryPage() {
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
      <div className="page-enter max-w-4xl mx-auto">
        <Breadcrumb items={[
          { label: 'Daily Challenge', href: '/codecraft' },
          { label: 'History' },
        ]} />
        <div className="flex flex-col items-center justify-center h-96">
          <Loader className="w-12 h-12 animate-spin text-primary-600 mb-4" />
          <p className="text-gray-600 font-bold">Loading challenge history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-enter max-w-4xl mx-auto">
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
    <div className="page-enter max-w-4xl mx-auto">
      <Breadcrumb items={[
        { label: 'Daily Challenge', href: '/codecraft' },
        { label: 'History' },
      ]} />

      <div className="mb-8">
        <PageTitle>
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-accent-600" />
            <h1 className="text-2xl font-black text-gray-900 uppercase">Challenge History</h1>
          </div>
        </PageTitle>
        <p className="text-gray-600 mt-2">Browse past and upcoming daily challenges</p>
      </div>

      <div className="space-y-3">
        {history.map((challenge) => {
          const status = getChallengeStatus(challenge.date);
          const isClickable = status === 'today' || status === 'missed';
          const dateObj = new Date(challenge.date);

          return (
            <a
              key={challenge.date}
              href={isClickable ? `/codecraft/daily?date=${challenge.date}` : undefined}
              className={`block border-2 rounded-lg p-4 transition-all ${
                isClickable
                  ? 'border-gray-300 hover:border-accent-500 hover:shadow-md bg-white cursor-pointer'
                  : 'border-gray-200 bg-gray-50 cursor-default'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Date */}
                <div className="flex-shrink-0 w-20 text-center">
                  <p className="text-xs text-gray-500 uppercase">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <p className="text-lg font-bold text-gray-900">{dateObj.getDate()}</p>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-700">
                      {languageLabels[challenge.language] || challenge.language}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${difficultyColors[challenge.difficulty]}`}>
                      {difficultyLabels[challenge.difficulty]}
                    </span>
                    {status === 'today' && (
                      <span className="text-xs font-bold text-accent-600 bg-accent-50 px-2 py-0.5 rounded border border-accent-200">
                        TODAY
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {challenge.title || 'Daily Challenge'}
                  </p>
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                  {status === 'completed' && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-xs font-bold">Done</span>
                    </div>
                  )}
                  {status === 'future' && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <Lock className="w-4 h-4" />
                      <span className="text-xs font-bold">Locked</span>
                    </div>
                  )}
                  {(status === 'today' || status === 'missed') && (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Legend</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-500"></div>
            <span className="text-gray-600">Today's challenge</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-gray-600">Available to try</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="text-gray-600">Future challenge</span>
          </div>
        </div>
      </div>
    </div>
  );
}
