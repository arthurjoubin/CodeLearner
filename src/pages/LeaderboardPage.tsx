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
        <h1 className="text-3xl font-black uppercase tracking-tight">Leaderboard</h1>
        <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
      </div>

      <div className="border-2 border-black">
        <div className="bg-black text-white px-4 py-3 font-bold uppercase text-sm flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          Top Learners
        </div>

        {users.map((u, index) => {
          const rank = index + 1;
          const isCurrentUser = user && u.id === user.id;

          return (
            <div
              key={u.id}
              className={`px-4 py-3 flex items-center justify-between border-b border-black last:border-b-0 transition-colors ${isCurrentUser ? 'bg-primary-50' : 'hover:bg-gray-50'} ${rank % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`font-mono font-bold w-8 ${rank <= 3 ? 'text-xl' : ''} ${rank <= 3 ? 'text-primary-600' : ''}`}>
                  {rank <= 3 ? ['#1', '#2', '#3'][rank - 1] : `#${rank}`}
                </span>
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt={u.name} className="w-8 h-8 border border-black" />
                ) : (
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-xs">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-bold">{u.name}</span>
                {isCurrentUser && <span className="text-xs bg-primary-500 text-white px-1.5 py-0.5">YOU</span>}
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="text-primary-600">{u.streak}🔥</span>
                <span>Lv.{u.level}</span>
                <span className="font-mono">{u.xp.toLocaleString()} XP</span>
              </div>
            </div>
          );
        })}

        {user && (
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold">—</span>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 border border-white" />
              ) : (
                <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-xs">
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
