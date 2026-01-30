import { useState } from 'react';
// Link will be replaced by standard anchor tags for Astro compatibility

import { useUser, UserProvider } from '../context/UserContext';
import { getLevelFromXp, getXpProgress } from '../types';
import { Flame, FlaskConical, Trophy, Lightbulb, Menu, X, LogOut, BookOpen, Tag, Github, Twitter, Mail } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

// Wrapped in internal component to allow usage of useUser in the parent
function LayoutContent({ children }: LayoutProps) {
  const { user, isGuest, logout, loading } = useUser();
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
    <div className="min-h-screen flex flex-col relative">
      <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <span className="text-xl font-bold tracking-widest text-gray-900">HACK<span className="text-primary-500">UP</span></span>
                <div className="absolute -bottom-0.5 left-0 w-6 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
              </div>
            </a>

            {isGuest ? (
              <div className="flex items-center gap-3 sm:gap-4">
                <a href="/learning-path" className="text-xs font-bold text-gray-700 hover:text-primary-600 transition-colors uppercase">
                  Learning Paths
                </a>
                <a href="/resources" className="text-xs font-bold text-gray-700 hover:text-primary-600 transition-colors uppercase">
                  Resources
                </a>
                <a
                  href="/login"
                  className="flex items-center gap-1 bg-gray-900 text-white px-3 py-1.5 text-xs font-bold hover:bg-gray-700 transition-colors rounded"
                >
                  Login
                </a>
              </div>
            ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <a href="/labs" className="flex items-center gap-1 px-2 py-1.5 border border-transparent hover:border-gray-300 rounded transition-colors group" title="Labs">
                <FlaskConical className="w-4 h-4 text-gray-600 group-hover:text-primary-600 transition-colors" />
                <span className="text-xs font-bold hidden sm:inline text-gray-700 group-hover:text-primary-600 transition-colors uppercase">Lab</span>
              </a>

              <div className="relative">
                <button
                  onClick={() => setStreakPopupOpen(!streakPopupOpen)}
                  className="flex items-center gap-1 bg-gray-900 text-white px-2 py-1.5 text-xs font-bold hover:bg-gray-700 transition-colors rounded"
                >
                  <Flame className="w-4 h-4" />
                  <span>{user.streak}</span>
                </button>
                {streakPopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setStreakPopupOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-gray-300 rounded-lg z-50 overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b-2 border-gray-200">
                        <Flame className="w-4 h-4 text-primary-500" />
                        <span className="font-bold uppercase text-xs text-gray-900">Streak</span>
                        <span className="ml-auto text-primary-600 font-bold">{user.streak} days</span>
                      </div>
                      <div className="p-3 space-y-2 text-xs">
                        <p className="text-gray-600">Daily practice keeps your streak alive.</p>
                        <div className="pt-1 space-y-1">
                          <p className="font-bold uppercase text-gray-900 text-[10px]">XP Bonus</p>
                          <div className="flex justify-between text-gray-700">
                            <span>7+ days</span>
                            <span className="text-primary-600 font-mono font-bold">+10%</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>30+ days</span>
                            <span className="text-primary-600 font-mono font-bold">+25%</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>100+ days</span>
                            <span className="text-primary-600 font-mono font-bold">+50%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setLevelPopupOpen(!levelPopupOpen)}
                  className="flex items-center gap-1 border border-gray-300 px-2 py-1.5 text-xs font-bold hover:bg-gray-900 hover:text-white transition-colors rounded bg-white"
                >
                  <span className="hidden sm:inline text-[10px] text-gray-500 uppercase">{levelInfo.title}</span>
                  <span>Lvl {levelInfo.level}</span>
                </button>
                {levelPopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLevelPopupOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-gray-300 rounded-lg z-50 overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b-2 border-gray-200">
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                        <span className="font-bold uppercase text-xs text-gray-900">{levelInfo.title}</span>
                        <span className="ml-auto text-primary-600 font-bold text-xs">{user.xp} XP</span>
                      </div>
                      <div className="p-3 space-y-2 text-xs">
                        {user.recentXp > 0 && (
                          <div className="bg-primary-50 border-2 border-primary-200 rounded px-3 py-2">
                            <div className="text-primary-700 font-bold uppercase text-[10px]">Recent Session</div>
                            <div className="text-primary-600 font-bold">+{user.recentXp} XP</div>
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="font-bold uppercase text-gray-900 text-[10px]">XP Rewards</p>
                          <div className="flex justify-between text-gray-700">
                            <span>Lesson</span>
                            <span className="font-mono font-bold text-primary-600">+100</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>Module</span>
                            <span className="font-mono font-bold text-primary-600">+500</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>Learning Path</span>
                            <span className="font-mono font-bold text-primary-600">+2000</span>
                          </div>
                        </div>
                        <div className="border-t-2 border-gray-200 pt-2">
                          {levelInfo.maxXp !== Infinity && (
                            <div>
                              <div className="flex justify-between text-[10px] text-gray-500 mb-1 uppercase font-bold">
                                <span>Lvl {levelInfo.level}</span>
                                <span>Lvl {levelInfo.level + 1}</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                                  style={{ width: `${getXpProgress(user.xp)}%` }}
                                />
                              </div>
                              <div className="text-center mt-1">
                                <span className="text-[10px] text-gray-500">{levelInfo.maxXp - user.xp} XP to next level</span>
                              </div>
                            </div>
                          )}
                          {levelInfo.maxXp === Infinity && (
                            <div className="text-center">
                              <span className="text-[10px] text-gray-500">Max level reached!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1.5 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-colors rounded"
                  title="Menu"
                >
                  {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg z-50">
                      <div className="py-1">
                        <a
                          href="/leaderboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Trophy className="w-4 h-4" /> Leaderboard
                        </a>
                        <a
                          href="/learning-path"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Lightbulb className="w-4 h-4" /> Learning Paths
                        </a>
                        <a
                          href="/resources"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <BookOpen className="w-4 h-4" /> Resources
                        </a>
                        <a
                          href="/resources/devfinds"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50"
                        >
                          <Tag className="w-4 h-4" /> Dev Finds
                        </a>
                        <hr className="my-1 border-gray-200" />
                        <button
                          onClick={() => { logout(); setMenuOpen(false); }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                        >
                          <LogOut className="w-4 h-4" /> Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-3 pt-4 w-full">
        {children}
      </main>

      <footer className="border-t border-gray-300 mt-auto">
        <div className="max-w-6xl mx-auto px-3 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-widest text-gray-900">HACK<span className="text-primary-500">UP</span></span>
              <span className="text-xs text-gray-500">© 2025</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/resources" className="text-xs font-bold text-gray-600 hover:text-primary-600 transition-colors uppercase">Resources</a>
              <a href="/resources/devfinds" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors uppercase">Dev Finds</a>
              <a href="/leaderboard" className="text-xs font-bold text-gray-600 hover:text-primary-600 transition-colors uppercase">Leaderboard</a>
              <a href="/labs" className="text-xs font-bold text-gray-600 hover:text-primary-600 transition-colors uppercase">Labs</a>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="mailto:hello@hackup.dev" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Learn to code, one day at a time</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  );
}
