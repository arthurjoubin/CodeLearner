import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getLevelFromXp } from '../types';
import { Heart, Flame, Star, Zap, FlaskConical } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useUser();

  if (!user) return null;

  const levelInfo = getLevelFromXp(user.xp);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b-2 border-black sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="font-black text-lg text-black uppercase tracking-tight">
                ReactQuest
              </span>
            </Link>

            {/* Stats */}
            <div className="flex items-center gap-3">
              <Link to="/labs" className="p-1.5 hover:bg-gray-100 transition-colors" title="Labs">
                <FlaskConical className="w-5 h-5 text-black" />
              </Link>

              {/* Streak */}
              <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 text-xs font-bold">
                <Flame className="w-4 h-4 text-orange-500" />
                {user.streak}
              </div>

              {/* Hearts */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: user.maxHearts }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 ${i < user.hearts ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>

              {/* XP */}
              <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 text-xs font-bold">
                <Star className="w-4 h-4 text-yellow-600" />
                {user.xp}
              </div>

              {/* Level */}
              <div className="hidden sm:block text-xs font-bold text-gray-500">
                Lv.{levelInfo.level}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-400">
          ReactQuest - Learn React & TypeScript
        </div>
      </footer>
    </div>
  );
}
