import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Trophy } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getLevelFromXp } from '../types';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak: number;
}

export default function LeaderboardPage() {
  const { user } = useUser();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeaderboard()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const currentUserLevel = user ? getLevelFromXp(user.xp).level : 0;

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative inline-block group mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">Leaderboard</h1>
        <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-3 font-bold uppercase text-sm flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          Top Learners
        </div>

        {users.map((u, index) => {
          const rank = index + 1;
          const isCurrentUser = user && u.id === user.id;

          return (
            <div
              key={u.id}
              className={`px-4 py-3 flex items-center justify-between border-b border-gray-100 last:border-b-0 transition-colors ${isCurrentUser ? 'bg-primary-50' : 'hover:bg-gray-50'} ${rank % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {rank <= 3 && <div className="w-2 h-2 bg-primary-500 rounded-full" />}
                  <span className={`font-mono font-bold w-8 ${rank <= 3 ? 'text-lg' : ''} ${rank <= 3 ? 'text-primary-600' : 'text-gray-600'}`}>
                    {rank <= 3 ? ['#1', '#2', '#3'][rank - 1] : `#${rank}`}
                  </span>
                </div>
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt={u.name} className="w-8 h-8 border border-gray-200 rounded-lg" />
                ) : (
                  <div className="w-8 h-8 bg-primary-500 text-white flex items-center justify-center font-bold text-xs rounded-lg">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-bold text-gray-900">{u.name}</span>
                {isCurrentUser && <span className="text-xs bg-primary-500 text-white px-1.5 py-0.5 rounded">YOU</span>}
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="text-primary-600">{u.streak}🔥</span>
                <span className="text-gray-600">Lv.{u.level}</span>
                <span className="font-mono text-gray-500">{u.xp.toLocaleString()} XP</span>
              </div>
            </div>
          );
        })}

        {user && (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span className="font-mono font-bold text-primary-500">—</span>
              </div>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 border border-gray-600 rounded-lg" />
              ) : (
                <div className="w-8 h-8 bg-primary-500 text-white flex items-center justify-center font-bold text-xs rounded-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-bold">{user.name} (you)</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-primary-400">{user.streak}🔥</span>
              <span>Lv.{currentUserLevel}</span>
              <span className="font-mono">{user.xp.toLocaleString()} XP</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
