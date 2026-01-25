import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getLevelFromXp } from '../types';
import { Flame, FlaskConical, LogIn, LogOut, Trophy, HelpCircle, Lightbulb, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isGuest, login, logout, loading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [levelPopupOpen, setLevelPopupOpen] = useState(false);
  const [streakPopupOpen, setStreakPopupOpen] = useState(false);

  if (loading) {
    return (
      <div className="loading-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const levelInfo = getLevelFromXp(user.xp);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <span className="text-lg font-bold tracking-widest text-gray-900">HACK<span className="text-primary-500">UP</span></span>
                <div className="absolute -bottom-0.5 left-0 w-6 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/labs" className="flex items-center gap-1.5 px-2 py-1.5 group relative" title="Labs">
                <span className="text-xs font-medium hidden sm:inline text-gray-900 group-hover:text-primary-600 transition-colors">Lab</span>
                <FlaskConical className="w-4 h-4 text-gray-700 group-hover:text-primary-600 transition-colors" />
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </Link>

              <div className="relative">
                <button
                  onClick={() => setStreakPopupOpen(!streakPopupOpen)}
                  className="flex items-center gap-1.5 bg-gray-900 text-white px-2 sm:px-2.5 py-1.5 text-sm font-bold hover:bg-gray-700 transition-colors rounded"
                >
                  <Flame className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.streak}</span>
                </button>
                {streakPopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setStreakPopupOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg z-50">
                      <div className="bg-gray-900 text-white px-3 py-2 font-bold uppercase text-sm flex items-center gap-2 rounded-t-lg">
                        🔥 Streak
                      </div>
                      <div className="p-3 space-y-1 text-sm">
                        <p className="text-gray-700">Daily practice keeps your streak alive.</p>
                        <p className="font-bold pt-1 text-gray-900">XP Bonus:</p>
                        <p className="text-gray-700">7+ days: <span className="text-primary-600 font-mono font-bold">+10%</span></p>
                        <p className="text-gray-700">30+ days: <span className="text-primary-600 font-mono font-bold">+25%</span></p>
                        <p className="text-gray-700">100+ days: <span className="text-primary-600 font-mono font-bold">+50%</span></p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setLevelPopupOpen(!levelPopupOpen)}
                  className="flex items-center gap-1.5 border border-gray-300 px-2 sm:px-2.5 py-1.5 text-sm font-bold hover:bg-gray-900 hover:text-white transition-colors rounded bg-white"
                >
                  <span className="hidden sm:inline">Lvl {levelInfo.level}</span>
                  <span className="sm:hidden">Lvl{levelInfo.level}</span>
                </button>
                {levelPopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLevelPopupOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg z-50">
                      <div className="bg-gray-900 text-white px-3 py-2 font-bold uppercase text-sm flex items-center gap-2 rounded-t-lg">
                        ⭐ Earn XP
                      </div>
                      <div className="p-3 space-y-2 text-sm">
                        {user.recentXp > 0 && (
                          <div className="bg-primary-50 border border-primary-200 rounded px-3 py-2 mb-2">
                            <div className="text-primary-700 font-bold">Recent Session</div>
                            <div className="text-primary-600">+{user.recentXp} XP earned</div>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-700">Lesson</span>
                          <span className="font-mono font-bold text-primary-600">+50</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Exercise</span>
                          <span className="font-mono font-bold text-primary-600">+100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Module</span>
                          <span className="font-mono font-bold text-primary-600">+500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Path</span>
                          <span className="font-mono font-bold text-primary-600">+2000</span>
                        </div>
                        <hr className="border-gray-200 my-2" />
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Next level in</div>
                          <div className="font-mono font-bold text-gray-900">
                            {levelInfo.maxXp === Infinity ? '∞' : levelInfo.maxXp - user.xp} XP
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1.5 hover:bg-gray-100 transition-colors rounded"
                  title="Menu"
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg z-50">
                      <div className="py-1">
                        <Link
                          to="/leaderboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 group"
                        >
                          <Trophy className="w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors" />
                          <span className="text-gray-900 group-hover:text-primary-600 transition-colors">Leaderboard</span>
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                        </Link>
                        <Link
                          to="/help"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 group"
                        >
                          <HelpCircle className="w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors" />
                          <span className="text-gray-900 group-hover:text-primary-600 transition-colors">How it works</span>
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                        </Link>
                        <Link
                          to="/feedback"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 group"
                        >
                          <Lightbulb className="w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors" />
                          <span className="text-gray-900 group-hover:text-primary-600 transition-colors">Give feedback</span>
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                        </Link>
                        <hr className="my-1 border-gray-200" />
                        {isGuest ? (
                          <button
                            onClick={() => { login(); setMenuOpen(false); }}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left group"
                          >
                            <LogIn className="w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors" />
                            <span className="text-gray-900 group-hover:text-primary-600 transition-colors">Log in</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => { logout(); setMenuOpen(false); }}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left text-red-600"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Log out</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 py-4">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-300 py-2">
        <div className="max-w-6xl mx-auto px-3 text-center text-xs text-gray-600">
          HACKUP - Learn to Code by Doing
        </div>
      </footer>

    </div>
  );
}
