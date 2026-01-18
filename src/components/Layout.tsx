import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getLevelFromXp, getXpProgress } from '../types';
import { Heart, Flame, Star, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useUser();

  if (!user) return null;

  const levelInfo = getLevelFromXp(user.xp);
  const xpProgress = getXpProgress(user.xp);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-4 border-black sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center border-3 border-black">
                <Zap className="w-7 h-7 text-yellow-400" />
              </div>
              <span className="font-bold text-2xl text-black uppercase tracking-tight">
                ReactQuest
              </span>
            </Link>

            {/* Stats */}
            <div className="flex items-center gap-4">
              {/* Streak */}
              <div className="streak-badge">
                <Flame className="w-5 h-5" />
                <span>{user.streak}</span>
              </div>

              {/* Hearts */}
              <div className="flex items-center gap-1 bg-white border-2 border-black px-2 py-1">
                {Array.from({ length: user.maxHearts }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 transition-all ${
                      i < user.hearts
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* XP/Level */}
              <div className="flex items-center gap-3">
                <div className="xp-badge">
                  <Star className="w-4 h-4" />
                  <span>{user.xp} XP</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs text-black font-bold mb-1 uppercase">
                    Lvl {levelInfo.level} - {levelInfo.title}
                  </div>
                  <div className="w-24 progress-bar h-3">
                    <div
                      className="progress-fill"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white border-t-4 border-black mt-auto py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm font-mono uppercase">
          ReactQuest - Learn React & TypeScript interactively
        </div>
      </footer>
    </div>
  );
}
